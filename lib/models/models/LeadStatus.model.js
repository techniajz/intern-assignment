const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const LeadStatusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        status:{
            type:Number,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated',
        },
        id: false,
        toJSON: {
            getters: true,
        },
        toObject: {
            getters: true,
        },
    }
);

module.exports = mongoose.model('LeadStatus', LeadStatusSchema);
