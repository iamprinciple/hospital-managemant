const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    doctorName: {type: String, required: true},
    doctorEmail: {type: String, required: true},
    patientfirstName: {type: String, required: true},
    patientlastName: {type: String, required: true},
    patientEmail: {type: String, required: true},
    aptType: { type: String, required: true },
    reason: { type: String, required: true },
    selectedTime: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const appointmentModel = mongoose.model('Appointment', appointmentSchema);
module.exports = appointmentModel;
