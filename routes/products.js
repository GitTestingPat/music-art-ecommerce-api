const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { authMiddleware, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener productos con paginación y búsqueda
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de productos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre, descripción o marca
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [instrumento, libro, arte]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Construir condiciones de búsqueda
    const where = {};
    
    // Búsqueda de texto
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
        { brand: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    // Filtro por categoría
    if (req.query.category) {
      where.category = req.query.category;
    }
    
    // Filtro por rango de precio
    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) {
        where.price[Op.gte] = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        where.price[Op.lte] = parseFloat(req.query.maxPrice);
      }
    }
    
    // Obtener productos
    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      products: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page < Math.ceil(count / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto (requiere autenticación de admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos de administrador
 */
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}/upload-image:
 *   post:
 *     summary: Subir imagen de producto (requiere autenticación de admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (jpeg, jpg, png, gif, webp, máx 5MB)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Error en el archivo
 *       404:
 *         description: Producto no encontrado
 */
router.post('/:id/upload-image', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }
    
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Guardar la ruta de la imagen
    product.image = `/uploads/${req.file.filename}`;
    await product.save();
    
    res.json({
      message: 'Imagen subida exitosamente',
      product,
      imagePath: product.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imagen', error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto (requiere autenticación de admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto (requiere autenticación de admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    await product.destroy();
    res.json({ message: 'Producto eliminado', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;