const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
            default: null
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
            default: null
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default:''
        },
        messageDate:{
            type:Number,
            required: true,
        },
        messageTime:{
            type:Number,
            required: true,
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

module.exports = mongoose.model('Message', MessageSchema);
