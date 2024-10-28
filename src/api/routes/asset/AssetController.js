const Asset = require('../../../../lib/models/models/Asset.model');
const moment = require('moment');
const { uploadImage } = require('../../../../lib/util');
var _ = require('lodash');
const mongoose = require('mongoose');
const multiparty = require('multiparty');
global.ObjectId = mongoose.Types.ObjectId;
const Joi = require('joi');

const assetSchema = Joi.object({
    assetName: Joi.string().required().error(() => { return { message: 'Asset name is required.'}; }),
    assetType: Joi.string().required().error(() => { return { message: 'Asset Type is required.'}; }),
    quantity: Joi.string().required().error(() => { return { message: 'Quantity is required.'}; }),
    image: Joi.string().optional(),
    remark: Joi.string().optional()
});

class AssetController {
    async getAssetById(req, res, next) {
        try {
            let asset = await Asset.findById(req.params.id);
            if (!asset) {
                return res.warn({}, 'Asset not found');
            }
            return res.success({ asset,}, 'Fetched asset Successfully');
        } catch (err) {
            return next(err);
        }
    }
    async addAsset(req, res, next) {
        try {
            let form = new multiparty.Form();
            form.parse(req, async (err, fields, files) => {
                if (err) return next(err);
    
                let asset = {};
                _.forOwn(fields, (field, key) => {
                    asset[key] = field[0];
                });
    
                const { error } = assetSchema.validate(asset, { abortEarly: false });
                if (error) {
                    const validationErrors = {};
                    error.details.forEach((detail) => {
                        validationErrors[detail.path[0]] = detail.message;
                    });
                    return res.warn({validationErrors},'fileds are require');
                }
    
                try {
                    if (files.image && files.image[0].size > 0) {
                        let fileupload = files.image[0];
                        let image = await uploadImage(fileupload, 'image');
                        asset['image'] = image.Key;
                    }
    
                    let addAsset = new Asset(asset);
                    await addAsset.save();
    
                    return res.success({ newAsset: addAsset }, 'Asset added successfully');
                } catch (uploadError) {
                    return next(uploadError);
                }
            });
        } catch (err) {
            return next(err);
        }
    }  
}

module.exports = new AssetController();
