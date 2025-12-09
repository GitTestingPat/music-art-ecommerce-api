const express = require('express');
const router = express.Router();
const { Coupon } = require('../models');
const { authMiddleware, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Listar cupones (solo admin)
 *     tags: [Cupones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupones
 */
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(coupons);
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    res.status(500).json({ message: 'Error al obtener cupones', error: error.message });
  }
});

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Validar un cupón
 *     tags: [Cupones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - amount
 *             properties:
 *               code:
 *                 type: string
 *               amount:
 *                 type: number
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cupón válido con descuento calculado
 */
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, amount, categories = [] } = req.body;

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ 
        valid: false,
        message: 'Cupón no encontrado'
      });
    }

    // Validar cupón
    const validation = coupon.isValid();
    if (!validation.valid) {
      return res.status(400).json(validation);
    }

    // Verificar monto mínimo
    if (amount < coupon.minPurchase) {
      return res.status(400).json({
        valid: false,
        message: `Compra mínima de $${coupon.minPurchase} requerida`,
        minPurchase: coupon.minPurchase
      });
    }

    // Verificar categorías aplicables
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const hasApplicableCategory = categories.some(cat => 
        coupon.applicableCategories.includes(cat)
      );

      if (!hasApplicableCategory) {
        return res.status(400).json({
          valid: false,
          message: 'Este cupón no es aplicable a los productos en tu carrito'
        });
      }
    }

    // Calcular descuento
    const discount = coupon.calculateDiscount(amount);

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discount: discount.toFixed(2),
      finalAmount: (amount - discount).toFixed(2)
    });
  } catch (error) {
    console.error('Error al validar cupón:', error);
    res.status(500).json({ message: 'Error al validar cupón', error: error.message });
  }
});

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Crear un cupón (solo admin)
 *     tags: [Cupones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               minPurchase:
 *                 type: number
 *               maxDiscount:
 *                 type: number
 *               usageLimit:
 *                 type: integer
 *               perUserLimit:
 *                 type: integer
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               applicableCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Cupón creado
 */
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      code: req.body.code.toUpperCase()
    };

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      message: 'Cupón creado exitosamente',
      coupon
    });
  } catch (error) {
    console.error('Error al crear cupón:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El código de cupón ya existe' });
    }
    
    res.status(500).json({ message: 'Error al crear cupón', error: error.message });
  }
});

/**
 * @swagger
 * /api/coupons/{id}:
 *   put:
 *     summary: Actualizar un cupón (solo admin)
 *     tags: [Cupones]
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
 *         description: Cupón actualizado
 */
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    if (req.body.code) {
      req.body.code = req.body.code.toUpperCase();
    }

    await coupon.update(req.body);

    res.json({
      message: 'Cupón actualizado',
      coupon
    });
  } catch (error) {
    console.error('Error al actualizar cupón:', error);
    res.status(500).json({ message: 'Error al actualizar cupón', error: error.message });
  }
});

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Eliminar un cupón (solo admin)
 *     tags: [Cupones]
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
 *         description: Cupón eliminado
 */
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    await coupon.destroy();

    res.json({ message: 'Cupón eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cupón:', error);
    res.status(500).json({ message: 'Error al eliminar cupón', error: error.message });
  }
});

module.exports = router;