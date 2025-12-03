const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },

  price: {
    type: Number,
    required: [true, 'Please enter a product price'],
    min: [0, 'Product price cannot be negative'],
    },

 description: {
        type: String,
        maxlength: [1000, 'Product name cannot exceed 1000 characters'],
    }

});


const Product = mongoose.model(product, productSchema);

module.exports= Product;
