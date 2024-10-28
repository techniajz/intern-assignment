const mongoose = require('mongoose'),
    Schema = mongoose.Schema
const LocationTruckSchema = new Schema(
    {
        empId:{
            type: Schema.Types.ObjectId,
            ref: 'employees',
        },
        truckTime:{
            type:Number,
            default:null
        },
        loc: {
            type: { type: String, default: '' },
            coordinates: [{
                type: Number
            }]
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

module.exports = mongoose.model('LocationTruck', LocationTruckSchema);
