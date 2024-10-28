const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const SalariesSchema = new Schema(
    {
        employee_id: {
            type: Schema.Types.ObjectId,
            ref:"employees"
        },
        total_salary:{
            type:Number,
            default:0,
        },
        credited_salary:{
            type:Number,
            default:0,
        },
        incentives:{
            type:Number,
            default:0,
        },
        leaves:{
            type:Number,
            default:0,
        },
        employee_working_days:{
            type:Number,
            default:0,
        },
        diductions:{
            type:Number,
            default:0,
        },
        advace:{
            type:Number,
            default:0,
        },
        number_of_total_working_day:{
            type:Number,
            default:0,
        },
        week_off_days:{
            type:Number,
            default:0,
        },
        holidays:{
            type:Number,
            default:0,
        },
        year:{
            type:Number,
            default:0,
        },
        month:{
            type:Number,
            default:0,
        },
        status:{
            type:String,
            enum:['paid','unpaid','processed'],
            default:'processed'
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        salaryType:{
            type:String,
            enum:['salary','incentive','advance'],
            default:'salary'
        },
        comment:{
            type:String,
            default:''
        },
        leadId:{
            type: Schema.Types.ObjectId,
            ref:"leads",
            default:null
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

module.exports = mongoose.model('Salaries', SalariesSchema);
