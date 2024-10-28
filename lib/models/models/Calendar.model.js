const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const CalendarSchema = new Schema(
    {
        occasion: {
            type: String,
            required: true,
            trim: true,
        },
        date_: {
            type: Number,
            default:0
        },
        status: {
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

module.exports = mongoose.model('Calendar', CalendarSchema);
