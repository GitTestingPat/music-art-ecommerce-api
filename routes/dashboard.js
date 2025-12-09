const express = require('express');
const router = express.Router();
const { 
  User, 
  Product, 
  Order, 
  OrderItem, 
  Review 
} = require('../models');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas generales (solo admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del e-commerce
 */
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    // Total de usuarios
    const totalUsers = await User.count();
    
    // Total de productos
    const totalProducts = await Product.count();
    
    // Total de órdenes
    const totalOrders = await Order.count();
    
    // Ingresos totales
    const revenue = await Order.sum('total', {
      where: {
        status: {
          [Op.in]: ['processing', 'shipped', 'delivered']
        }
      }
    });
    
    // Órdenes pendientes
    const pendingOrders = await Order.count({
      where: { status: 'pending' }
    });
    
    // Productos con bajo stock
    const lowStockProducts = await Product.count({
      where: {
        stock: {
          [Op.lte]: 5
        }
      }
    });
    
    // Promedio de calificación general
    const avgRating = await Review.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'average']
      ],
      raw: true
    });
    
    // Nuevos usuarios este mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue: parseFloat(revenue || 0).toFixed(2),
        pendingOrders,
        lowStockProducts,
        averageRating: parseFloat(avgRating?.average || 0).toFixed(1),
        newUsersThisMonth
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
});

/**
 * @swagger
 * /api/dashboard/sales:
 *   get:
 *     summary: Obtener reporte de ventas (solo admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Reporte de ventas
 */
router.get('/sales', authMiddleware, isAdmin, async (req, res) => {
  try {
    const period = req.query.period || 'month';
    
    // Definir fecha de inicio según período
    const startDate = new Date();
    switch(period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Ventas por día
    const salesByDay = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders'],
        [sequelize.fn('SUM', sequelize.col('total')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate
        },
        status: {
          [Op.in]: ['processing', 'shipped', 'delivered']
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    // Productos más vendidos
    const topProducts = await OrderItem.findAll({
      attributes: [
        'productId',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'revenue']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['name', 'category']
      }],
      group: ['productId'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Ventas por categoría
    const salesByCategory = await OrderItem.findAll({
      attributes: [
        [sequelize.col('product.category'), 'category'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold'],
        [sequelize.fn('SUM', sequelize.literal('quantity * CartItem.price')), 'revenue']
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: []
      }],
      group: [sequelize.col('product.category')],
      raw: true
    });

    res.json({
      period,
      salesByDay,
      topProducts,
      salesByCategory
    });
  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error);
    res.status(500).json({ message: 'Error al obtener reporte de ventas', error: error.message });
  }
});

/**
 * @swagger
 * /api/dashboard/inventory:
 *   get:
 *     summary: Reporte de inventario (solo admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de inventario
 */
router.get('/inventory', authMiddleware, isAdmin, async (req, res) => {
  try {
    // Productos con bajo stock
    const lowStock = await Product.findAll({
      where: {
        stock: {
          [Op.lte]: 5,
          [Op.gt]: 0
        }
      },
      order: [['stock', 'ASC']],
      limit: 20
    });

    // Productos sin stock
    const outOfStock = await Product.findAll({
      where: { stock: 0 },
      limit: 20
    });

    // Stock por categoría
    const stockByCategory = await Product.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalProducts'],
        [sequelize.fn('SUM', sequelize.col('stock')), 'totalStock'],
        [sequelize.fn('SUM', sequelize.literal('stock * price')), 'inventoryValue']
      ],
      group: ['category'],
      raw: true
    });

    // Valor total del inventario
    const totalInventoryValue = await Product.sum(
      sequelize.literal('stock * price')
    );

    res.json({
      lowStock,
      outOfStock,
      stockByCategory,
      totalInventoryValue: parseFloat(totalInventoryValue || 0).toFixed(2)
    });
  } catch (error) {
    console.error('Error al obtener reporte de inventario:', error);
    res.status(500).json({ message: 'Error al obtener reporte de inventario', error: error.message });
  }
});

/**
 * @swagger
 * /api/dashboard/customers:
 *   get:
 *     summary: Reporte de clientes (solo admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de clientes
 */
router.get('/customers', authMiddleware, isAdmin, async (req, res) => {
  try {
    // Clientes con más órdenes
    const topCustomers = await Order.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'totalOrders'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalSpent']
      ],
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      }],
      group: ['userId'],
      order: [[sequelize.fn('SUM', sequelize.col('total')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Nuevos clientes por mes
    const newCustomersByMonth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
      raw: true
    });

    res.json({
      topCustomers,
      newCustomersByMonth
    });
  } catch (error) {
    console.error('Error al obtener reporte de clientes:', error);
    res.status(500).json({ message: 'Error al obtener reporte de clientes', error: error.message });
  }
});

module.exports = router;