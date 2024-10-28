const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const AttendanceHistorySchema = require("../schemas/attendance.schema");
const AttendanceSchema = new Schema(
    {
        empId:{
            type: Schema.Types.ObjectId,
            ref: 'employees',
        },
        attDate:{
            type:Number,
            default:null
        },
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
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isLeave: {
            type: Boolean,
            default: false,
        },
        history: [AttendanceHistorySchema],
        totalHours: {
            type: String,
            default:0
        },
        inAddress: {
            type: String,
            default: ""
        },
        outAddress: {
            type: String,
            default: ""
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

module.exports = mongoose.model('Attendance', AttendanceSchema);