const mongoose = require('mongoose');
const assetSchema = new mongoose.Schema(
    {
        assetName: {
            type: String,
            required: true,
        },
        assetType: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['inStock', 'outOfStock', 'lowStock'],
            default: 'inStock',
        },
        image: {
            type: String,
            default: '',
        },
        remark: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model('Asset', assetSchema);
