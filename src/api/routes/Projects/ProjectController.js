const {
    models: {
        Employee,
        PropertyType,
        PropertyConditions,
        OwnershipType,
        Project,
        ProjectImage,
        AssignProject,
        Designation,
        Notification,
    },
} = require('../../../../lib/models');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var _ = require('lodash');
const multiparty = require('multiparty');
const { uploadImage } = require('../../../../lib/util');
const axios = require('axios');
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY;
const moment = require('moment');

class ProjectController {
    async propertyType(req, res, next) {
        try {
            let propertyType = await PropertyType.find({ isActive: true });
            return res.success(
                {
                    propertyType,
                },
                'Find Property Type succesffuly'
            );
        } catch (err) {
            return next(err);
        }
    }
    async propertyConditions(req, res, next) {
        try {
            let propertyConditions = await PropertyConditions.find({ isActive: true });
            return res.success(
                {
                    propertyConditions,
                },
                'Find Property Conditions succesffuly'
            );
        } catch (err) {
            return next(err);
        }
    }
    async ownershipType(req, res, next) {
        try {
            let ownershipType = await OwnershipType.find({ isActive: true });
            return res.success(
                {
                    ownershipType,
                },
                'Find Ownership Type succesffuly'
            );
        } catch (err) {
            return next(err);
        }
    }
    async createProject(req, res, next) {
        try {
            let userId = req.user._id;
            let employee = await Employee.findOne({ _id: userId });
            if (employee) {
                let project = {};
                let array = [];
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    if (fields.size && fields.type) {
                        array.push({ type: fields.type[0], size: fields.size[0] });
                    }
                    _.forOwn(fields, (field, key) => {
                        project[key] = field[0];
                    });
                    try {
                        let image;
                        if (files && files?.image) {
                            let fileupload = files.image[0];
                            image = await uploadImage(fileupload, 'image');
                        }
                        const googleMapsLink = fields.location_URL[0];
                        getAddressFromGoogleMapsLink(googleMapsLink)
                            .then(async address => {
                                if (address == 'Error fetching address') {
                                    project['address'] = fields.location_area[0];
                                } else {
                                    project['address'] = address.display_name ? address.display_name : address;
                                }
                                project['size'] = array;
                                let location = [];
                                if (!project.hasOwnProperty('loc')) {
                                    project['loc'] = {
                                        type: '',
                                        coordinates: [],
                                    };
                                }
                                if (address.lat && address.lon) {
                                    location.push(address.lat);
                                    location.push(address.lon);
                                }
                                project['loc']['coordinates'] = location;
                                let projectData = await new Project(project).save();
                                let projectImage = {};
                                projectImage.projectId = projectData._id;
                                projectImage.file_ = image ? image.Key : '';
                                projectImage.projectProfile = true;
                                projectImage.type = 'image';
                                await new ProjectImage(projectImage).save();
                                return res.success(
                                    {
                                        project: projectData,
                                    },
                                    'Create Project Successfully'
                                );
                            })
                            .catch(err => {
                                console.error('Error:', err);
                            });
                    } catch (err) {
                        return next(err);
                    }
                });
            }
        } catch (err) {
            return next(err);
        }
    }
    async projectList(req, res, next) {
        try {
            let { running, search, pageNo, limit } = req.query;
            const setLimit = limit != undefined ? limit : 50;
            const offsetpaginate = pageNo > 0 ? (pageNo - 1) * 1 : 0;
            let assignedProArray = [];
            let query_ = {};
            let query = {};
            let projectVist_ = new Date();
            let dateProject_ = moment.tz(projectVist_, 'Asia/Kolkata');
            let projectVistTime = dateProject_.format('YYYYMMDDHHmm');
            let assignedPro = await AssignProject.find({ assignTo: req.user._id });
            assignedPro.map(proId => {
                if (proId.isDeleted == false) {
                    assignedProArray.push(proId.projectId);
                }
            });
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            checkEmployee.project_visit_time = projectVistTime;
            await checkEmployee.save();
            query = { isDeleted: false };
            if (running) {
                query = { isActive: true };
            }
            if (checkEmployee.designationId.name == 'Executive') {
                query = {
                    $and: [
                        {
                            _id: { $in: assignedProArray },
                        },
                        { isActive: true },
                    ],
                };
            }
            query_.$and = [
                { $expr: { $eq: ['$projectId', '$$projectId'] } },
                { $expr: { $eq: ['$projectProfile', true] } },
                { $expr: { $eq: ['$isDeleted', false] } },
            ];
            if (search) {
                const searchValue = new RegExp(
                    req.query.search
                        .split(' ')
                        .filter(val => val)
                        .map(value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
                        .join('|'),
                    'i'
                );
                query.$or = [{ name: searchValue }, { location_area: searchValue }];
            }
            let project = await Project.aggregate([
                {
                    $match: query,
                },
                {
                    $lookup: {
                        from: 'propertytypes',
                        localField: 'propertyType',
                        foreignField: '_id',
                        as: 'propertyType',
                    },
                },
                {
                    $unwind: '$propertyType',
                },
                {
                    $lookup: {
                        from: 'propertyconditions',
                        localField: 'condition',
                        foreignField: '_id',
                        as: 'condition',
                    },
                },
                {
                    $unwind: '$condition',
                },
                {
                    $lookup: {
                        from: 'ownershiptypes',
                        localField: 'ownershipTypes',
                        foreignField: '_id',
                        as: 'ownershipTypes',
                    },
                },
                {
                    $unwind: '$ownershipTypes',
                },
                {
                    $lookup: {
                        from: 'projectimages',
                        let: {
                            projectId: '$_id',
                        },
                        pipeline: [
                            {
                                $match: query_,
                            },
                            {
                                $project: {
                                    _id: 0,
                                    file_: 1,
                                },
                            },
                        ],
                        as: '_projectImage',
                    },
                },
                {
                    $unwind:{
                            path: '$_projectImage',
                            preserveNullAndEmptyArrays: true
                        }
                },
                { $addFields: { projectImage: '$_projectImage.file_' } },
            ])
                .skip(offsetpaginate)
                .limit(parseInt(setLimit))
                .sort({ created: -1 });
            return res.success(
                {
                    project,
                },
                'Find All Projects'
            );
        } catch (err) {
            return next(err);
        }
    }
    async projectStatus(req, res, next) {
        try {
            const { projectId } = req.params;
            let project = await Project.findOne({ _id: ObjectId(projectId) });
            if (project) {
                if (project.isActive) {
                    project.isActive = false;
                    await project.save();
                    return res.success({}, 'Project inActive successfully');
                } else {
                    project.isActive = true;
                    await project.save();
                    return res.success({}, 'Project Active successfully');
                }
            } else {
                return res.warn({}, 'Project Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async projectImageList(req, res, next) {
        try {
            let { projectId } = req.params;
            let { pageNo, limit } = req.query;
            const setLimit = limit != undefined ? limit : 50;
            const offsetpaginate = pageNo > 0 ? (pageNo - 1) * 1 : 0;
            let projectImages = await ProjectImage.find({ projectId, isDeleted: false })
                .skip(offsetpaginate)
                .limit(parseInt(setLimit));
            if (projectImages) {
                return res.success(
                    {
                        projectImages,
                    },
                    'Project Images find succssfully'
                );
            } else {
                return res.warn({}, 'Project Images not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async addProjectImage(req, res, next) {
        // TODO: Can add project image PDF And Youtube URl
        try {
            let { projectId } = req.params;
            let checkProject = await Project.findOne({ _id: projectId });
            if (checkProject) {
                let project = {};
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        project[key] = field[0];
                    });
                    try {
                        if (typeof files.file_ !== 'undefined') {
                            let fileupload = files.file_[0];
                            let image = await uploadImage(fileupload, 'image');
                            project['file_'] = image.key;
                        }
                        project['projectId'] = projectId;
                        await new ProjectImage(project).save();
                        return res.success(
                            {
                                data: project,
                            },
                            'Add Project Image Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            }
        } catch (err) {
            return next(err);
        }
    }
    async projectProfileUpdate(req, res, next) {
        try {
            let { projectId, imageId } = req.params;
            await ProjectImage.updateMany(
                { projectId },
                {
                    $set: {
                        projectProfile: false,
                    },
                }
            );
            await ProjectImage.updateOne(
                { projectId, _id: imageId },
                {
                    $set: {
                        projectProfile: true,
                    },
                }
            );
            return res.success({}, 'Project Profile Update Successfully');
        } catch (err) {
            return next(err);
        }
    }
    async deleteProjectImage(req, res, next) {
        // TODO: Can delete project image PDF And Youtube URl
        try {
            let { projectId, imageId } = req.params;
            let projectFile = await ProjectImage.findOne({ projectId, _id: imageId });
            if (projectFile) {
                await ProjectImage.updateOne(
                    { projectId, _id: imageId },
                    {
                        $set: {
                            isDeleted: true,
                        },
                    }
                );
            }
            return res.success({}, 'File Deleted Successfully');
        } catch (err) {
            return next(err);
        }
    }
    async editProject(req, res, next) {
        try {
            let userId = req.user._id;
            let { projectId } = req.params;
            let employee = await Employee.findOne({ _id: userId });
            let array = [];
            if (employee) {
                let project = await Project.findOne({ _id: projectId });
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields) {
                    if (fields.size && fields.type) {
                        array.push({ type: fields.type[0], size: fields.size[0] });
                    }
                    _.forOwn(fields, (field, key) => {
                        project[key] = field[0];
                    });
                    project['size'] = array;
                    try {
                        await Project(project).save();
                        return res.success(
                            {
                                data: project,
                            },
                            'Updated Project Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            }
        } catch (err) {
            return next(err);
        }
    }
    async employeeList(req, res, next) {
        try {
            let employee = await Employee.find({ isDeleted: false })
                .select('name id')
                .sort({ name: 1 });
            if (employee) {
                return res.success(
                    {
                        employee,
                    },
                    'Find Employee list successfully'
                );
            } else {
                return res.warn({}, 'Employee not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async assignProject(req, res, next) {
        try {
            let { projectId, assignTo } = req.body;
            let Date_ = new Date();
            let projectDate = moment.tz(Date_, 'Asia/Kolkata');
            let formatProjectDate = projectDate.format('YYYYMMDDHHmm');
            let userId = req.user._id;
            let project = await Project.findOne({ _id: ObjectId(projectId) });
            if (project) {
                let checkAssignProject = await AssignProject.findOne({
                    projectId,
                    assignTo: assignTo,
                    assignBy: userId,
                    isDeleted: false,
                });
                if (checkAssignProject) {
                    return res.warn({}, 'This project is already assigned to this employee');
                } else {
                    let assignProject = {
                        projectId: projectId,
                        assignBy: userId,
                        assignTo: assignTo,
                        projectDate: formatProjectDate,
                    };
                    let assignData = await new AssignProject(assignProject).save();

                    let employee = await Employee.findOne({ _id: assignTo });
                    let deviceToken = employee.deviceToken;
                    let fcm = new FCM(serverKey);
                    let message = {
                        to: deviceToken,
                        notification: {
                            title: `Nirmal Real Estate has designated you a project titled: ${project.name}`,
                            body: `Nirmal Real Estate has designated you a project titled: ${project.name}`,
                        },
                        data: {
                            screen: `home`,
                            channel_name: 'RealEstate',
                            channel_id: 'RealEstateChannel',
                            title: `Nirmal Real Estate has designated you a project titled: ${project.name}`,
                            body: `Nirmal Real Estate has designated you a project titled: ${project.name}`,
                            item_id: (Math.random() + 1).toString(36).substring(7)
                        },
                    };
                    fcm.send(message, async function(err, response) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('ok');
                            let addNotification = {
                                employee_id: assignTo,
                                title: message.notification.title,
                                description: message.notification.body,
                                projectId: projectId,
                                type: 'project',
                                notificationTime: formatProjectDate,
                            };
                            await new Notification(addNotification).save();
                        }
                    });
                    return res.success(
                        {
                            assignData,
                        },
                        'Project assigned successfully'
                    );
                }
            } else {
                return res.warn({}, 'Project not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async assignedToEmployeeList(req, res, next) {
        try {
            let { projectId } = req.params;
            let assignEplloye = await AssignProject.find({ projectId, isDeleted: false }).populate({
                path: 'assignTo',
                model: Employee,
                select: 'name profile_pitcture',
            });
            if (assignEplloye) {
                res.success({
                    assignEplloye,
                });
            } else {
                return res.warn({}, 'Not Assign Project');
            }
        } catch (err) {
            return next(err);
        }
    }
    async deleteAssignedEmployee(req, res, next) {
        try {
            let { AssignedEmpId } = req.params;
            let assign = await AssignProject.findOne({ _id: AssignedEmpId });
            if (assign) {
                await AssignProject.updateOne(
                    { _id: AssignedEmpId },
                    {
                        $set: {
                            isDeleted: true,
                        },
                    }
                );
                return res.success({}, 'Delete employee successfully');
            } else {
                return res.warn({}, 'Assigned employee not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async deleteProject(req, res, next) {
        try {
            let { projectId } = req.params;
            let project = await Project.findOne({ _id: projectId });
            if (project) {
                await Project.updateOne(
                    { _id: projectId },
                    {
                        $set: {
                            isDeleted: true,
                        },
                    }
                );
                return res.success({}, 'Project Deleted Successfully');
            } else {
                return res.warn({}, 'Project not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async certificateDropdrone(req, res, next) {
        try {
            let certificate = ['JDA Approved', 'RERA', 'Society Patta', 'Panchayat Patta'];
            return res.success(
                {
                    certificate,
                },
                'find data successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async projectSize(req, res, next) {
        try {
            let { type } = req.query;
            if (type === 'Flats') {
                let flatType = ['2BHK', '3BHK', '4BHK', '5BHK', '6BHK'];
                return res.success(
                    {
                        flatType,
                    },
                    'find Flats type successfully'
                );
            } else if (type === 'Villa') {
                let villType = ['Single floor', 'Double floor', 'Duplex'];
                return res.success(
                    {
                        villType,
                    },
                    'find vill type successfully'
                );
            } else if (type === 'Plot') {
                let PlotType = ['Plot'];
                return res.success(
                    {
                        PlotType,
                    },
                    'find Plot type successfully'
                );
            } else {
                return res.warn({}, 'please select type');
            }
        } catch (err) {
            return next(err);
        }
    }
    async addFlatSize(req, res, next) {
        try {
            let { projectId } = req.params;
            let { propertyType, size } = req.body;
            let array = [];
            let project = await Project.findOne({ _id: ObjectId(projectId) });
            if (project && propertyType === 'Flats') {
                size.map(i => {
                    array.push({ type: i.type, size: i.size });
                });
                project.size = array;
                await project.save();
                return res.success(
                    {
                        project,
                    },
                    'flats size update succssfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async projectAssignedToEmployee(req, res, next) {
        try {
            let { empId } = req.params;
            const assignedProject = await AssignProject.aggregate([
                {
                    $match: {
                        assignTo: ObjectId(empId),
                        isDeleted: false,
                    },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'assignTo',
                        foreignField: '_id',
                        as: 'assignToDetails',
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        let: { projectId: '$projectId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$projectId'],
                                    },
                                },
                            },
                        ],
                        as: 'projectDetails',
                    },
                },
                {
                    $unwind: '$assignToDetails',
                },
                {
                    $unwind: '$projectDetails',
                },
                {
                    $lookup: {
                        from: 'projectimages',
                        let: { projectImage: '$projectDetails._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$projectId', '$$projectImage'],
                                            },
                                            {
                                                $eq: ['$projectProfile', true],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'projectDetails.projectimages',
                    },
                },
                {
                    $unwind: '$projectDetails.projectimages',
                },
                {
                    $project: {
                        _id: 1,
                        assignTo: {
                            _id: '$assignToDetails._id',
                            name: '$assignToDetails.name',
                            profile_picture: '$assignToDetails.profile_picture',
                        },
                        projectId: {
                            _id: '$projectDetails._id',
                            name: '$projectDetails.name',
                            projectimage: '$projectDetails.projectimages.file_',
                        },
                    },
                },
            ]);
            if (assignedProject) {
                res.success(
                    {
                        assignedProject,
                    },
                    'Data find successfully'
                );
            } else {
                return res.warn({}, 'Not Assign Project');
            }
        } catch (err) {
            return next(err);
        }
    }
}
async function getAddressFromGoogleMapsLink(link) {
    let redirectedUrl = null;
    try {
        const response = await axios.head(link, { maxRedirects: 1 });
        redirectedUrl = response.request.res.responseUrl;
    } catch (error) {
        console.error('Error:', error.message);
        return 'Error fetching address';
    }
    if (!redirectedUrl) {
        return 'Redirected URL not found';
    }
    const coordinatesMatch = redirectedUrl.match(/@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/);
    if (!coordinatesMatch || coordinatesMatch.length < 3) {
        function extractAndCleanAddress(redirectedUrl) {
            const parts = redirectedUrl.split('place/');
            if (parts.length > 1) {
                const addressPart = parts[1].split('/')[0];
                const decodedAddress = decodeURIComponent(addressPart);
                const cleanedAddress = decodedAddress.replace(/\+/g, ' ');
                return cleanedAddress;
            }
            return null;
        }
        const extractedAndCleanedAddress = extractAndCleanAddress(redirectedUrl);
        return extractedAndCleanedAddress;
    }
    const lat = parseFloat(coordinatesMatch[1]);
    const lng = parseFloat(coordinatesMatch[2]);
    try {
        const [addressResponse] = await Promise.all([getAddressFromCoordinates(lat, lng)]);
        return addressResponse;
    } catch (error) {
        console.error('Error:', error.message);
        return 'Error fetching address';
    }
}
async function getAddressFromCoordinates(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    try {
        const response = await axios.get(url);
        return response.data || 'Address not found';
    } catch (error) {
        console.error('Error:', error.message);
        return 'Error fetching address';
    }
}

module.exports = new ProjectController();
