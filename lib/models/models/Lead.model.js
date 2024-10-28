const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    autoIncrement = require('mongoose-auto-increment');
    const connection=mongoose.connection 
    autoIncrement.initialize(connection);

const propertyPreferencesSchema = new mongoose.Schema(
    {
        propertyType: {
            type: Schema.Types.ObjectId,
            ref: 'propertytypes',
            default: null
        },
        locationpreferences: {
            type: Schema.Types.ObjectId,
            ref: 'locationpreferences',
            default: null
            //refPath: 'type'
        },
        budgetRange: {
            type: String,
            default: '',
        },
        NumberOfBHK: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);
const LeadSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        photo: {
            type: String,
            default:""
        },
        workingProfile:{
            type: String,
            default:""
        },
        yearlyIncome:{
            type: String,
            default:""
        },
        alternateNumber: {
            type: String,
            default:"",
            trim: true,
        },
        leadSources: {
            type: Schema.Types.ObjectId,
            ref: 'leadsources',
            default: null
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
            default: null
        },
        leadStatus:{
            type:Number,
            enum:[1,2,3],
            default:2 
            // 1= running 2=unAssigned, 3=Completed
        },
        propertyPreferences: {
            type: propertyPreferencesSchema,
            default: () => ({}),
        },
        timeline: {
            type: Schema.Types.ObjectId,
            ref: 'timelines',
            default: null
        },
        comments: {
            type: String,
            default:"",
            trim: true,
        },
        leadLabel: {
            type: Schema.Types.ObjectId,
            ref: 'leadlabels',
            default: null
        },
        gender: {
            type: String,
            default: '',
        },
        age: {
            type: String,
            default: '',
        },
        Occupation: {
            type: String,
            default: '',
        },
        leadFile: {
            type: String,
            default: '',
        },
        leadDate: {
            type: Number,
        },
        startVisit: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        crmApi: [
            {
                type: {
                    type: String,
                    required: true
                },
                referenceId: {
                    type: Number,
                    required: true
                }
            }
        ],
        apiResponse: {
            type: String
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
LeadSchema.plugin(autoIncrement.plugin,{
    model: 'Lead',
    field: 'Sequence',
 });

module.exports = mongoose.model('Lead', LeadSchema);
