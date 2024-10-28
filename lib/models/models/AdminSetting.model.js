const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const AdminSettingSchema = new Schema(
    {
        forceUpdate: {
            type: Boolean,
            default: false,
        },
        version: {
            type: String,
            default:'',
        },
        file_:{
            type: String,
            default:'',
        }
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

module.exports = mongoose.model('AdminSetting', AdminSettingSchema);
