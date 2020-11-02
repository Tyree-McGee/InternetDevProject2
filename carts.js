const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    customer:{
        type: mongoose.ObjectId,
        ref: 'Customer'
    },
    item: [{
        type: mongoose.ObjectId,
        ref: 'Item'
    }]
})

const CartModel = mongoose.model('Cart',CartSchema);

module.exports = CartModel;