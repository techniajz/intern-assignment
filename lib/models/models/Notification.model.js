const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const NotificationSchema = new Schema(
    {
        employee_id: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        title:{
            type: String,
            default:''
        },
        description:{
            type: String,
            default: ''
        },
        type:{
            type:String,
            default: ''
        },
        projectId:{
            type: Schema.Types.ObjectId,
            ref: 'projects',
            default: null
        },
        leadId:{
            type: Schema.Types.ObjectId,
            ref: 'leads',
            default: null
        },
        notificationTime:{
            type:Number,
            default:0
        },
        referanceType:{
            type:String,
            default:''
        },
        referanceId:{
            type:String,
            default:''
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

module.exports = mongoose.model('Notification', NotificationSchema);
