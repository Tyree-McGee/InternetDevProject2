const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    customer:{
        type: mongoose.ObjectId,
        ref: 'Customer'
    },
    items: [{
        type: mongoose.ObjectId,
        ref: 'Items'
    }]
})

const CartModel = mongoose.model('Cart',CartSchema);

module.exports = CartModel;