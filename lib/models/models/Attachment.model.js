const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const AttachmentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        upload_path: [{
            type: String,
            required: true,
            trim: true,
        }],
        empId: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
            default: null,
        },
        reference_id: {
            type: Schema.Types.ObjectId,
            ref: 'leads',
            default: null,
        },
        reference: {
            type: String,
            default: '',
            trim: true,
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

module.exports = mongoose.model('Attachment', AttachmentSchema);
