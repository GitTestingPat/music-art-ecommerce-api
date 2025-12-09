const express = require('express');
const router = express.Router();
const { Cart, CartItem, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito del usuario actual
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      },
      include: [
        {
          model: CartItem,
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

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        status: 'active'
      });
    }

    // Calcular total
    const total = cart.items.reduce((sum, item) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    res.json({
      cart,
      total: total.toFixed(2),
      itemCount: cart.items.length
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 */
router.post('/items', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verificar que el producto existe y hay stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Stock insuficiente',
        available: product.stock
      });
    }

    // Obtener o crear carrito
    let cart = await Cart.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      }
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        status: 'active'
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ 
          message: 'Stock insuficiente para la cantidad solicitada',
          available: product.stock,
          currentInCart: existingItem.quantity
        });
      }

      await existingItem.update({ quantity: newQuantity });
      
      return res.json({
        message: 'Cantidad actualizada en el carrito',
        cartItem: existingItem
      });
    }

    // Agregar nuevo item
    const cartItem = await CartItem.create({
      cartId: cart.id,
      productId,
      quantity
    });

    const itemWithProduct = await CartItem.findByPk(cartItem.id, {
      include: [{ model: Product, as: 'product' }]
    });

    res.json({
      message: 'Producto agregado al carrito',
      cartItem: itemWithProduct
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Actualizar cantidad de un item en el carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 */
router.put('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(req.params.itemId, {
      include: [
        {
          model: Cart,
          as: 'Cart',
          where: { userId: req.user.id }
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu carrito' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Stock insuficiente',
        available: cartItem.product.stock
      });
    }

    await cartItem.update({ quantity });

    res.json({
      message: 'Cantidad actualizada',
      cartItem
    });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ message: 'Error al actualizar item', error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Eliminar un item del carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item eliminado
 */
router.delete('/items/:itemId', authMiddleware, async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.itemId, {
      include: [{
        model: Cart,
        as: 'Cart',
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu carrito' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ message: 'Error al eliminar item', error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Vaciar el carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { 
        userId: req.user.id,
        status: 'active'
      }
    });

    if (!cart) {
      return res.status(404).json({ message: 'No tienes un carrito activo' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ message: 'Error al vaciar carrito', error: error.message });
  }
});

module.exports = router;