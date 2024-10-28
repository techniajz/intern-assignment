const {
    models: { Designation },
} = require('../../../../lib/models');

class DesignationController {
    async createDesignation(req, res, next) {
        try {
            let { name, description } = req.body;
            let designationObj = {
                name: name,
                description: description,
            };
            let designationData = await new Designation(designationObj).save();
            return res.success(
                {
                    designationData,
                },
                'Designation Created Successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async designationList(req, res, next) {
        try {
            let designation = await Designation.find({});
            if (designation) {
                return res.success(
                    {
                        designation,
                    },
                    'Find Designation List Successfully'
                );
            } else {
                return res.warn({}, 'Designation Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async editDesignation(req, res, next) {
        try {
            let { designationId } = req.params;
            let { name, description } = req.body;
            let designation = await Designation.findOne({ _id: designationId });
            if (designation) {
                designation.name = name;
                designation.description = description;
                let designationData = await designation.save();
                return res.success(
                    {
                        designationData,
                    },
                    'Updated Designation Successfully'
                );
            } else {
                return res.warn({}, 'Designation not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async designationStatus(req, res, next) {
        try {
            const { designationId } = req.params;
            let designation = await Designation.findOne({ _id: ObjectId(designationId) });
            if (designation) {
                if (designation.isActive) {
                    designation.isActive = false;
                    await designation.save();
                    return res.success({}, 'Designation inActive successfully');
                } else {
                    designation.isActive = true;
                    await designation.save();
                    return res.success({}, 'Designation Active successfully');
                }
            } else {
                return res.warn({}, 'Designation Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new DesignationController();
