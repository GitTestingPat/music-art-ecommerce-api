const express = require('express');
const router = express.Router();
const { Review, Product, User, Order, OrderItem } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const { Op } = require('sequelize');

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Obtener reviews de un producto
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Lista de reviews
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { productId: req.params.productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Calcular estadísticas
    const stats = await Review.findOne({
      where: { productId: req.params.productId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
      ],
      raw: true
    });

    // Distribución de ratings
    const distribution = await Review.findAll({
      where: { productId: req.params.productId },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    res.json({
      reviews: rows,
      stats: {
        averageRating: parseFloat(stats.averageRating || 0).toFixed(1),
        totalReviews: parseInt(stats.totalReviews || 0),
        distribution: distribution.reduce((acc, item) => {
          acc[item.rating] = parseInt(item.count);
          return acc;
        }, {})
      },
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({ message: 'Error al obtener reviews', error: error.message });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Crear una review
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               productId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review creada
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar si ya tiene una review para este producto
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya has dejado una review para este producto. Puedes editarla.'
      });
    }

    // Verificar si compró el producto (review verificada)
    const hasPurchased = await OrderItem.findOne({
      include: [{
        model: Order,
        where: {
          userId: req.user.id,
          status: 'delivered'
        }
      }],
      where: { productId }
    });

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      title,
      comment,
      verified: !!hasPurchased
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      message: 'Review creada exitosamente',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Error al crear review:', error);
    res.status(500).json({ message: 'Error al crear review', error: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Actualizar una review propia
 *     tags: [Reviews]
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
 *               rating:
 *                 type: integer
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review actualizada
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    await review.update(req.body);

    const updatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.json({
      message: 'Review actualizada',
      review: updatedReview
    });
  } catch (error) {
    console.error('Error al actualizar review:', error);
    res.status(500).json({ message: 'Error al actualizar review', error: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Eliminar una review propia
 *     tags: [Reviews]
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
 *         description: Review eliminada
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    await review.destroy();

    res.json({ message: 'Review eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar review:', error);
    res.status(500).json({ message: 'Error al eliminar review', error: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   post:
 *     summary: Marcar review como útil
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review marcada como útil
 */
router.post('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review no encontrada' });
    }

    await review.increment('helpful');

    res.json({
      message: 'Gracias por tu feedback',
      helpful: review.helpful + 1
    });
  } catch (error) {
    console.error('Error al marcar review:', error);
    res.status(500).json({ message: 'Error al marcar review', error: error.message });
  }
});

module.exports = router;