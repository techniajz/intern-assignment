const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const LeadTimelineSchema = new Schema(
    {
        LeadId: {
            type: Schema.Types.ObjectId,
            ref: 'Lead',
            default: null
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            default: null
        },
        remark: {
            type: Schema.Types.ObjectId,
            ref: 'Remark',
            default: null
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        leadFile: {
            type: String,
            default:''
        },
        leadDate: {
            type: Number,
            default:null
        },
        scheduleDate:{
            type: Number,
            default:null
        },
        comment: {
            type: String,
            default:''
        },
        isNotificationSend : {
            type: Boolean,
            default: false,
        },
        followUpTime : {
            type: Date,
        },
        projectId : {
            type: Schema.Types.ObjectId,
            ref: 'projects',
            default: null
        },
        taskStatus : {
            type: Number,
            default: 0 // 0 => Info, 1 => Open, 2 => Closed
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

module.exports = mongoose.model('LeadTimeline', LeadTimelineSchema);
