const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Player Prop Result options
const options = {
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
};

// Player Prop Result definitions
const definitions = {
    punchIn:{
        type: Boolean,
        default: false,
    },
    punchInTime:{
        type: String,
    },
    punchOut:{
        type: Boolean,
        default: false,
    },
    punchOutTime:{
        type: String,
        default:0
    },
    loc: {
        type: { type: String, default: '' },
        coordinates: [{
            type: Number
        }]
    },
    outLoc: {
        type: { type: String, default: '' },
        coordinates: [{
            type: Number
        }]
    },
    punchInSelfi:{
        type: String,
        default: ""
    },
    punchOutSelfi:{
        type: String,
        default: ""
    },
    inAddress: {
        type: String,
        default: ""
    },
    outAddress: {
        type: String,
        default: ""
    }
};

const AttendanceHistorySchema = new Schema(definitions, options);

module.exports = AttendanceHistorySchema;