const express = require('express');
const router = express.Router();
const { Wishlist, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Obtener wishlist del usuario
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos deseados
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: 'product'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      wishlist,
      count: wishlist.length
    });
  } catch (error) {
    console.error('Error al obtener wishlist:', error);
    res.status(500).json({ message: 'Error al obtener wishlist', error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Agregar producto a wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *               notifyOnDiscount:
 *                 type: boolean
 *                 default: false
 *               notifyOnStock:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Producto agregado a wishlist
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, notifyOnDiscount = false, notifyOnStock = false } = req.body;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si ya está en la wishlist
    const existing = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (existing) {
      return res.status(400).json({ 
        message: 'El producto ya está en tu lista de deseos'
      });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId,
      notifyOnDiscount,
      notifyOnStock
    });

    const itemWithProduct = await Wishlist.findByPk(wishlistItem.id, {
      include: [{ model: Product, as: 'product' }]
    });

    res.status(201).json({
      message: 'Producto agregado a tu lista de deseos',
      wishlistItem: itemWithProduct
    });
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    res.status(500).json({ message: 'Error al agregar a wishlist', error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Eliminar producto de wishlist
 *     tags: [Wishlist]
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
 *         description: Producto eliminado de wishlist
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu wishlist' });
    }

    await wishlistItem.destroy();

    res.json({ message: 'Producto eliminado de tu lista de deseos' });
  } catch (error) {
    console.error('Error al eliminar de wishlist:', error);
    res.status(500).json({ message: 'Error al eliminar de wishlist', error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{id}/notifications:
 *   patch:
 *     summary: Actualizar notificaciones de un item
 *     tags: [Wishlist]
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
 *               notifyOnDiscount:
 *                 type: boolean
 *               notifyOnStock:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificaciones actualizadas
 */
router.patch('/:id/notifications', authMiddleware, async (req, res) => {
  try {
    const { notifyOnDiscount, notifyOnStock } = req.body;

    const wishlistItem = await Wishlist.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item no encontrado en tu wishlist' });
    }

    await wishlistItem.update({
      notifyOnDiscount,
      notifyOnStock
    });

    res.json({
      message: 'Preferencias de notificación actualizadas',
      wishlistItem
    });
  } catch (error) {
    console.error('Error al actualizar notificaciones:', error);
    res.status(500).json({ message: 'Error al actualizar notificaciones', error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/clear:
 *   delete:
 *     summary: Vaciar wishlist completa
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist vaciada
 */
router.delete('/clear/all', authMiddleware, async (req, res) => {
  try {
    await Wishlist.destroy({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Lista de deseos vaciada exitosamente' });
  } catch (error) {
    console.error('Error al vaciar wishlist:', error);
    res.status(500).json({ message: 'Error al vaciar wishlist', error: error.message });
  }
});

module.exports = router;