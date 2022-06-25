const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    storeName: {
        type: String,
    },
    pId: {
        type: Number,
        unique: true,
        sparse : true
    },
    pName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

})

var productdata = mongoose.model('product', productSchema);
module.exports = productdata;