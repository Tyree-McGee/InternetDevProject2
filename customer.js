const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    firstName : String,
    lastName: String,
    email: String,
    password:String,
    carts: [{
        type: mongoose.ObjectId,
        ref: 'Carts'
    }]

})

const CustomerModel = mongoose.model('Customer',CustomerSchema);

module.exports = CustomerModel;