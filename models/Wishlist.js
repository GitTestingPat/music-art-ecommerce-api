const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  notifyOnDiscount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notifyOnStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'wishlists',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'],
      name: 'unique_user_product_wishlist'
    }
  ]
});

module.exports = Wishlist;