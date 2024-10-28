const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    autoIncrement = require('mongoose-auto-increment');
    const connection=mongoose.connection 
    autoIncrement.initialize(connection);

const SourceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        mappedEmployee: {
            type: Schema.Types.ObjectId,
            ref: 'employee',
            default: null
        },
        apiKey: {
            type: String,
            required: true,
            trim: true
        },
        apiJsonPath: {
            type: String,
            required: true,
            trim: true
        },
        apiXmlPath: {
            type: String,
            required: true,
            trim: true
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

module.exports = mongoose.model('Source', SourceSchema);
