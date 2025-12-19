const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productName: String, 
  productSku: String,  
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer'
    }
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Price cannot be negative'],
    get: v => parseFloat(v.toFixed(2))
  },
  subtotal: {
    type: Number,
    get: v => parseFloat(v.toFixed(2))
  },
  tax: {
    type: Number,
    get: v => parseFloat(v.toFixed(2)),
    default: 0
  },
  total: {
    type: Number,
    get: v => parseFloat(v.toFixed(2))
  }
});

// Calculate totals before saving
orderItemSchema.pre('save', function(next) {
  this.subtotal = this.quantity * this.unitPrice;
  this.total = this.subtotal + this.tax;
  next();
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  items: [orderItemSchema],
  orderType: {
    type: String,
    required: true,
    enum: ['pickup', 'delivery', 'instore'],
    default: 'instore'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  pickupTime: {
    type: Date,
    validate: {
      validator: function(v) {
        if (this.orderType === 'pickup') {
          return v && v > new Date();
        }
        return true;
      },
      message: 'Pickup time must be in the future'
    }
  },
  deliveryTime: {
    type: Date,
    validate: {
      validator: function(v) {
        if (this.orderType === 'delivery') {
          return v && v > new Date();
        }
        return true;
      },
      message: 'Delivery time must be in the future'
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
    get: v => parseFloat(v.toFixed(2))
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative'],
    get: v => parseFloat(v.toFixed(2))
  },
  shippingFee: {
    type: Number,
    min: [0, 'Shipping fee cannot be negative'],
    get: v => parseFloat(v.toFixed(2)),
    default: 0
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    get: v => parseFloat(v.toFixed(2)),
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
    get: v => parseFloat(v.toFixed(2))
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash', 'mobile_wallet', 'gift_card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate order totals from items
  if (this.isModified('items') && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    this.tax = this.items.reduce((sum, item) => sum + item.tax, 0);
    this.total = this.subtotal + this.tax + this.shippingFee - this.discount;
  }
  
  next();
});

// Middleware to update inventory when order status changes
orderSchema.pre('save', async function(next) {
  if (this.isModified('status')) {
    const Order = this.constructor;
    const oldOrder = await Order.findById(this._id);
    
    if (oldOrder && oldOrder.status !== this.status) {
      // When order is confirmed, reduce inventory
      if (this.status === 'confirmed' && oldOrder.status !== 'confirmed') {
        for (const item of this.items) {
          await mongoose.model('Product').findByIdAndUpdate(
            item.product,
            { $inc: { quantity: -item.quantity } }
          );
        }
      }
      
      // When order is cancelled, restore inventory
      if (this.status === 'cancelled' && oldOrder.status !== 'cancelled') {
        for (const item of this.items) {
          await mongoose.model('Product').findByIdAndUpdate(
            item.product,
            { $inc: { quantity: item.quantity } }
          );
        }
      }
    }
  }
  next();
});

// Indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, orderType: 1 });
orderSchema.index({ 'payment.status': 1 });

// Static method to get orders by date range
orderSchema.statics.getOrdersByDateRange = async function(startDate, endDate) {
  return this.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $nin: ['cancelled'] }
  }).populate('user', 'email name');
};

// Instance method to calculate ETA
orderSchema.methods.calculateETA = function() {
  if (this.orderType === 'delivery' && this.deliveryTime) {
    return this.deliveryTime;
  }
  if (this.orderType === 'pickup' && this.pickupTime) {
    return this.pickupTime;
  }
  return new Date(Date.now() + 60 * 60 * 1000); // Default 1 hour
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;