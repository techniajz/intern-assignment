const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const ProjectImageSchema = new Schema(
    {
        file_: {
            type: String,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
        },
        projectProfile:{
            type: Boolean,
            default: false,
        },
        type:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
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

module.exports = mongoose.model('ProjectImage', ProjectImageSchema);
