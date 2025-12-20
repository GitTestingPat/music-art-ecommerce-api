const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Errores de validación',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validadores
const validateRegister = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().trim(),
  body('password').notEmpty(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};