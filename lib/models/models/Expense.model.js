// expenseModel.js

const mongoose = require('mongoose');
Schema = mongoose.Schema

const expenseSchema = new mongoose.Schema({
    empId:{
        type: Schema.Types.ObjectId,
        ref: 'employees',
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'employees',
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['officeExpense', 'others'],
        required: true
    },
    details: {
        type: String,
        default: ""
    },
    paidTo: {
        type: String,
        default: ""
    },
    amountPaid: {
        type: Number,
        required: true
    },
    modeOfPayment: {
        type: String,
        enum: ['NEFT', 'RTGS', 'UPI', 'cheque', 'cash'],
        required: true
    },
    chequeNumber: {
        type: String,
        default: ""
    },
    billImage: {
        type: String,
        default: ""
    }, // Image or PDF link
    remark: {
        type: String,
        default: ""
    },
    particulars: {
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
    });

module.exports = mongoose.model('Expense', expenseSchema);