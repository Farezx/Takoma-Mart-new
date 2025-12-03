const Product = require('../models/Product');

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }    
};

module.exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = new Product({
            name,
            price,
            description
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports.updateProduct = async (req, res) => {    
    try {
        const productId = req.params.id;
        const { name, price, description } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, description },
            { new: true, runValidators: true }
        );

        res.status(201).json(updatedProduct);
     
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
       
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findOneAndDelete(productId)
        res.status(201).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};