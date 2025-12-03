const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user:{
        type:String,
        required:[true, "user is required"]
    },
    product:{
        type:String,
        required:[true, "product is required"]
    }
});


const Order = mongoose.model('order',orderSchema)

module.export = Order;