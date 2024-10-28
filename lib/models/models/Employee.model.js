const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
    bcrypt = require('bcrypt');
    const connection=mongoose.connection 
    autoIncrement.initialize(connection);

    const emergencyContactSchema = new mongoose.Schema({
        name: {
            type: String,
            default:"",
        },
        mobile: {
            type: Number,
            default:null,
        },
        relation: {
            type: String,
            default:"",
        },
    },
        { _id: false },
    );

const EmployeeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
            required: true,
        },
        mobile: {
            type:Number,
            default:null
        },
        gender: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['Admin', 'HR', 'Executive','TeleCaller'],
            default : "Executive"
        },
        designationId: {
            type: Schema.Types.ObjectId,
            ref: 'designations',
        },
        parent_ids: {
            type: Array
        },
        designation: {
            type: String,
            trim: true,
            default: '',
        },
        highest_qualification: {
            type: String,
            trim: true,
            default: '',
        },
        blood_group: {
            type: String,
            trim: true,
            default: '',
        },
        dob: {
            type: String,
            trim: true,
            default: '',
        },
        birthDate: {
            type: Date,
            default: '',
        },
        joiningDate: {
            type: Date,
            default: '',
        },
        companyName:{
            type: String,
            default : ''
        },
        alternative_number: {
            type: String,
            trim: true,
            default: '',
        },
        isWhatsappNumber:{
            type: Boolean,
            default: false,
        },
        emergency_contact: {
            type: emergencyContactSchema,
            default: () => ({}),
        },
        profile_pitcture: {
            type: String,
            trim: true,
            default: '',
        },
        current_salary: {
            type: String,
            trim: true,
            default: '',
        },
        password: {
            type: String,
        },
        deviceType: {
            type: String,
            default: '',
        },
        deviceToken: {
            type: String, // to send notification
            default: '',
        },
        deviceId: [
            {
                type: String,
            },
        ],
        otp: {
            type: String,
            default:'',
        },
        authTokenIssuedAt: Number,
        resetToken: {
            type: String,
            default:'',
        },
        emailVerify: {
            type: Boolean,
            default: false,
        },
        mobileVerify: {
            type: Boolean,
            default: false,
        },
        adminApproved: {
            type: Boolean,
            default: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        Employee_code:{
            type: String,
            default:''
        },
        address: {
            type: String,
            default:''
        },
        responsibilities:{
            type: String,
            default:''
        },
        permanentAddress: {
            type: String,
            default:''
        },
        communicationSkill: {
            type: String,
            default:''
        },
        notification_read_time:{
            type:Number,
            default:0
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActivity: {
            type: Boolean,
            default: false,
        },
        lead_visit_time:{
            type:Number,
            default:0
        },
        project_visit_time:{
            type:Number,
            default:0
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

EmployeeSchema.pre('save', async function(next) {
    const employee = this;

    if (!employee.isModified('password')) return next();
    try {
        const saltRounds = parseInt(process.env.BCRYPT_ITERATIONS, 10) || 10;
        employee.password = await bcrypt.hash(employee.password, saltRounds);
        next();
    } catch (e) {
        next(e);
    }
});

EmployeeSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (e) {
        return false;
    }
};

EmployeeSchema.plugin(autoIncrement.plugin,{
    model: 'Employee',
    field: 'id',
 });

module.exports = mongoose.model('Employee', EmployeeSchema);
