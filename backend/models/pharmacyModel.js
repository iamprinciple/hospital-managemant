const mongoose = require('mongoose')

const pharmacySchema = new mongoose.Schema({
    prodName: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: String, required: true },
    qty: { type: Number, required: true }
})

const pharmacyModel = mongoose.model('Pharmacy', pharmacySchema);
module.exports = pharmacyModel