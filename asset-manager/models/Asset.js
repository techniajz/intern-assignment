const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true , maxLength: 250},
    description: { type: String, required: true ,  maxLength: 500 },
    assignDate: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    submissionDate: { type: Date, required: true }
});

module.exports = mongoose.model('Asset', assetSchema);
