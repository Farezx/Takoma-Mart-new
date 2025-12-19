const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code']
  },
  country: {
    type: String,
    default: 'USA'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  addresses: [addressSchema],
  role: {
    type: String,
    enum: ['customer', 'staff', 'manager', 'admin'],
    default: 'customer',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  loyaltyPoints: {
    type: Number,
    min: 0,
    default: 0
  },
  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: {
    type: Date
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
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure only one default address
  if (this.isModified('addresses')) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      for (let i = 1; i < defaultAddresses.length; i++) {
        defaultAddresses[i].isDefault = false;
      }
    }
  }
  next();
});

// Password hashing (only if modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static login method
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email, isActive: true });
  if (user) {
    const auth = await user.comparePassword(password);
    if (auth) {
      user.lastLogin = Date.now();
      await user.save({ validateBeforeSave: false });
      return user;
    }
    throw new Error('Incorrect password');
  }
  throw new Error('Incorrect email');
};

// Method to get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to add address
userSchema.methods.addAddress = function(addressData) {
  const newAddress = { ...addressData };
  
  // If this is the first address, make it default
  if (this.addresses.length === 0) {
    newAddress.isDefault = true;
  }
  
  this.addresses.push(newAddress);
  return this.save();
};

// Method to set default address
userSchema.methods.setDefaultAddress = function(addressId) {
  this.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });
  return this.save();
};

// Index for search
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

const User = mongoose.model('User', userSchema);
module.exports = User;