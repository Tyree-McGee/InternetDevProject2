const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
})

const ItemModel = mongoose.model('Items', ItemSchema);

module.exports = ItemModel;