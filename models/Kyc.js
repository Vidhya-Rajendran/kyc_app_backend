
const mongoose = require('mongoose');

const KycSchema = new mongoose.Schema({
    documentPath: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Kyc', KycSchema);
        