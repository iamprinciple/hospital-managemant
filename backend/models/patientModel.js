const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    DOB: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    history: { type: String },
    email: { type: String, required: true, unique: true }
}, { timestamps: true });

const patientModel = mongoose.model('Patient', patientSchema);

module.exports = patientModel;
