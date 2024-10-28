const mongoose = require('mongoose'),
    Schema = mongoose.Schema

    const FlatSizeSchema = new mongoose.Schema({
        type: {
          type: String,
         default: ''
        },
        size: {
          type: mongoose.Schema.Types.Mixed,
          default:[]
        }
      },
      { _id: false },
      );
const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        propertyType: {
            type: Schema.Types.ObjectId,
            ref: 'propertytypes',
        },
        condition: {
            type: Schema.Types.ObjectId,
            ref: 'propertyconditions',
        },
        ownershipTypes: {
            type: Schema.Types.ObjectId,
            ref: 'ownershiptypes',
        },
        location_URL: {
            type: String,
            default:''
        },
        minPrice: {
            type: String,
            default:''
        },
        maxPrice: {
            type: String,
            default:''
        },
        size:[FlatSizeSchema],
        description:{
            type:String,
            default:""
        },
        amenities:{
            type:String,
            default:""
        },
        yearBuilt:{
            type:String,
            default:''
        },
        OwnerOfProperty:{
            type:String,
            default:""
        },
        nearby:{
            type:String,
            default:""
        },
        certifications:{
            type:String,
            default:""
        },
        contactPerson:{
            type:String,
            default:""
        },
        contactNumber:{
            type:String,
            default:""
        },
        notes:{
            type:String,
            default:""
        },
        address:{
            type:String,
            default:""
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        loc: {
            type: { type: String, default: '' },
            coordinates: [{
                type: Number
            }]
        },
        location_area: {
            type:String,
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

module.exports = mongoose.model('Project', ProjectSchema);
