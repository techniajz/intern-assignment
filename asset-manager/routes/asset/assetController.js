const { reset } = require('nodemon');
const Asset = require('../../models/Asset');

// Get all assets
exports.getAllAssets = async (req, res, next) => {
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
exports.createAsset = async (req, res, next) => {
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
exports.updateAsset = async (req, res, next) => {
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
exports.deleteAssetById = async (req, res, next) => {
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
exports.deleteMultipleAssets = async (req, res, next) => {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.json({ error: 'Please provide an array of IDs to delete.' });
    }
    try {
        const result = await Asset.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.json({ message: 'No Assets found for the provided IDs.' });
        }
        res.json({ message: 'Assets deleted successfully', });
    } catch (error) {
        reset.json({ message: 'Error deleting Assets', error: error.message });
        return next(error);
    }
};


exports.getAssetsByPage = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const Asset = require('./yourAssetModel');
    const [total, assets] = await Promise.all([
        Asset.countDocuments(),
        Asset.find().skip(startIndex).limit(limit)
    ]);

    try {

        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: assets
        });

    } catch (error) {
        reset.json({ message: 'Error fetching Assets', error: error.message });
        next(error)

    }

}


exports.totalAssetsCount = async (req, res, next) => {

    const [{ total, assigned, unassigned }] = await Asset.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                assigned: {
                    $sum: {
                        $cond: { if: { $eq: ["$assignedTo", null] }, then: 0, else: 1 }
                    }
                },
                unassigned: {
                    $sum: {
                        $cond: { if: { $eq: ["$assignedTo", null] }, then: 1, else: 0 }
                    }
                },
            },
        },
        { $project: { _id: 0, total: 1, assigned: 1, unassigned: 1 } },
    ])

    try {
        res.json({
            total,
            assigned,
            unassigned
        });
    } catch (error) {
        reset.json({ message: 'Error fetching Assets', error: error.message });
        next(error)

    }
}




// exports.bulkInsert = async (req, res, next) => {
   
//     // const set = parseInt(req.query.set);
//     // totalBatch = req.query.totalBatch || 1;
//     bulkData = [];
//     batch = req.query.batch;
    
//     for (i = 1; i <= 1000; i++) {
//         bulkData.push({
//             name: "tv" + ((batch*1000)+i),
//             description: "43 inch, serial number- " + ((batch*1000)+i)
//         })
//     }
//     await Asset.insertMany(bulkData)
//     res.json(bulkData)
// }

exports.bulkInsert = async (req, res, next) => {
   
    // const set = parseInt(req.query.set);
    // totalBatch = req.query.totalBatch || 1;

 for (j = 1; j <= 1000; j++){
    bulkData = [];
    for (i = 1; i <= 1000; i++) {
        bulkData.push({
            name: "tv" + i+j,
            description: "43 inch, serial number- " +i+j
        })
    }
    await Asset.insertMany(bulkData)
}
    res.status(200).send("done")
}
