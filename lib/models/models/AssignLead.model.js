const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const AssignLeadSchema = new Schema(
    {
        LeadId: {
            type: Schema.Types.ObjectId,
            ref: 'leads',
            default: null
        },
        assignBy: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
            default: null
        },
        assignTo: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
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
        leadDate: {
            type: Number,
        },
        lastReadTime: {
            type: Number,
            default: 0,
        },
        shuffledBy:{
            type: Array,
            default: []
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

module.exports = mongoose.model('AssignLead', AssignLeadSchema);
