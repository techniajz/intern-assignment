const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const AssignProjectSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
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
        projectDate:{
            type:Number,
            default:0,
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

module.exports = mongoose.model('AssignProject', AssignProjectSchema);
