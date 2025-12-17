const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUppercase: true,
      len: [3, 20]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  minPurchase: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  perUserLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  applicableCategories: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

Coupon.prototype.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) return { valid: false, message: 'Cupón inactivo' };
  if (this.validFrom > now) return { valid: false, message: 'Cupón aún no válido' };
  if (this.validUntil && this.validUntil < now) return { valid: false, message: 'Cupón expirado' };
  if (this.usageLimit && this.usageCount >= this.usageLimit) return { valid: false, message: 'Cupón agotado' };
  
  return { valid: true };
};

Coupon.prototype.calculateDiscount = function(amount) {
  if (amount < this.minPurchase) return 0;
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
  }
  
  return Math.min(discount, amount);
};

module.exports = Coupon;