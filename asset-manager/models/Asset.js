const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: { type: String, default : null , maxLength: 250},
    description: { type: String, default : null ,  maxLength: 500 },
    assignDate: { type: String, default : null},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , default : null },
    submissionDate: { type: String, default : null }
});

module.exports = mongoose.model('Asset', assetSchema);
