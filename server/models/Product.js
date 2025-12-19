const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    index: true
  },
  sku: {
    type: String,
    required: [true, 'Please enter SKU'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9]{6,12}$/, 'SKU must be 6-12 alphanumeric characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter a product price'],
    min: [0, 'Product price cannot be negative'],
    get: v => parseFloat(v.toFixed(2)),
    set: v => parseFloat(v.toFixed(2))
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
    get: v => v ? parseFloat(v.toFixed(2)) : v,
    set: v => v ? parseFloat(v.toFixed(2)) : v
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Beverages', 'Frozen', 'Household', 'Other'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please enter initial quantity'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    min: [0, 'Minimum stock level cannot be negative'],
    default: 10
  },
  maxStockLevel: {
    type: Number,
    min: [0, 'Maximum stock level cannot be negative'],
    validate: {
      validator: function(v) {
        return v >= this.minStockLevel;
      },
      message: 'Max stock must be greater than or equal to min stock'
    }
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit'],
    enum: ['each', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'pack', 'dozen']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  supplier: {
    name: String,
    contact: String,
    leadTime: Number // in days
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(v) {
        // Only validate if category is perishable
        if (['Produce', 'Dairy', 'Meat'].includes(this.category)) {
          return v && v > new Date();
        }
        return true;
      },
      message: 'Expiry date must be in the future for perishable items'
    }
  },
  reorderPoint: {
    type: Number,
    min: [0, 'Reorder point cannot be negative'],
    default: function() {
      return Math.ceil(this.minStockLevel * 1.5);
    }
  },
  images: [{
    url: String,
    altText: String,
    isPrimary: Boolean
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    allergens: [String]
  },
  taxRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
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

// Update the updatedAt timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for faster searches
productSchema.index({ name: 'text', description: 'text', category: 1, brand: 1 });

// Static method to check low stock items
productSchema.statics.getLowStockItems = async function() {
  return this.find({
    $expr: { $lte: ['$quantity', '$reorderPoint'] },
    isActive: true
  });
};

// Instance method to check if product needs reorder
productSchema.methods.needsReorder = function() {
  return this.quantity <= this.reorderPoint;
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;