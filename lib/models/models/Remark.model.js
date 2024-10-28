const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const RemarkSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        selfieEnable:{
            type: Boolean,
            default: false,
        },
        calendarEnable:{
            type: Boolean,
            default: false,
        },
        projectEnable:{
            type: Boolean,
            default: false,
        },
        type:{
            type: Number,
            default: 0, // 0 => Discussion, 1 => Open Task, 2 => Submit Task  
        },
        referenceRemarkId: {
            type: [Schema.Types.ObjectId], // Array of Remark ids in case of the type being Submit Task
            default: [],
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

module.exports = mongoose.model('Remark', RemarkSchema);
