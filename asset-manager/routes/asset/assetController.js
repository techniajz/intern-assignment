const { reset } = require('nodemon');
const Asset = require('../../models/Asset');

// Get all assets
exports.getAllAssets = async (req, res, next ) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (error) {
        res.json({ message: error.message });
        return next(error);
    }
};

// Get asset by ID and populate assigned user
exports.getAssetById = async (req, res, next) => {
    try {
        const asset = await Asset.findById(req.params.id).populate("assignedTo");
        if (!asset) {
            return res.json({ message: 'Asset not found' });
        }
        res.json(asset);
    } catch (error) {
        res.json({ message: error.message });
        return next(error);
    }
};



// Add new asset
exports.createAsset = async (req, res, next ) => {
    const { name, description, assignDate, assignedTo, submissionDate } = req.body;
    console.log(req.body)
    try {
        const asset = new Asset({
            name,
            description,
            assignDate,
            assignedTo,
            submissionDate,
        });
        await asset.save();
        res.json(asset);
    } catch (error) {
         
        res.json({ message: error.message });
        return next(error);
    }
};

// Update an asset by ID
exports.updateAsset = async (req, res, next ) => {
    const { name, description, assignDate, assignedTo, submissionDate } = req.body;
    try {
        const asset = await Asset.findByIdAndUpdate(req.params.id, {
            name,
            description,
            assignDate,
            assignedTo,
            submissionDate
        }, { new: true });

        if (!asset) {
            return res.json({ message: 'Asset not found' });
        }
        res.json(asset);
    } catch (error) {
        res.json({ message: error.message });
        return next(error);
    }
};

// Delete an asset by ID
exports.deleteAssetById = async (req, res, next ) => {
    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if (!asset) {
            return res.json({ message: 'Asset not found' });
        }
        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        res.json({ message: error.message });
        return next(error);
    }
};

// Delete multiple assets
exports.deleteMultipleAssets = async (req, res, next ) => {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.json({ error: 'Please provide an array of IDs to delete.' });
    }
    try {
        const result = await Asset.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.json({ message: 'No products found for the provided IDs.' });
        }
        res.json({ message: 'Products deleted successfully', });
    } catch (error) {
        reset.json({ message: 'Error deleting products', error: error.message });
        return next(error);
    }
};
