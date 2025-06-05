const mongoose = require('mongoose')

const prescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    prescription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const prescriptionModel = mongoose.model('Prescriptions', prescriptionSchema);
module.exports = prescriptionModel