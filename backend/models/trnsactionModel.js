const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reference: String,
    amount: Number,
    currency: String,
    status: String,
    customer: {
        email: String,
        name: String,
    }
}, { timestamps: true })

const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;