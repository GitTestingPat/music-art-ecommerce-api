const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User } = require('../models');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const sequelize = require('../config/database');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener órdenes (admin ve todas, usuario ve solo las suyas)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const where = {};
    
    // Si no es admin, solo ver sus propias órdenes
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    
    // Filtrar por estado
    if (req.query.status) {
      where.status = req.query.status;
    }
    
    const { count, rows } = await Order.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      orders: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener órdenes', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    // Verificar que el usuario pueda ver esta orden
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta orden' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener orden', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */
router.post('/', authMiddleware, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La orden debe contener al menos un producto' });
    }
    
    let total = 0;
    const orderItems = [];
    
    // Validar stock y calcular total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      
      if (!product) {
        await t.rollback();
        return res.status(400).json({ message: `Producto ${item.productId} no encontrado` });
      }
      
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ 
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` 
        });
      }
      
      // Reducir stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction: t }
      );
      
      const itemTotal = parseFloat(product.price) * item.quantity;
      total += itemTotal;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Crear orden
    const order = await Order.create({
      userId: req.user.id,
      total,
      status: 'pending'
    }, { transaction: t });
    
    // Crear items de la orden
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction: t });
    }
    
    await t.commit();
    
    // Obtener orden completa
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });
    
    res.status(201).json(fullOrder);
  } catch (error) {
    await t.rollback();
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al crear orden', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de orden (solo admin)
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/status', authMiddleware, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Cancelar una orden
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden cancelada
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    // Verificar permisos
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta orden' });
    }
    
    await order.update({ status: 'cancelled' });
    res.json({ message: 'Orden cancelada', order });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar orden', error: error.message });
  }
});

module.exports = router;