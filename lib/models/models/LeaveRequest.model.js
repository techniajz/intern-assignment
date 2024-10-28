const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const leaveDateSchema = new Schema({
    date: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        default:""
    },
    is_paid: {
        type: Boolean,
        default: true
    },
},{_id:false}
);
const leaveRequestSchema = new mongoose.Schema({
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
    },
    dates: {
        type: [leaveDateSchema],
    },
    description: {
        type: String,
        default: ''
    },
    remark: {
        type: String,
        default:""
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    notes: {
        type: String,
        default:""
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

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
