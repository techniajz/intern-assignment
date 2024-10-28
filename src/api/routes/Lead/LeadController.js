const {
    models: {
        LeadStatus,
        LeadSource,
        LocationPreference,
        Timeline,
        LeadLabel,
        Lead,
        Project,
        Remark,
        AssignLead,
        LeadTimeline,
        Employee,
        Designation,
        ShareLead,
        ProjectImage,
        Notification,
        LocationTruck,
        AssignProject,
        Salaries,
        Source,
        PropertyType,
        Calendar
    },
} = require('../../../../lib/models');
const LeadService = require('./LeadService');
var _ = require('lodash');
const multiparty = require('multiparty');
const { uploadImage, createFileNameFromDate, formatDate, sendNotifications } = require('../../../../lib/util');
const moment = require('moment');
const { ObjectId } = require('bson');
const {BASE_URL} = process.env;
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY;
const CronJob = require('cron').CronJob;
const async = require('async');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const converter = require('json-2-csv');

class LeadController {
    async leadStatusList(req, res, next) {
        try {
            let leadStatus = await LeadStatus.find({ isActive: true });
            if (leadStatus) {
                return res.success(
                    {
                        leadStatus,
                    },
                    'Find Lead Status List Successfully'
                );
            } else {
                return res.warn({}, 'Lead Status Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadSourceList(req, res, next) {
        try {
            let leadSource = await LeadSource.find({ isActive: true });
            if (leadSource) {
                return res.success(
                    {
                        leadSource,
                    },
                    'Find Lead Source List Successfully'
                );
            } else {
                return res.warn({}, 'Lead Source Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async locationPreference(req, res, next) {
        try {
            let locationPreference = await LocationPreference.find({ isActive: true });
            if (locationPreference) {
                let sortedData = locationPreference.sort((a, b) => a.name.localeCompare(b.name));
                return res.success(
                    {
                        locationPreference : sortedData,
                    },
                    'Find Lead Location Preference Successfully'
                );
            } else {
                return res.warn({}, 'Lead Location Preference Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async timeline(req, res, next) {
        try {
            let timeline = await Timeline.find({ isActive: true });
            if (timeline) {
                return res.success(
                    {
                        timeline,
                    },
                    'Find timeline Successfully'
                );
            } else {
                return res.warn({}, 'Lead timeline Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadLabel(req, res, next) {
        try {
            let leadLabel = await LeadLabel.find({ isActive: true });
            if (leadLabel) {
                return res.success(
                    {
                        leadLabel,
                    },
                    'Find Lead Label Successfully'
                );
            } else {
                return res.warn({}, 'Lead Label Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async createLead(req, res, next) {
        try {
            let lead = {};
            let leadTimelinePbj = {};
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            let form = new multiparty.Form();
            let leadDate = new Date();
            let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
            let attDate = dateLead.format('YYYYMMDD');
            lead.orderdAt = dateLead
            form.parse(req, async function(err, fields, files) {

                if (err) return next(err);

                if (checkEmployee.designationId.name == 'Admin'){
                    const leadCheck = await Lead.findOne({phone : fields.phone});
                    if(leadCheck){
                        leadCheck.orderdAt = leadDate;
                        await leadCheck.save();
    
                        return res.success(
                            {
                                data : leadCheck
                            },
                            'Lead Updated Succesfully'
                        )
                    }
                }
                let propertyPreferences = {
                    propertyType: fields.propertyType ? fields.propertyType[0] : null,
                    locationpreferences: fields.locationpreferences ? fields.locationpreferences[0] : null,
                    budgetRange: fields.budgetRange ? fields.budgetRange[0] : '',
                    NumberOfBHK: fields.NumberOfBHK ? fields.NumberOfBHK[0] : '',
                };
                _.forOwn(fields, (field, key) => {
                    lead[key] = field[0];
                });
                try {
                    if (files && files?.photo) {
                        let fileupload = files.photo[0];
                        let image = await uploadImage(fileupload, 'image');
                        lead['photo'] = image.Key;
                    }
                    lead['timeline'] = fields.timeline ? fields.timeline[0] : null;
                    lead['leadLabel'] = fields.leadLabel ? fields.leadLabel[0] : null;
                    lead['projectId'] = fields.projectId ? fields.projectId[0] : null;
                    lead['leadSources'] = fields.leadSources ? fields.leadSources[0] : null;
                    lead['propertyPreferences'] = propertyPreferences;
                    lead['leadDate'] = attDate;
                    let newLeadData = await new Lead(lead).save();
                    let findAdmins = await Employee.find({ role: 'Admin' });
                    let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                    findAdmins.map(async admin => {
                        let assignObj = {};
                        assignObj['LeadId'] = newLeadData._id;
                        assignObj['assignTo'] = admin._id;
                        assignObj['leadDate'] = formattedLeadDate;
                        assignObj['assignBy'] = req.user._id;
                        await new AssignLead(assignObj).save();
                    });
                    if (checkEmployee.designationId.name == 'Executive') {
                        let assignObj = {};
                        assignObj['LeadId'] = newLeadData._id;
                        assignObj['assignTo'] = req.user._id;
                        assignObj['leadDate'] = formattedLeadDate;
                        assignObj['assignBy'] = req.user._id;
                        await new AssignLead(assignObj).save();
                        leadTimelinePbj['leadDate'] = formattedLeadDate;
                        leadTimelinePbj['senderId'] = req.user._id;
                        leadTimelinePbj['LeadId'] = newLeadData._id;
                        leadTimelinePbj[
                            'comment'
                        ] = `${req.user.name} has added a new lead named: ${newLeadData.name}`;
                        await new LeadTimeline(leadTimelinePbj).save();
                    }
                    return res.success(
                        {
                            data: lead,
                        },
                        'Create Lead Successfully'
                    );}
                 catch (err) {
                    return next(err);
                }
            });
        } catch (err) {
            return next(err);
        }
    }
    async leadList(req, res, next) {
        try {
            let { search, pageNo, limit, leadStatus } = req.query;
            const setLimit = limit != undefined ? limit : 50;
            const offsetpaginate = pageNo > 0 ? (pageNo - 1) * setLimit : 0;
            let query = {};
            let query_ = {};
            let assignedlead = await AssignLead.find({ assignTo: req.user._id });
            let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
            const currentTimezone = 'Asia/Kolkata';
            const currentDate = moment().tz(currentTimezone);
            const startDate = currentDate.clone().subtract(24, 'hours');
            const convertedStartDate = startDate.format('YYYYMMDD');
            const convertedEndDate = currentDate.format('YYYYMMDD');
            let leadVist_ = new Date();
            let dateLead_ = moment.tz(leadVist_, 'Asia/Kolkata');
            let leadVistTime = dateLead_.format('YYYYMMDDHHmm');
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            checkEmployee.lead_visit_time = leadVistTime;
            checkEmployee.save();
            if (checkEmployee.designationId.name == 'Executive') {
                query_ = {
                    $and: [
                        {
                            _id: { $in: assignedLeadArray },
                        },
                        { isActive: true },
                    ],
                };
            }
            query = {
                $and: [{ isDeleted: false }, query_],
            };
            if (leadStatus) {
                query = {
                    $and: [{ leadStatus: Number(leadStatus) }, query_],
                };
            }
            if (leadStatus == 4) {
                // new Lead
                query = {
                    $and: [
                        {
                            leadDate: {
                                $gte: Number(convertedStartDate),
                                $lte: Number(convertedEndDate),
                            },
                        },
                        {
                            leadStatus: {
                                $in: [1, 2],
                            },
                        },
                        query_,
                    ],
                };
            }
            if (leadStatus == 5) {
                // hot lead
                query = {
                    $and: [
                        {
                            leadLabel: ObjectId('6572f8b38fe32b1c9ec2b19f'),
                        },
                        query_,
                    ],
                };
            }
            if (leadStatus == 6) {
                // today visit lead
                const endDateString = String(convertedEndDate);
                let todayVisitLeadRemark = await LeadTimeline.aggregate([
                    {
                        $match: { remark: ObjectId('657ac7b00d77db7aa9a66b59') },
                    },
                    {
                        $addFields: {
                            leadDateString: {
                                $substr: [{ $toString: '$leadDate' }, 0, 8],
                            },
                        },
                    },
                    {
                        $match: {
                            leadDateString: endDateString,
                        },
                    },
                ]);
                let todayVisitLeadArray = todayVisitLeadRemark.map(lead => lead.LeadId);
                query = {
                    $and: [{ _id: { $in: todayVisitLeadArray } }, query_],
                };
            }
            if (leadStatus == 7) {
                // Total visit lead
                let totalVisitLeadremark = await LeadTimeline.find({ remark: ObjectId('657ac7b00d77db7aa9a66b59') });
                let totalvisitArray = totalVisitLeadremark.map(lead => lead.LeadId);
                query = {
                    $and: [{ _id: { $in: totalvisitArray } }, query_],
                };
            }
            if (leadStatus == 8) {
                // Shuffle lead
                let shuffleRemark = await LeadTimeline.find({ remark: ObjectId('65966df912b61f2b0f3561f7') });
                let shuffleArray = shuffleRemark.map(lead => lead.LeadId);
                query = {
                    $and: [{ _id: { $in: shuffleArray } }, query_],
                };
            }
            if (leadStatus == 9) {
                // All action lead
                let allActionalRemark = await LeadTimeline.find({senderId: req.user._id});
                let allActionalArray = allActionalRemark.map(lead => lead.LeadId);
                query = {
                    $and: [{ _id: { $in: allActionalArray } }, query_],
                };
            }
            if (leadStatus == 10) {
                // All action lead
                let allActionalRemark = await LeadTimeline.find({taskStatus: 1});
                let allActionalArray = allActionalRemark.map(lead => lead.LeadId);
                query = {
                    $and: [{ _id: { $in: allActionalArray } }, query_],
                };
            }
            if (search) {
                const searchValue = new RegExp(
                    req.query.search
                        .split(' ')
                        .filter(val => val)
                        .map(value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
                        .join('|'),
                    'i'
                );
                query.$or = [{ name: searchValue }, { phone: searchValue }];
            }

            const leadsData = await Lead.find(query).sort({ created: -1 }).skip(offsetpaginate).limit(parseInt(setLimit));
            const totalLeadsCount = await Lead.countDocuments(query);
            let pageLeads = [];
            if(leadsData.length > 0) {
                leadsData.forEach(leadFilter => { pageLeads.push(leadFilter._id)});
            }
            let lead = await Lead.aggregate([
                {
                    $match: {
                        _id: {$in: pageLeads}
                    },
                },
                {
                    $lookup: {
                        from: 'leadsources',
                        localField: 'leadSources',
                        foreignField: '_id',
                        as: 'leadsources',
                    },
                },
                {
                    $lookup: {
                        from: 'propertytypes',
                        localField: 'propertyPreferences.propertyType',
                        foreignField: '_id',
                        as: 'propertytypes',
                    },
                },
                {
                    $lookup: {
                        from: 'locationpreferences',
                        localField: 'propertyPreferences.locationpreferences',
                        foreignField: '_id',
                        as: 'locationpreferences',
                    },
                },
                {
                    $lookup: {
                        from: 'timelines',
                        localField: 'timeline',
                        foreignField: '_id',
                        as: 'timelines',
                    },
                },
                {
                    $lookup: {
                        from: 'leadlabels',
                        localField: 'leadLabel',
                        foreignField: '_id',
                        as: 'leadlabels',
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: '_id',
                        as: 'projects',
                    },
                },
                {
                    $lookup: {
                        from: 'leadtimelines',
                        localField: '_id',
                        foreignField: 'LeadId',
                        as: 'leadtimelines',
                    },
                },
                {
                    $lookup: {
                        from: 'assignleads',
                        let: {
                            leadId_: '$_id',
                            last_red_date: '$lastReadTime',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$LeadId', '$$leadId_'] }, { $eq: ['$assignTo', req.user._id] }],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'leadtimelines',
                                    let: { lead_id: '$LeadId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$LeadId', '$$lead_id'] },
                                                        { $gt: ['$leadDate', '$$last_red_date'] },
                                                    ],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'leadtimeline',
                                },
                            },
                            {
                                $addFields: {
                                    filteredLeadTimeline: {
                                        $filter: {
                                            input: '$leadtimeline',
                                            cond: {
                                                $gt: ['$$this.leadDate', '$lastReadTime'],
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    unreadSize: { $size: '$filteredLeadTimeline' },
                                },
                            },
                        ],
                        as: 'assignlead',
                    },
                },
                {
                    $unwind: {
                      path: '$assignlead',
                      preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        gender: 1,
                        age: 1,
                        Occupation: 1,
                        isActive: 1,
                        name: 1,
                        phone: 1,
                        leadStatus: 1,
                        leadDate: 1,
                        startVisit: 1,
                        comments: 1,
                        alternateNumber: 1,
                        created: 1,
                        'leadsources.name': 1,
                        'leadsources._id': 1,
                        'propertyPreferences.NumberOfBHK': 1,
                        'propertyPreferences.budgetRange': 1,
                        'timelines.name': 1,
                        'timelines._id': 1,
                        'leadlabels.name': 1,
                        'leadlabels._id': 1,
                        'propertytypes.name': 1,
                        'propertytypes._id': 1,
                        'locationpreferences.name': 1,
                        'locationpreferences._id': 1,
                        'projects.name': 1,
                        'projects._id': 1,
                        orderdAt: 1,
                        unReadLeadTimelines: { $cond: [ '$assignlead.unreadSize', '$assignlead.unreadSize', 0 ] }


                    },
                },
            ])
                .sort({ orderdAt: -1 });
                
            if (lead) {
                return res.success(
                    {
                        lead:lead,
                        totalCount: (totalLeadsCount > 0) ? totalLeadsCount : 0,
                    },
                    'Find All Lead Successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async editLead(req, res, next) {
        try {
            let { leadId } = req.params;
            let lead = await Lead.findOne({ _id: ObjectId(leadId) });
            let form = new multiparty.Form();
            form.parse(req, async function(err, fields, files) {
                let propertyPreferences = {
                    propertyType: fields.propertyType ? fields.propertyType[0] : null,
                    locationpreferences: fields.locationpreferences ? fields.locationpreferences[0] : null,
                    budgetRange: fields.budgetRange ? fields.budgetRange[0] : '',
                    NumberOfBHK: fields.NumberOfBHK ? fields.NumberOfBHK[0] : '',
                };
                _.forOwn(fields, (field, key) => {
                    if(field[0] != 'undefined') {
                        lead[key] = field[0];
                    }
                });
                try {
                    if (files && files?.photo) {
                        let fileupload = files.photo[0];
                        let image = await uploadImage(fileupload, 'image');
                        lead['photo'] = image.Key;
                    }
                    lead['timeline'] = fields.timeline ? fields.timeline[0] : null;
                    lead['leadLabel'] = fields.leadLabel ? fields.leadLabel[0] : null;
                    lead['projectId'] = (fields.projectId && fields.projectId[0] != 'undefined') ? fields.projectId[0] : null;
                    lead['leadSources'] = (fields.leadSources && fields.leadSources[0] != null) ? fields.leadSources[0] : null;
                    lead['propertyPreferences'] = propertyPreferences;
                    await lead.save();
                    return res.success(
                        {
                            data: lead,
                        },
                        'Updated Lead Successfully'
                    );
                } catch (err) {
                    console.log(err);
                    return next(err);
                }
            });
        } catch (err) {
            console.log(err);

            return next(err);
        }
    }
    async projectList(req, res, next) {
        try {
            let project = await Project.find({})
                .select('name')
                .sort({ name: 1 });
            if (project) {
                return res.success(
                    {
                        project,
                    },
                    'Find All Projects Successfully'
                );
            } else {
                return res.warn({}, 'Project not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadDetail(req, res, next) {
        try {
            let { leadId } = req.params;
            let checkLead = await Lead.findOne({ _id: ObjectId(leadId) });
            let leadTimeline = await LeadTimeline.findOne({ LeadId: ObjectId(leadId) })
                .populate({ path: 'LeadId', model: Lead, select: 'name' })
                .populate({ path: 'senderId', model: Employee, select: 'name' })
                .populate({ path: 'remark', model: Remark, select: 'name' })
                .sort({ created: -1 });
            if (checkLead) {
                let leadDetails = await Lead.aggregate([
                    {
                        $match: { _id: ObjectId(leadId) },
                    },
                    {
                        $lookup: {
                            from: 'leadsources',
                            localField: 'leadSources',
                            foreignField: '_id',
                            as: 'leadsources',
                        },
                    },
                    {
                        $lookup: {
                            from: 'leadstatuses',
                            localField: 'leadStatus',
                            foreignField: '_id',
                            as: 'leadstatuses',
                        },
                    },
                    {
                        $lookup: {
                            from: 'propertytypes',
                            localField: 'propertyPreferences.propertyType',
                            foreignField: '_id',
                            as: 'propertytypes',
                        },
                    },
                    {
                        $lookup: {
                            from: 'locationpreferences',
                            localField: 'propertyPreferences.locationpreferences',
                            foreignField: '_id',
                            as: 'locationpreferences',
                        },
                    },
                    {
                        $lookup: {
                            from: 'timelines',
                            localField: 'timeline',
                            foreignField: '_id',
                            as: 'timelines',
                        },
                    },
                    {
                        $lookup: {
                            from: 'leadlabels',
                            localField: 'leadLabel',
                            foreignField: '_id',
                            as: 'leadlabels',
                        },
                    },
                    {
                        $lookup: {
                            from: 'projects',
                            localField: 'projectId',
                            foreignField: '_id',
                            as: 'projects',
                        },
                    },
                    {
                        $project: {
                            gender: 1,
                            age: 1,
                            Occupation: 1,
                            isActive: 1,
                            name: 1,
                            phone: 1,
                            leadStatus: 1,
                            startVisit: 1,
                            'leadsources.name': 1,
                            'leadsources._id': 1,
                            'leadstatuses.name': 1,
                            'leadstatuses._id': 1,
                            'propertyPreferences.NumberOfBHK': 1,
                            'propertyPreferences.budgetRange': 1,
                            'timelines.name': 1,
                            'timelines._id': 1,
                            comments: 1,
                            alternateNumber: 1,
                            'leadlabels.name': 1,
                            'leadlabels._id': 1,
                            created: 1,
                            'propertytypes.name': 1,
                            'propertytypes._id': 1,
                            'locationpreferences.name': 1,
                            'locationpreferences._id': 1,
                            'projects.name': 1,
                            'projects._id': 1,
                            photo: 1,
                            workingProfile: 1,
                            yearlyIncome: 1,
                        },
                    },
                ]);
                return res.success(
                    {
                        leadDetails,
                        leadTimeline,
                    },
                    'Find lead details Successfully'
                );
            } else {
                return res.warn({}, 'Lead not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async createQuickLead(req, res, next) {
        try {
            let { name, phone, projectId, startVisit } = req.body;
            let leadTimelinePbj = {};
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            let leadDate = new Date();
            let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
            let attDate = dateLead.format('YYYYMMDD');
            let formattedDate = dateLead.format('YYYYMMDDHHmm');
            if (checkEmployee.designationId.name == 'Admin'){
                const leadCheck = await Lead.findOne({phone : phone});
                if(leadCheck){
                    leadCheck.orderdAt = leadDate;
                    await leadCheck.save();

                    return res.success(
                        {
                            data : leadCheck
                        },
                        'Lead Updated Succesfully'
                    )
                }
            }
            let quickLeadObj = {
                name: name,
                phone: phone,
                projectId: projectId,
                startVisit: startVisit,
                leadDate: attDate,
                orderdAt: dateLead
            };
            let result = await new Lead(quickLeadObj).save();
            let findAdmins = await Employee.find({ role: 'Admin' });
            findAdmins.map(async admin => {
                let assignObj = {};
                assignObj['LeadId'] = result._id;
                assignObj['assignTo'] = admin._id;
                assignObj['leadDate'] = formattedDate;
                assignObj['assignBy'] = admin._id;
                await new AssignLead(assignObj).save();
            });
            if (checkEmployee.designationId.name == 'Executive') {
                let assignObj = {};
                assignObj['LeadId'] = result._id;
                assignObj['assignTo'] = req.user._id;
                assignObj['leadDate'] = formattedDate;
                assignObj['assignBy'] = req.user._id;
                await new AssignLead(assignObj).save();
                leadTimelinePbj['leadDate'] = formattedDate;
                leadTimelinePbj['senderId'] = req.user._id;
                leadTimelinePbj['LeadId'] = result._id;
                leadTimelinePbj['comment'] = `${req.user.name} has added a new lead named: ${result.name}`;
                await new LeadTimeline(leadTimelinePbj).save();
            }
            if (startVisit) {
                let startVisitTimeline = {
                    LeadId: result._id,
                    senderId: req.user._id,
                    remark: '657ac7b00d77db7aa9a66b59', //visit start
                    leadDate: formattedDate,
                };
                await new LeadTimeline(startVisitTimeline).save();
            }
            return res.success(
                {
                    leadData: result,
                },
                'Create Quick Lead Successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async uploadLeadFile(req, res, next) {
        try {
            let { leadId } = req.params;
            let lead = await Lead.findOne({ _id: leadId });
            if (lead) {
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        lead[key] = field[0];
                    });
                    try {
                        if (typeof files.leadFile !== 'undefined') {
                            let fileupload = files.leadFile[0];
                            let image = await uploadImage(fileupload, 'file');
                            lead['leadFile'] = image.Key;
                        }
                        await lead.save();
                        return res.success(
                            {
                                data: lead,
                            },
                            'Uploaded file Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            } else {
                return res.warn({}, 'Lead Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadFilter(req, res, next) {
        try {
            let { startDate, endDate, name, phone, leadStatus } = req.query;
            let query = {};
            let startDate_ = moment(startDate, 'YYYY-MM-DD');
            let convertedStartDate = startDate_.format('YYYYMMDD');
            let endDate_ = moment(endDate, 'YYYY-MM-DD');
            let convertedendDate = endDate_.format('YYYYMMDD');
           
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            let assignedlead = await AssignLead.find({ assignTo: req.user._id});
            let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
            query = {
                $and: [
                    {
                        _id: { $in: assignedLeadArray },
                    },
                    { isActive: true },
                ],
            };
            
            if(name){
                let assignedlead = await AssignLead.find({ assignTo: ObjectId(name)});
                let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
                if (checkEmployee.designationId.name == 'Admin') {
                    query = {
                        $and: [
                            {
                                _id: { $in: assignedLeadArray },
                            },
                            { isActive: true },
                        ],
                    };
                }
            }
            if ((startDate, endDate)) {
                query = {
                    leadDate: {
                        $gte: Number(convertedStartDate),
                        $lte: Number(convertedendDate),
                    },
                };
            }
            if (phone) {
                query = { phone: phone };
            }
            if (leadStatus) {
                query = { leadStatus: Number(leadStatus) };
            }

            const totalLeadsCount = await Lead.countDocuments(query);
            let lead = await Lead.aggregate([
                {
                    $match: query,
                },
                {
                    $lookup: {
                        from: 'leadsources',
                        localField: 'leadSources',
                        foreignField: '_id',
                        as: 'leadsources',
                    },
                },
                {
                    $lookup: {
                        from: 'propertytypes',
                        localField: 'propertyPreferences.propertyType',
                        foreignField: '_id',
                        as: 'propertytypes',
                    },
                },
                {
                    $lookup: {
                        from: 'locationpreferences',
                        localField: 'propertyPreferences.locationpreferences',
                        foreignField: '_id',
                        as: 'locationpreferences',
                    },
                },
                {
                    $lookup: {
                        from: 'timelines',
                        localField: 'timeline',
                        foreignField: '_id',
                        as: 'timelines',
                    },
                },
                {
                    $lookup: {
                        from: 'leadlabels',
                        localField: 'leadLabel',
                        foreignField: '_id',
                        as: 'leadlabels',
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: '_id',
                        as: 'projects',
                    },
                },
                {
                    $lookup: {
                        from: 'assignleads',
                        let: {
                            leadId_: '$_id',
                            last_red_date: '$lastReadTime',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$LeadId', '$$leadId_'] }, { $eq: ['$assignTo', req.user._id] }],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'leadtimelines',
                                    let: { lead_id: '$LeadId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$LeadId', '$$lead_id'] },
                                                        { $gt: ['$leadDate', '$$last_red_date'] },
                                                    ],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'leadtimeline',
                                },
                            },
                            {
                                $addFields: {
                                    filteredLeadTimeline: {
                                        $filter: {
                                            input: '$leadtimeline',
                                            cond: {
                                                $gt: ['$$this.leadDate', '$lastReadTime'],
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    unreadSize: { $size: '$filteredLeadTimeline' },
                                },
                            },
                        ],
                        as: 'assignlead',
                    },
                },
                {
                    $unwind: '$assignlead',
                },
                {
                    $project: {
                        gender: 1,
                        age: 1,
                        Occupation: 1,
                        isActive: 1,
                        name: 1,
                        phone: 1,
                        leadStatus: 1,
                        startVisit: 1,
                        'leadsources.name': 1,
                        'leadsources._id': 1,
                        'propertyPreferences.NumberOfBHK': 1,
                        'propertyPreferences.budgetRange': 1,
                        'timelines.name': 1,
                        'timelines._id': 1,
                        comments: 1,
                        alternateNumber: 1,
                        'leadlabels.name': 1,
                        'leadlabels._id': 1,
                        created: 1,
                        'propertytypes.name': 1,
                        'propertytypes._id': 1,
                        'locationpreferences.name': 1,
                        'locationpreferences._id': 1,
                        'projects.name': 1,
                        'projects._id': 1,
                        unReadLeadTimelines: '$assignlead.unreadSize',
                        created: 1,
                        orderdAt: 1,
                    },
                },
            ]).sort({ orderdAt: -1 });
            if (lead) {
                return res.success(
                    {
                        lead: lead,
                        totalCount: totalLeadsCount
                    },
                    'Find All Lead Successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async deleteLead(req, res, next) {
        try {
            let { leadId } = req.params;
            let lead = await Lead.findOne({ _id: leadId });
            if (lead) {
                await Lead.updateOne(
                    { _id: leadId },
                    {
                        $set: {
                            isDeleted: true,
                        },
                    }
                );
                return res.success({}, 'lead Deleted Successfully');
            } else {
                return res.warn({}, 'lead not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async remarkList(req, res, next) {
        try {
            let remark = await Remark.find({}).select('name calendarEnable selfieEnable projectEnable');
            if (remark) {
                return res.success({ remark }, 'Find remark successfully');
            } else {
                return res.warn({}, 'remark not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadStatus(req, res, next) {
        try {
            const { leadId } = req.params;
            let lead = await Lead.findOne({ _id: ObjectId(leadId) });
            if (lead) {
                if (lead.isActive) {
                    lead.isActive = false;
                    await lead.save();
                    return res.success({}, 'lead inActive successfully');
                } else {
                    lead.isActive = true;
                    await lead.save();
                    return res.success({}, 'lead Active successfully');
                }
            } else {
                return res.warn({}, 'lead Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async assignLead(req, res, next) {
        try {
            let assignObj = {};
            let leadTimelinePbj = {};
            let leadDate = new Date();
            let dateLead = moment(leadDate);
            let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
            let form = new multiparty.Form();
            form.parse(req, async function(err, fields, files) {
                let leadRunningUpdate = await Lead.updateOne(
                    { _id: ObjectId(fields.LeadId[0]) },
                    {
                        $set: {
                            leadStatus: 1, // lead running if lead assigned
                        },
                    }
                );
                let checkAssignEmployee = await AssignLead.findOne({
                    assignTo: fields.assignTo[0],
                    LeadId: fields.LeadId[0],
                });
                if (checkAssignEmployee) {
                    return res.warn({}, 'Already assigned lead to this employee');
                }

                _.forOwn(fields, async (field, key) => {
                    assignObj[key] = field[0];
                });
                try {
                    let lead = await Lead.findOne({ _id: fields.LeadId[0] });
                    assignObj['leadDate'] = formattedLeadDate;
                    assignObj['assignBy'] = req.user._id;
                    let leadData = await new AssignLead(assignObj).save();
                    leadTimelinePbj['leadDate'] = formattedLeadDate;
                    leadTimelinePbj['senderId'] = req.user._id;
                    leadTimelinePbj['LeadId'] = fields.LeadId[0];
                    leadTimelinePbj['followUpTime'] = leadDate.setDate(leadDate.getDate() + 7 * 1);
                    leadTimelinePbj['isNotificationSend'] = false;
                    leadTimelinePbj['comment'] = `Nirman Real Estate has assigned you a new lead named: ${lead.name}`;
                    await new LeadTimeline(leadTimelinePbj).save();
                    let employee = await Employee.findOne({ _id: fields.assignTo[0] });
                    let deviceToken = employee.deviceToken;
                    let fcm = new FCM(serverKey);
                    let message = {
                        to: deviceToken,
                        notification: {
                            title: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                            body: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                        },
                        data: {
                            screen: `home`,
                            channel_name: 'RealEstate',
                            channel_id: 'RealEstateChannel',
                            title: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                            body: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                            item_id: (Math.random() + 1).toString(36).substring(7)
                        },
                    };
                    fcm.send(message, async function(err, response) {
                        if (err) {
                            console.log(err);
                        } 
                        });
                        let addNotification = {
                            employee_id: employee._id,
                            title: message.notification.title,
                            description: message.notification.body,
                            leadId: fields.LeadId[0],
                            type: 'lead',
                            notificationTime: formattedLeadDate,
                            referanceId: fields.LeadId[0],
                            referanceType: "Lead"
                        };
                        await new Notification(addNotification).save();
                    
                    return res.success(
                        {
                            data: leadData,
                        },
                        'Lead Assign Successfully'
                    );
                } catch (err) {
                    return next(err);
                }
            });
        } catch (err) {
            return next(err);
        }
    }
    async shuffleLead(req, res, next) {
        try {
            let leadDate = new Date();
            let dateLead = moment(leadDate);
            let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
            let form = new multiparty.Form();
            form.parse(req, async function(err, fields, files) {
                let checkedAssignLead = await AssignLead.findOne({
                    assignTo: ObjectId(fields.assignedEmployee[0]),
                    LeadId: ObjectId(fields.LeadId[0]),
                }).populate({
                    path: 'assignTo',
                    model: Employee,
                    select: 'name',
                });
                let shuffledEmployees = await Employee.findOne({ _id: ObjectId(fields.assignTo[0]) });
                if (checkedAssignLead) {
                    let beforeAssigneEmp = checkedAssignLead.assignTo.name;
                    let leadTimelinePbj = {};
                    _.forOwn(fields, async (field, key) => {
                        checkedAssignLead[key] = field[0];
                    });
                    try {
                        checkedAssignLead['leadDate'] = formattedLeadDate;
                        // checkedAssignLead['assignBy'] = req.user._id;
                        if(checkedAssignLead.shuffledBy){
                            let shuffledBy = checkedAssignLead.shuffledBy;
                            shuffledBy.push(req.user._id);
                            checkedAssignLead['shuffledBy'] = shuffledBy;
                        }
                        let leadData = await checkedAssignLead.save();


                        leadTimelinePbj['leadDate'] = formattedLeadDate;
                        leadTimelinePbj['senderId'] = req.user._id;
                        leadTimelinePbj['LeadId'] = fields.LeadId[0];
                        leadTimelinePbj[
                            'comment'
                        ] = `${beforeAssigneEmp} was initially designated, but subsequently, ${shuffledEmployees.name} was reassigned`;
                        await new LeadTimeline(leadTimelinePbj).save();
                        let employee = await Employee.findOne({ _id: fields.assignTo[0] });
                        let lead = await Lead.findOne({ _id: fields.LeadId[0] });
                        let deviceToken = employee.deviceToken;
                        let fcm = new FCM(serverKey);
                        let message = {
                            to: deviceToken,
                            notification: {
                                title: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                                body: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                            },
                            data: {
                                screen: `home`,
                                channel_name: 'RealEstate',
                                channel_id: 'RealEstateChannel',
                                title: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                                body: `Nirman Real Estate has assigned you a new lead named: ${lead.name}`,
                                item_id: (Math.random() + 1).toString(36).substring(7)
                            },
                        };
                        fcm.send(message, async function(err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                let addNotification = {
                                    employee_id: employee._id,
                                    title: message.notification.title,
                                    description: message.notification.body,
                                    leadId: fields.LeadId[0],
                                    type: 'lead',
                                    notificationTime: formattedLeadDate,
                                    referanceId: fields.LeadId[0],
                                    referanceType: "Lead"
                                };
                                await new Notification(addNotification).save();
                            }
                        });
                        return res.success(
                            {
                                data: leadData,
                            },
                            'Lead shuffle Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                } else {
                    return res.warn({}, 'this employee is not assigned');
                }
            });
        } catch (err) {
            return next(err);
        }
    }
    async addLeadTimeline(req, res, next) {
        try {
            let lead = {};
            let employee = await Employee.findOne({ _id: req.user._id });
            let deviceToken = employee.deviceToken;
            let form = new multiparty.Form();
            form.parse(req, async function(err, fields, files) {
                let leadDate = new Date();
                let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
                let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                let formattedScheduleDate;
                let followUpFormat;
                let followUpTime;
                let date__;
                let projectId;
                _.forOwn(fields, (field, key) => {
                    lead[key] = field[0];
                    if (key == 'scheduleDate') {
                        let followUpTimeLocal = new Date(fields.scheduleDate[0]);
                        let scheduleDate = new Date(fields.scheduleDate[0]);
                        scheduleDate.setHours(scheduleDate.getHours() - 5);
                        scheduleDate.setMinutes(scheduleDate.getMinutes() - 30);
                        date__ = moment.tz(scheduleDate, 'Asia/Kolkata');
                        followUpTime = date__;
                        formattedScheduleDate = date__.format('YYYYMMDDHHmm');
                        followUpFormat = date__.format('D MMM YYYY h:mmA');
                    } else {
                        formattedScheduleDate = 0;
                    }
                });
                try {
                    if (files && files?.leadFile) {
                        let fileupload = files.leadFile[0];
                        let image = await uploadImage(fileupload, 'file');
                        lead['leadFile'] = image.Key;
                    }
                    if(lead['comment'] != null && formattedScheduleDate) {
                        let commentText = lead['comment'];
                        lead['comment'] = "Followup time: "+followUpFormat;
                        if(commentText) {
                            lead['comment'] += ", Comment: "+commentText;
                        }
                    }
                    if(fields && fields.projectId && fields.projectId.length > 0){
                       projectId = fields.projectId[0];
                    }
                    const remarkData = await Remark.findOne({ _id: lead.remark });
                    const remarkData2 = JSON.parse(JSON.stringify(remarkData));
                    if(lead.LeadId && lead.LeadId._id) {
                        lead.LeadId = lead.LeadId._id;
                    }
                    lead['followUpTime'] = followUpTime;
                    lead['scheduleDate'] = formattedScheduleDate;
                    lead['leadDate'] = formattedLeadDate;
                    lead['senderId'] = req.user._id;
                    lead['isNotificationSend'] = false;
                    lead['taskStatus'] = (remarkData2.type) ? remarkData2.type : 0;
                    if(projectId){
                        lead['projectId'] = projectId;
                    }
                    await new LeadTimeline(lead).save();
                    /**Update the task status */
                    if(remarkData2.type == 2 && remarkData2.referenceRemarkId && remarkData2.referenceRemarkId.length > 0) {
                        const objectIdArray = remarkData2.referenceRemarkId.map(id => ObjectId(id));
                        let timeLineMatch = {
                            senderId: req.user._id,
                            LeadId: ObjectId(lead.LeadId),
                            taskStatus: 1 
                        }
                        if(remarkData2.slug != "MarkAsComplete") {
                            timeLineMatch.remark = {$in: objectIdArray};
                        }
                        const updateRes = await LeadTimeline.updateMany(
                            timeLineMatch,
                            {
                                $set: {
                                    taskStatus: 2
                                },
                            }
                        );
                       // console.log(updateRes);

                    }
                    /**Update the task status */
                    if (lead.remark == '6574057887af7507a42bd553') {
                        //end visit
                        let checkLEad = await Lead.findOne({ _id: lead.LeadId });
                        await Lead.updateOne(
                            { _id: lead.LeadId },
                            {
                                $set: {
                                    startVisit: false,
                                },
                            }
                        );
                        let StartVisitedTime = await LeadTimeline.findOne({
                            LeadId: lead.LeadId,
                            remark: ObjectId('657ac7b00d77db7aa9a66b59'),
                            senderId: req.user._id,
                        }).sort({ created: -1 });
                        let EndVisitedTime = await LeadTimeline.findOne({
                            LeadId: lead.LeadId,
                            remark: ObjectId('6574057887af7507a42bd553'),
                            senderId: req.user._id,
                        }).sort({ created: -1 });
                        if (StartVisitedTime && EndVisitedTime) {
                            const timeDifference =
                                EndVisitedTime.created.getTime() - StartVisitedTime.created.getTime();
                            const totalMinutes = Math.floor(timeDifference / (1000 * 60));
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;
                            let totalvisitTime = {
                                LeadId: lead.LeadId,
                                senderId: req.user._id,
                                leadDate: formattedLeadDate,
                                comment: `Total visited time ${totalMinutes} minutes`,
                            };
                            if(projectId){
                                totalvisitTime['projectId'] = projectId;
                             }
                            await new LeadTimeline(totalvisitTime).save();
                        }
                    }
                    if (lead.remark == '657ac7b00d77db7aa9a66b59') {
                        //visit start
                        await Lead.updateOne(
                            { _id: fields.LeadId[0] },
                            {
                                $set: {
                                    startVisit: true,
                                },
                            }
                        );
                    }
                    return res.success(
                        {
                            data: lead,
                        },
                        'Create Timeline Successfully'
                    );
                } catch (err) {
                    return next(err);
                }
            });
        } catch (err) {
            console.log(err),"fdvcvvvv";
            return next(err);
        }
    }
    async leadTimelineList(req, res, next) {
        try {
            let { LeadId } = req.params;
            let leadDate = new Date();
            let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
            let lastReadDate = dateLead.format('YYYYMMDDHHmm');
            const timeline = await LeadTimeline.find({ LeadId })
                .populate({ path: 'LeadId', model: Lead, select: 'name phone' })
                .populate({ path: 'senderId', model: Employee, select: 'name' })
                .populate({ path: 'remark', model: Remark, select: 'name' })
                .populate({ path: 'projectId', model: Project })
                .sort({ created: -1 });
            if (timeline) {
                let checkaAssignLead = await AssignLead.findOne({
                    assignTo: req.user._id,
                    LeadId: LeadId,
                    isDeleted: false,
                });
                if (checkaAssignLead) {
                    checkaAssignLead.lastReadTime = lastReadDate;
                    await checkaAssignLead.save();
                }
                return res.success(
                    {
                        timeline,
                    },
                    'Find Lead Timeline successfully'
                );
            } else {
                return res.warn({}, 'Lead Timeline not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async assignedToEmployeeList(req, res, next) {
        try {
            let { leadId } = req.params;
            let assignEplloye = await AssignLead.find({ LeadId: ObjectId(leadId) })
                .populate({
                    path: 'assignTo',
                    model: Employee,
                    select: 'name',
                })
                .select('LeadId assignBy assignTo');
            if (assignEplloye) {
                res.success(
                    {
                        assignEplloye,
                    },
                    'Find assign to employee successfully'
                );
            } else {
                return res.warn({}, 'Not Assign Lead');
            }
        } catch (err) {
            return next(err);
        }
    }
    async unAssignedEmployeeList(req, res, next) {
        try {
            let { leadId } = req.params;
            let unAssignEplloye = await AssignLead.find({ LeadId: ObjectId(leadId) });
            let assignedEmploye = unAssignEplloye.map(i => i.assignTo);
            let designation = await Designation.findOne({ name: 'Executive' });
            let unAssignEmployee = await Employee.find({
                designationId: ObjectId(designation._id),
                _id: { $nin: assignedEmploye },
                isDeleted: false,
            }).select('name profile_pitcture');
            if (unAssignEmployee) {
                res.success(
                    {
                        unAssignEmployee,
                    },
                    'Find un-assign employee successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async deleteAssignedToEmployee(req, res, next) {
        try {
            let { assignedId } = req.params;
            let assigneEmployee = await AssignLead.findOne({ _id: assignedId });
            if (assigneEmployee) {
                await AssignLead.deleteOne({ _id: assignedId });
                return res.success({}, 'Deleted Successfully');
            } else {
                return res.warn({}, 'Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async unAssigneLeads(req, res, next) {
        try {
            let assigneLeads = await AssignLead.find({});
            let leadIds = assigneLeads.map(lead => lead.LeadId);
            let lead = await Lead.aggregate([
                {
                    $match: { _id: { $nin: leadIds } },
                },
                {
                    $lookup: {
                        from: 'leadsources',
                        localField: 'leadSources',
                        foreignField: '_id',
                        as: 'leadsources',
                    },
                },
                {
                    $lookup: {
                        from: 'leadstatuses',
                        localField: 'leadStatus',
                        foreignField: '_id',
                        as: 'leadstatuses',
                    },
                },
                {
                    $lookup: {
                        from: 'propertytypes',
                        localField: 'propertyPreferences.propertyType',
                        foreignField: '_id',
                        as: 'propertytypes',
                    },
                },
                {
                    $lookup: {
                        from: 'locationpreferences',
                        localField: 'propertyPreferences.locationpreferences',
                        foreignField: '_id',
                        as: 'locationpreferences',
                    },
                },
                {
                    $lookup: {
                        from: 'timelines',
                        localField: 'timeline',
                        foreignField: '_id',
                        as: 'timelines',
                    },
                },
                {
                    $lookup: {
                        from: 'leadlabels',
                        localField: 'leadLabel',
                        foreignField: '_id',
                        as: 'leadlabels',
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: '_id',
                        as: 'projects',
                    },
                },
                {
                    $project: {
                        gender: 1,
                        age: 1,
                        Occupation: 1,
                        isActive: 1,
                        name: 1,
                        phone: 1,
                        'leadsources.name': 1,
                        'leadsources._id': 1,
                        'leadstatuses.name': 1,
                        'leadstatuses._id': 1,
                        'propertyPreferences.NumberOfBHK': 1,
                        'propertyPreferences.budgetRange': 1,
                        'timelines.name': 1,
                        'timelines._id': 1,
                        comments: 1,
                        alternateNumber: 1,
                        'leadlabels.name': 1,
                        'leadlabels._id': 1,
                        created: 1,
                        'propertytypes.name': 1,
                        'propertytypes._id': 1,
                        'locationpreferences.name': 1,
                        'locationpreferences._id': 1,
                        'projects.name': 1,
                        'projects._id': 1,
                        created: 1,
                    },
                },
            ]);
            return res.success(
                {
                    lead,
                },
                'Find Un-assigned Project Successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async startVisit(req, res, next) {
        try {
            let { leadId } = req.params;
            let leadDate = new Date();
            let date = moment(leadDate);
            let formattedDate = date.format('YYYYMMDDHHmm');
            await Lead.updateOne(
                { _id: ObjectId(leadId) },
                {
                    $set: {
                        startVisit: true,
                    },
                }
            );
            let startVisit = {
                LeadId: leadId,
                senderId: req.user._id,
                remark: '657ac7b00d77db7aa9a66b59', //visit start
                leadDate: formattedDate,
                followUpTime: leadDate.setDate(leadDate.getDate() + 7 * 1),
                isNotificationSend: true,
            };
            let visitData = await new LeadTimeline(startVisit).save();
            return res.success(
                {
                    visitData,
                },
                'Starrt visit successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async makeCall(req, res, next) {
        try {
            let { leadId } = req.params;
            let leadDate = new Date();
            let date = moment(leadDate);
            let formattedDate = date.format('YYYYMMDDHHmm');
            let makeCall = {
                LeadId: leadId,
                senderId: req.user._id,
                remark: '657ac7880d77db7aa9a66b58', //contacted
                leadDate: formattedDate,
                followUpTime: leadDate.setDate(leadDate.getDate() + 7 * 1),
                isNotificationSend: true,
            };
            let visitData = await new LeadTimeline(makeCall).save();
            return res.success(
                {
                    visitData,
                },
                'Contacted successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async allEmployee(req, res, next) {
        try {
            let { leadId } = req.query; // check already assigne lead to another employee
            let checkedAssignLead = await AssignLead.findOne({ LeadId: ObjectId(leadId) });
            let designation = await Designation.findOne({ name: 'Executive' });
            let employees = await Employee.find({
                isDeleted: false,
                designationId: ObjectId(designation._id),
            }).populate({
                path: 'designationId',
                model: Designation,
                select: 'name',
            });
            if (employees) {
                employees = employees.map(emp => {
                    if (checkedAssignLead && emp._id.toString() === checkedAssignLead.assignTo.toString()) {
                        return { ...emp.toObject(), assignedLead: true };
                    } else {
                        return { ...emp.toObject(), assignedLead: false };
                    }
                });
                employees.sort((a, b) => b.name.localeCompare(a.name));
                return res.success(
                    {
                        employees,
                    },
                    'Find All Employee Successfully'
                );
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async shareLead(req, res, next) {
        try {
            let {
                leadId,
                projectId,
                name,
                propertyType,
                location_URL,
                condition,
                ownershipTypes,
                yearBuilt,
                OwnerOfProperty,
                certifications,
                minPrice,
                maxPrice,
                size,
                contactPerson,
                contactNumber,
                nearby,
                notes,
                projectDocuments,
            } = req.body;
            let userId = req.user._id;
            let employee = await Employee.findOne({ _id: userId });
            if (employee) {
                let project = {
                    leadId,
                    projectId,
                    senderId: userId,
                    name,
                    propertyType,
                    location_URL,
                    condition,
                    ownershipTypes,
                    yearBuilt,
                    OwnerOfProperty,
                    certifications,
                    minPrice,
                    maxPrice,
                    size,
                    contactPerson,
                    contactNumber,
                    nearby,
                    notes,
                    projectDocuments,
                };
                let shareData = await new ShareLead(project).save();
                let shareURL = `${BASE_URL}/Lead/leadShare_URL_Page?leadId=${shareData._id}`;
                return res.success(
                    {
                        shareData,
                        shareURL,
                    },
                    'Lead shared successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async leadShare_URL_Page(req, res, next) {
        try {
            let { leadId } = req.query;
            let shareProject = await ShareLead.findOne({ _id: ObjectId(leadId) });
            let proDocument = await ProjectImage.find({ _id: { $in: shareProject.projectDocuments } });
            res.render('index', { BASE_URL, shareProject, leadId, proDocument });
        } catch (err) {
            return next(err);
        }
    }
    async lead_brochure_Page(req, res, next) {
        try {
            let { leadId } = req.query;
            let shareProject = await ShareLead.findOne({ _id: ObjectId(leadId) })
                .populate({ path: 'leadId', model: Lead, select: 'name' })
                .populate({ path: 'projectId', model: Project, select: 'name' });
            let proDocument = await ProjectImage.find({ _id: { $in: shareProject.projectDocuments } });
            res.render('lead-brochure', { BASE_URL, shareProject, proDocument });
        } catch (err) {
            return next(err);
        }
    }
    async lead_video(req, res, next) {
        try {
            let { leadId } = req.query;
            let shareProject = await ShareLead.findOne({ _id: ObjectId(leadId) })
                .populate({ path: 'leadId', model: Lead, select: 'name' })
                .populate({ path: 'projectId', model: Project, select: 'name' });
            let proDocument = await ProjectImage.find({ _id: { $in: shareProject.projectDocuments } });
            res.render('video', { BASE_URL, shareProject, proDocument });
        } catch (err) {
            return next(err);
        }
    }
    async lead_Documents(req, res, next) {
        try {
            let { leadId } = req.query;
            let shareProject = await ShareLead.findOne({ _id: ObjectId(leadId) })
                .populate({ path: 'leadId', model: Lead, select: 'name' })
                .populate({ path: 'projectId', model: Project, select: 'name' });
            let proDocument = await ProjectImage.find({ _id: { $in: shareProject.projectDocuments } });
            res.render('documents', { BASE_URL, shareProject, proDocument });
        } catch (err) {
            return next(err);
        }
    }
    async lead_gallery_Page(req, res, next) {
        try {
            let { leadId } = req.query;
            let shareProject = await ShareLead.findOne({ _id: ObjectId(leadId) })
                .populate({ path: 'leadId', model: Lead, select: 'name' })
                .populate({ path: 'projectId', model: Project, select: 'name' });
            let proDocument = await ProjectImage.find({ _id: { $in: shareProject.projectDocuments } });
            res.render('gallery', { BASE_URL, shareProject, proDocument });
        } catch (err) {
            return next(err);
        }
    }
    async endVisit(req, res, next) {
        try {
            let { leadId } = req.params;
            let checkLead = await Lead.findOne({ _id: ObjectId(leadId) });
            let lead = {};
            if (checkLead) {
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    let leadDate = new Date();
                    let dateLead = moment(leadDate);
                    let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                    _.forOwn(fields, (field, key) => {
                        lead[key] = field[0];
                    });
                    try {
                        if (files && files?.leadFile) {
                            let fileupload = files.leadFile[0];
                            let image = await uploadImage(fileupload, 'file');
                            lead['leadFile'] = image.Key;
                        }
                        lead['leadDate'] = formattedLeadDate;
                        lead['senderId'] = req.user._id;
                        lead['remark'] = '6574057887af7507a42bd553';
                        lead['leadId'] = leadId;
                        await new LeadTimeline(lead).save();
                        return res.success(
                            {
                                data: lead,
                            },
                            'End Visit Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            } else {
                return res.warn({}, 'Lead not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async dropdrone(req, res, next) {
        try {
            let Budget = ['15-20L', '20-25L', '25-30L', '30-40L', '40-50L', '50-60L', '60-80L', '80-1CR', '1-1.25CR', '1.25-1.5CR', '1.5-1.75CR', '1.75-2CR', '2-2.5CR', '2.5-3CR' , 'Above 3CR'];
            let bhk = ['1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '6bhk'];
            return res.success(
                {
                    Budget,
                    bhk,
                },
                'find data successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async dashboard(req, res, next) {
        try {
            let query = {};
            const currentTimezone = 'Asia/Kolkata';
            const currentDate = moment().tz(currentTimezone);
            const startDate = currentDate.clone().subtract(24, 'hours');
            const convertedStartDate = startDate.format('YYYYMMDD');
            const convertedEndDate = currentDate.format('YYYYMMDD');
            const currentDay = currentDate.date();
            const currentMonth = currentDate.month() + 1;

            const eventTypes = ['joiningDate', 'birthDate'];
            const eventEmployees = await Employee.find({
                $or: eventTypes.map(dateField => ({
                    $and: [
                        { [dateField]: { $ne: null } },
                        {
                            $expr: {
                                $and: [
                                    { $eq: [{ $dayOfMonth: `$${dateField}` }, currentDay] },
                                    { $eq: [{ $month: `$${dateField}` }, currentMonth] }
                                ]
                            }
                        }
                    ]
                }))
            });

            const eventArray = eventEmployees.map(employee => {
                const types = [];
                if (currentDay === moment(employee.birthDate).date() && currentMonth === moment(employee.birthDate).month() + 1) {
                    types.push('Birthday');
                }
                if (currentDay === moment(employee.joiningDate).date() && currentMonth === moment(employee.joiningDate).month() + 1) {
                    types.push('Joining Anniversary');
                }
                return {
                    name: employee.name,
                    _id: employee._id,
                    profile_pitcture: employee.profile_pitcture,
                    responsibilities: employee.responsibilities,
                    companyName: employee.companyName,
                    type: types
                };
            });

            let tomorrowDate = currentDate.clone().add(1, 'days');
            let dayOfWeek = currentDate.format('dddd');
            const holidayArray = [];

            if (dayOfWeek === 'Friday') {
                tomorrowDate = currentDate.clone().add(3, 'days');
            }
            let convertedTomorrowDate = tomorrowDate.format('YYYYMMDD');

            let holiday;
            do {
                holiday = await Calendar.find({ date_: convertedTomorrowDate });

                if (holiday.length) {
                    holidayArray.push(holiday[0]);
                } else {
                    break;
                }

                dayOfWeek = tomorrowDate.format('dddd');
                
                if (dayOfWeek === 'Friday') {
                    tomorrowDate.add(3, 'days');  
                } else if (dayOfWeek === 'Thursday') {
                    tomorrowDate.add(4, 'days'); 
                } else {
                    tomorrowDate.add(1, 'days');  
                }

                convertedTomorrowDate = tomorrowDate.format('YYYYMMDD');

            } while (holiday.length);

            let assignedLeadByAdmin = await AssignLead.aggregate([
                {
                    $match: {
                        assignTo: req.user._id
                    }
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'assignBy',
                        foreignField: '_id',
                        as: 'employees'
                    }
                },
                { '$unwind': '$employees' },
                { '$match': { 'employees.role': 'Admin' } }
            ]);

            // let assignedlead = await AssignLead.find({ assignTo: req.user._id, assignBy: req.user._id });
            // let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
            // let assignedLeadByAdminArray = await assignedLeadByAdmin.map(leadId => leadId.LeadId);
            // let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
            //     path: 'designationId',
            //     model: Designation,
            // });
            // if (checkEmployee.designationId.name == 'Executive') {
            //     query = {
            //         $and: [
            //             {
            //                 _id: { $in: assignedLeadArray },
            //             },
            //             { isActive: true },
            //         ],
            //     };
            // }
            // let runningLeads = await Lead.find({
            //     $and: [
            //         {
            //             leadStatus: 1,
            //         },
            //         query,
            //     ],
            // }).countDocuments();
            // let newLeadsBySelf = await Lead.find({
            //     $and: [
            //         {
            //             leadDate: {
            //                 $gte: Number(convertedStartDate),
            //                 $lte: Number(convertedEndDate),
            //             },
            //         },
            //         {
            //             leadStatus: {
            //                 $in: [1, 2],
            //             },
            //         },
            //         {
            //             $and: [
            //                 {
            //                     _id: { $in: assignedLeadArray },
            //                 },
            //                 { isActive: true },
            //             ],
            //         },
            //     ],
            // }).countDocuments();
            // let newLeadsByAdmin = await Lead.find({
            //     $and: [
            //         {
            //             leadDate: {
            //                 $gte: Number(convertedStartDate),
            //                 $lte: Number(convertedEndDate),
            //             },
            //         },
            //         {
            //             leadStatus: {
            //                 $in: [1, 2],
            //             },
            //         },
            //         {
            //             $and: [
            //                 {
            //                     _id: { $in: assignedLeadByAdminArray },
            //                 },
            //                 { isActive: true },
            //             ],
            //         },
            //     ],
            // }).countDocuments();
            // let hotLeads = await Lead.find({
            //     $and: [{ leadLabel: ObjectId('6572f8b38fe32b1c9ec2b19f') }, query],
            // }).countDocuments();
            // const endDateString = String(convertedEndDate);
            // /**Todays Visits counts */
            // let todayVisitLeadsCount = await LeadTimeline.aggregate([
            //     {
            //         $addFields: {
            //             leadDateString: {
            //                 $substr: [{ $toString: '$leadDate' }, 0, 8],
            //             },
            //         },
            //     },
            //     {
            //         $match: {
            //             remark: ObjectId('6574057887af7507a42bd553'),
            //             senderId: req.user._id,
            //             leadDateString: endDateString
            //         },
            //     },
            //     { 
            //         $group: { _id: "$LeadId", myCount: { $sum: 1 } } 
            //     },
            //     {
            //         $group: { _id: null, visitCount: { $sum:1} }
            //     }
            // ]);
            // let todayVisitLeads = todayVisitLeadsCount.length > 0 ? todayVisitLeadsCount[0].visitCount: 0;
            // /**Total Visits counts */
            // let totalVisitLeadsCount = await LeadTimeline.aggregate([
            //     {
            //         $match: {
            //             remark: ObjectId('6574057887af7507a42bd553'),
            //             senderId: req.user._id
            //         },
            //     },
            //     { 
            //         $group: { _id: "$LeadId", myCount: { $sum: 1 } } 
            //     },
            //     {
            //         $group: { _id: null, visitCount: { $sum:1} }
            //     }
            // ]);
            // let totalvisitLeads = totalVisitLeadsCount.length > 0 ? totalVisitLeadsCount[0].visitCount: 0;
            // /**All sction leads */
            // let allAsctionLeadsQuery = await LeadTimeline.aggregate([
            //     {
            //         $match: {
            //             senderId: req.user._id
            //         },
            //     },
            //     { 
            //         $group: { _id: "$LeadId", myCount: { $sum: 1 } } 
            //     },
            //     {
            //         $group: { _id: null, actionCount: { $sum:1} }
            //     }
            // ]);
            // let allActionLeads = allAsctionLeadsQuery.length > 0 ? allAsctionLeadsQuery[0].actionCount: 0;
           // let todayVisitLeadArray = todayVisitLeadRemark.map(lead => lead.LeadId);
            // let todayVisitLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: todayVisitLeadArray },
            //         },
            //         query,
            //     ],
            // }).count();
            // let totalVisitLeadremark = await LeadTimeline.find({ remark: ObjectId('657ac7b00d77db7aa9a66b59') });
            // let totalvisitArray = totalVisitLeadremark.map(lead => lead.LeadId);
            // let totalvisitLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: totalvisitArray },
            //         },
            //         query,
            //     ],
            // }).count();
            // let allActionalRemark = await LeadTimeline.find({});
            // let allActionalArray = allActionalRemark.map(lead => lead.LeadId);
            // let allActionLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: allActionalArray },
            //         },
            //         query,
            //     ],
            // }).count();

            // let suffledToLead = await AssignLead.aggregate([
            //     {
            //         $match: {
            //             $expr: {
            //                 $gt: [
            //                     { $size: { $ifNull: ["$shuffledBy", []] } },
            //                     0
            //                 ]
            //             }
            //         }
            //     },
            //     {
            //         $addFields: {
            //             lastShuffledBy: { $arrayElemAt: ["$shuffledBy", -1] }
            //         }
            //     },
            //     {
            //         $match: {
            //             assignTo: req.user._id
            //         }
            //     }
            // ]);
            // let suffledToArray = suffledToLead.map(lead => lead.LeadId);
            // let shuffleToLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: suffledToArray },
            //         }
            //     ],
            // }).countDocuments();

            // let shuffledByLead = await AssignLead.aggregate([
            //     {
            //         $match: {
            //             $expr: {
            //                 $gt: [
            //                     { $size: { $ifNull: ["$shuffledBy", []] } },
            //                     0
            //                 ]
            //             }
            //         }
            //     },
            //     {
            //         $addFields: {
            //             lastShuffledBy: { $arrayElemAt: ["$shuffledBy", -1] }
            //         }
            //     },
            //     {
            //         $match: {
            //             lastShuffledBy: req.user._id
            //         }
            //     }
            // ]);
            // let shuffledByArray = await shuffledByLead.map(lead => lead.LeadId);
            // let shufflebyLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: shuffledByArray },
            //         }
            //     ],
            // }).countDocuments();

            // let shuffleRemark = await LeadTimeline.find({ remark: ObjectId('65966df912b61f2b0f3561f7') });
            // let shuffleArray = shuffleRemark.map(lead => lead.LeadId);
            // let shuffleLeads = await Lead.find({
            //     $and: [
            //         {
            //             _id: { $in: shuffleArray },
            //         },
            //         query,
            //     ],
            // }).countDocuments();
            return res.success(
                {
                    runningLeads : 0,
                    newLeads : 0,
                    newLeadsBySelf : 0,
                    hotLeads : 0,
                    todayVisitLeads : 0,
                    totalvisitLeads : 0,
                    allActionLeads : 0,
                    shuffleLeads : 0,
                    shuffleToLeads : 0,
                    shufflebyLeads : 0,
                    events: eventArray,
                    holiday : holidayArray
                },
                'Dashboard data find successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async cronApiTest(req, res, next) {
        //If there is no location tracking from an expecutive in last 30 minutes then send a push to admin
        try {
            async function executeTask() {
                let admin = await Employee.find({ role: 'Admin' });
                let adminDeviceToken = admin.map(i => i.deviceToken);
                let employees = await Employee.find({});
                employees.forEach(async employee => {
                    let locationTruck = await LocationTruck.findOne({ empId: ObjectId(employee._id) })
                        .sort({ created: -1 })
                        .limit(1);
                    if (locationTruck) {
                        function calculateTimeDifference(formattedLeadDate, truckTime) {
                            const leadDate = moment(formattedLeadDate, 'YYYYMMDDHHmm');
                            const truckDateTime = moment(truckTime, 'YYYYMMDDHHmm');
                            const differenceInMilliseconds = leadDate.diff(truckDateTime);
                            const durationInMinutes = moment.duration(differenceInMilliseconds).asMinutes();
                            return durationInMinutes;
                        }
                        let leadDate = new Date();
                        let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
                        let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                        let truckTime = locationTruck.truckTime;
                        const timeDifferenceInMinutes = calculateTimeDifference(formattedLeadDate, truckTime);
                        if (timeDifferenceInMinutes > 1) {
                            let fcm = new FCM(serverKey);
                            let message = {
                                to: adminDeviceToken,
                                notification: {
                                    title: `${employee.name} is not trackable at the moment`,
                                    body: `${employee.name} is not trackable at the moment`,
                                },
                                data: {
                                    screen: `home`,
                                    channel_name: 'RealEstate',
                                    channel_id: 'RealEstateChannel',
                                    title: `${employee.name} is not trackable at the moment`,
                                    body: `${employee.name} is not trackable at the moment`,
                                    item_id: (Math.random() + 1).toString(36).substring(7)
                                },
                            };
                            fcm.send(message, async function(err, response) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let addNotification = {
                                        employee_id: admin._id,
                                        title: message.notification.title,
                                        description: message.notification.body,
                                    };
                                    await new Notification(addNotification).save();
                                }
                            });
                        }
                    }
                });
            }
            const task = new CronJob('*/1 * * * *', executeTask, null, true, 'Asia/Kolkata');
            task.start();
        } catch (err) {
            return next(err);
        }
    }
    async noActionLead(req, res, next) {
        try {
            const results = [];
            let employee = await Employee.find({});
            async.mapSeries(
                employee,
                async emp => {
                    let vistLeadTimeline = await LeadTimeline.findOne({
                        senderId: emp._id,
                        remark: '657ac7b00d77db7aa9a66b59',
                    })
                        .populate({ path: 'LeadId', model: Lead })
                        .populate({ path: 'senderId', model: Employee, select: 'name' })
                        .sort({ created: -1 })
                        .limit(1);
                    if (vistLeadTimeline) {
                        const { leadDate } = vistLeadTimeline;
                        function calculateTimeDifference(formattedLeadDate, leadDate__) {
                            const leadDate_ = moment(formattedLeadDate, 'YYYYMMDDHHmm');
                            const truckDateTime = moment(leadDate__, 'YYYYMMDDHHmm');
                            const differenceInMilliseconds = leadDate_.diff(truckDateTime);
                            const durationInMinutes = moment.duration(differenceInMilliseconds).asMinutes();
                            return durationInMinutes;
                        }
                        let currentDate = new Date();
                        let dateLead = moment.tz(currentDate, 'Asia/Kolkata');
                        let formattedLeadDate = dateLead.format('YYYYMMDDHHmm');
                        let leadDate__ = leadDate;
                        const timeDifferenceInMinutes = calculateTimeDifference(formattedLeadDate, leadDate__);
                        if (timeDifferenceInMinutes > 30) {
                            let endVistLeadTimeline = await LeadTimeline.findOne({
                                senderId: vistLeadTimeline.senderId,
                                LeadId: vistLeadTimeline.LeadId,
                                remark: ObjectId('6574057887af7507a42bd553'),
                            })
                                .sort({ created: -1 })
                                .limit(1);
                            if (endVistLeadTimeline == null) {
                                results.push(vistLeadTimeline);
                            }
                        }
                    }
                },
                err => {
                    if (err) {
                        return next(err);
                    }
                    return res.success(
                        {
                            vistLeadTimeline: results,
                        },
                        'Find no-action lead successfully'
                    );
                }
            );
        } catch (err) {
            return next(err);
        }
    }

    async createExcelLead(req, res, next) {
        try {
            let userId = req.user._id;
            let form = new multiparty.Form();
            let leadNewDate = new Date();
            let findAdmins = await Employee.find({ role: 'Admin' });
    
            const leadLogsDir = path.join(__dirname, 'leadLogs');
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    return next(err);
                }
    
                try {
                    if (!files.leadFile || files.leadFile.length === 0) {
                        return res.warn({}, 'No file uploaded');
                    }
    
                    let file = files.leadFile[0];
                    let leadDate = new Date();
                    let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
                    let timestamp = dateLead.format('DDMMYYYYHHmmss');
                    const fileExtension = path.extname(file.originalFilename);
                    const baseName = path.basename(file.originalFilename, fileExtension);
                    const uniqueFilename = `${baseName}_${timestamp}${fileExtension}`;

                    const savePath = path.join(leadLogsDir, uniqueFilename);

                    fs.copyFile(file.path, savePath, async (err) => {
                        if (err) {
                            console.error("Error saving file:", err);
                            return res.warn({}, 'Error saving file');
                        }
                    try {    
                    const workbook = xlsx.readFile(file.path);
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
                    const leads = await Promise.all(jsonData.map(async (row) => {
                        let lead = {};
                        let assignTo;
                        let feedback = '';
                        let projectId;
                        lead.propertyPreferences = {};
    
                        for (let key in row) {
                            let keyName = key.trim().toLowerCase();
                            let rowValue = (typeof row[key] === 'string') ? row[key].trim() : row[key];
                            lead.orderdAt = leadNewDate;
    
                            if (keyName === 'name') {
                                lead.name = rowValue;
                            }
                            if (keyName === 'phone') {
                                lead.phone = rowValue;
                            }
                            if (keyName === 'mail address') {
                                lead.email = rowValue;
                            }
                            if (keyName === 'requirement') {
                                lead.comments = rowValue;
                            }
                            if (keyName === 'project name') {
                                const project = await Project.findOne({ name: new RegExp(`^${rowValue}$`, 'i') });
                                if (project) {
                                    lead.projectId = project._id;
                                    projectId = project._id;
                                }
                            }
                            if (keyName === 'location') {
                                let locationPreference = await LocationPreference.findOne({ name: new RegExp(`^${rowValue}$`, 'i') });
                                if (locationPreference) {
                                    lead.propertyPreferences.locationpreferences = locationPreference._id;
                                } else {
                                    locationPreference = new LocationPreference({ name: rowValue, isActive: true, isDeleted: false });
                                    await locationPreference.save();
                                    lead.propertyPreferences.locationpreferences = locationPreference._id;
                                }
                            }
                            if (keyName === 'flat/villas' || keyName === 'flat' || keyName === 'villas' || keyName === 'plot') {
                                const propertyType = await PropertyType.findOne({ name: new RegExp(`^${rowValue}$`, 'i') });
                                if (propertyType) {
                                    lead.propertyPreferences.propertyType = propertyType._id;
                                }
                            }
                            if (keyName === 'portal') {
                                let leadSource = await LeadSource.findOne({ name: new RegExp(`^${rowValue}$`, 'i') });
                                if (leadSource) {
                                    lead.leadSources = leadSource._id;
                                } else {
                                    leadSource = new LeadSource({ name: rowValue, isActive: true, isDeleted: false });
                                    await leadSource.save();
                                    lead.leadSources = leadSource._id;
                                }
                            }
                            if (keyName === 'date') {
                                const excelDate = ExcelDateToJSDate(rowValue);
                                const date = excelDate;
                                lead.leadDate = moment(date).format('YYYY-MM-DD');
                            }
                            if (keyName === 'given to' || keyName === 'assign to') {
                                let assignToKey = parseInt(rowValue);
                                assignTo = await Employee.findOne({ id: assignToKey });
                            }
                            if (keyName === 'feedback') {
                                feedback = rowValue;
                            }
                        }
    
                        let existingLead = await Lead.findOne({ phone: lead.phone });
                        let leadDate = lead.leadDate ? moment.tz(lead.leadDate, 'Asia/Kolkata').format('YYYYMMDD') : moment().tz('Asia/Kolkata').format('YYYYMMDD');
                        let formattedLeadDate = lead.leadDate ? moment.tz(lead.leadDate, 'Asia/Kolkata').format('YYYYMMDDHHmm') : moment().tz('Asia/Kolkata').format('YYYYMMDDHHmm');
                        lead.leadDate = leadDate;

                        if(existingLead){
                            existingLead.orderdAt = leadNewDate;

                            if(assignTo){
                                const isAssigned = await AssignLead.findOne({LeadId : existingLead._id, assignTo : assignTo._id});
                                if(!isAssigned) {
                                    let assignObject = {
                                        LeadId: existingLead._id,
                                        assignTo: assignTo._id,
                                        leadDate: formattedLeadDate,
                                        assignBy: userId
                                    };
                                    await new AssignLead(assignObject).save()    

                                    let followUpDate = new Date();
                                    followUpDate.setHours(followUpDate.getHours() - 5);
                                    followUpDate.setMinutes(followUpDate.getMinutes() - 30);
                                    let followUpTime = moment.tz(followUpDate, 'Asia/Kolkata');

                                    let leadTimelineObj = {
                                    leadDate: formattedLeadDate,
                                    senderId: assignTo._id,
                                    LeadId: existingLead._id,
                                    remark: '66642c3234b354a4fe00fac4',
                                    followUpTime: followUpTime,
                                    isNotificationSend : false,
                                    comment: feedback
                                    };
                                    if (projectId) {
                                        leadTimelineObj.projectId = projectId;
                                    }
                                    const scheduleDate = moment(new Date(), 'YYYYMMDDHHmm').add(5, 'minutes').format('YYYYMMDDHHmm');
                                    leadTimelineObj.scheduleDate = scheduleDate;
                                    await new LeadTimeline(leadTimelineObj).save();
                                }
                            }
                            await existingLead.save();
                            return existingLead;
                        }
                        else {
                            try {
                            let result = await Lead(lead).save();
                            if (assignTo) {
                                let assignObject = {
                                    LeadId: result._id,
                                    assignTo: assignTo._id,
                                    leadDate: formattedLeadDate,
                                    assignBy: userId
                                };
                                await new AssignLead(assignObject).save();

                                let followUpDate = new Date();
                                followUpDate.setHours(followUpDate.getHours() - 5);
                                followUpDate.setMinutes(followUpDate.getMinutes() - 30);
                                let followUpTime = moment.tz(followUpDate, 'Asia/Kolkata');

                                let leadTimelineObj = {
                                    leadDate: formattedLeadDate,
                                    senderId: assignTo._id,
                                    LeadId: result._id,
                                    remark: '66642c3234b354a4fe00fac4',
                                    followUpTime: followUpTime,
                                    isNotificationSend : false,
                                    comment: feedback
                                };
                                if (projectId) {
                                    leadTimelineObj.projectId = projectId;
                                }
                                const scheduleDate = moment(new Date(), 'YYYYMMDDHHmm').add(5, 'minutes').format('YYYYMMDDHHmm');
                                leadTimelineObj.scheduleDate = scheduleDate;
                                await new LeadTimeline(leadTimelineObj).save();
                            }
    
                            await Promise.all(findAdmins.map(async admin => {
                                let adminAssignObj = {
                                    LeadId: result._id,
                                    assignTo: admin._id,
                                    leadDate: formattedLeadDate,
                                    assignBy: userId
                                };
                                await new AssignLead(adminAssignObj).save();
                            }));
    
                            return result;
                        } catch (err) {
                            console.error("Error saving lead:", err);
                            throw err;
                        }}
                    }));
                    return res.success(leads, 'Leads created successfully');
                } catch (err) {
                    console.error("Error parsing Excel:", err);
                    return res.warn({}, 'Error processing form data');
                }
            });
        } catch (err) {
            console.error("Error in form parsing:", err);
            return res.warn({}, 'Error processing form data');
        }
    });
        } catch (err) {
            console.error("Error in createExcelLead:", err);
            return next(err);
        }
    }
    // async createExcellLead(req, res, next) {
    //     try {
    //         let { leadArray } = req.body;
    //         let leadDate = new Date();
    //         let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
    //         let attDate = dateLead.format('YYYYMMDD');
    //         let formattedDate = dateLead.format('YYYYMMDDHHmm');
    //         let findAdmins = await Employee.find({ role: 'Admin' });
    //         async
    //             .mapSeries(leadArray, async lead => {
    //                 let leadObj = {
    //                     name: lead.name,
    //                     phone: lead.phone,
    //                     leadDate: attDate,
    //                 };
    //                 let result = await Lead(leadObj).save();
    //                 findAdmins.map(async admin => {
    //                     let assignObj = {};
    //                     assignObj['LeadId'] = result._id;
    //                     assignObj['assignTo'] = admin._id;
    //                     assignObj['leadDate'] = formattedDate;
    //                     assignObj['assignBy'] = admin._id;
    //                     await new AssignLead(assignObj).save();
    //                 });
    //             })
    //             .then(async () => {
    //                 return res.success({}, 'lead create successfully');
    //             });
    //     } catch (err) {
    //         return next(err);
    //     }
    // }
    async unVisitLeadProject(req, res, next) {
        try {
            let employee = await Employee.findOne({ _id: req.user._id });
            let assignedlead = await AssignLead.find({
                $and: [{ assignTo: { $eq: req.user._id } }, { leadDate: { $gt: employee.lead_visit_time } }],
            });
            let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
            let lead = await Lead.find({ $and: [{ _id: { $in: assignedLeadArray } }, { isDeleted: false }] }).countDocuments();

            let assignedProArray = [];
            let assignedPro = await AssignProject.find({
                $and: [{ assignTo: { $eq: req.user._id } }, { projectDate: { $gt: employee.project_visit_time } }],
            });
            assignedPro.map(proId => {
                if (proId.isDeleted == false) {
                    assignedProArray.push(proId.projectId);
                }
            });
            let project = await Project.find({ _id: { $in: assignedProArray } }).countDocuments();
            return res.success(
                {
                    un_visit_lead: lead,
                    un_vist_project: project,
                },
                'Find data successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async homePageleadList(req, res, next) {
        try {
            let { leadStatus } = req.query;
            let query = {};
            let query_ = {};
            let leadVist_ = new Date();
            let dateLead_ = moment.tz(leadVist_, 'Asia/Kolkata');
            let leadVistTime = dateLead_.format('YYYYMMDDHHmm');
            let checkEmployee = await Employee.findOne({ _id: req.user._id }).populate({
                path: 'designationId',
                model: Designation,
            });
            checkEmployee.lead_visit_time = leadVistTime;
            checkEmployee.save();
            //if (checkEmployee.designationId.name == 'Executive') {
                query.assignTo = req.user._id
            //}
            if (leadStatus) {
               // query_ = { $eq: ['$leadStatus', Number(leadStatus)] }
            }
            let lead = await AssignLead.aggregate([
                {
                    $match :query
                },
                {
                    $lookup: {
                        from: 'leads',
                        let: {
                            leadId_: '$LeadId',
                            lastReadTime: "$lastReadTime"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$_id', '$$leadId_'] },{ $eq: ['$isActive', true] },{ $eq: ['$isDeleted', false] },query_],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'leadsources',
                                    localField: 'leadSources',
                                    foreignField: '_id',
                                    as: 'leadsources',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$leadsources',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'propertytypes',
                                    localField: 'propertyPreferences.propertyType',
                                    foreignField: '_id',
                                    as: 'propertytypes',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$propertytypes',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'locationpreferences',
                                    localField: 'propertyPreferences.locationpreferences',
                                    foreignField: '_id',
                                    as: 'locationpreferences',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$locationpreferences',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'leadlabels',
                                    localField: 'leadLabel',
                                    foreignField: '_id',
                                    as: 'leadlabels',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$leadlabels',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $lookup: {
                                    from: 'projects',
                                    localField: 'projectId',
                                    foreignField: '_id',
                                    as: 'projects',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$projects',
                                    preserveNullAndEmptyArrays: true
                                }
                            },
                            {
                                $project: {
                                    'leads': {
                                        _id: "$_id",
                                        gender: "$gender",
                                        age: "$age",
                                        Occupation: "$Occupation",
                                        isActive: "$isActive",
                                        name: "$name",
                                        phone: "$phone",
                                        leadStatus: "$leadStatus",
                                        leadDate: "$leadDate",
                                        comments: "$comments",
                                        alternateNumber: "$alternateNumber",
                                        'leadsources._id': "$leadsources._id",
                                        'leadsources.name': "$leadsources.name",
                                        'propertytypes._id': "$propertytypes._id",
                                        'propertytypes.name': "$propertytypes.name",
                                        'locationpreferences._id': '$locationpreferences._id',
                                        'locationpreferences.name': '$locationpreferences.name',
                                        'leadlabels.name': '$leadlabels.name',
                                        'leadlabels._id': '$leadlabels.name',
                                        'projects._id': '$projects.name',
                                        'projects.name': '$projects.name',
                                        'lastReadTime': "$$lastReadTime",
                                    },
                                },
                            },
                            { $replaceRoot: { newRoot: "$leads" } }
                        ],
                        as: 'leadsData',
                    },
                },
                {
                    $unwind: {
                        path: '$leadsData',
                        preserveNullAndEmptyArrays: false
                    }
                },
                { $replaceRoot: { newRoot: "$leadsData" } },
                {
                    $lookup: {
                        from: 'leadtimelines',
                        localField: '_id',
                        foreignField: 'LeadId',
                        as: 'leadtimelines',
                    },
                },
                {
                    $addFields: {
                        filteredLeadTimeline: {
                            $filter: {
                                input: '$leadtimelines',
                                cond: {
                                    $gt: ['$$this.leadDate', '$lastReadTime'],
                                },
                            },
                        },
                        filteredUpcoming: {
                            $filter: {
                                input: '$leadtimelines',
                                cond: {
                                    $gt: ['$$this.followUpTime', new Date()],
                                },
                            },
                        },
                        lastFollowUp: { $arrayElemAt: [ "$leadtimelines", -1 ] }
                    },
                },
                {
                    $project: {
                        gender: 1,
                        age: 1,
                        Occupation: 1,
                        isActive: 1,
                        name: 1,
                        phone: 1,
                        leadStatus: 1,
                        leadDate: 1,
                        startVisit: 1,
                        'leadsources.name': 1,
                        'leadsources._id': 1,
                        'propertyPreferences.NumberOfBHK': 1,
                        'propertyPreferences.budgetRange': 1,
                        'timelines.name': 1,
                        'timelines._id': 1,
                        comments: 1,
                        alternateNumber: 1,
                        'leadlabels.name': 1,
                        'leadlabels._id': 1,
                        'propertytypes.name': 1,
                        'propertytypes._id': 1,
                        'locationpreferences.name': 1,
                        'locationpreferences._id': 1,
                        'projects.name': 1,
                        'projects._id': 1,
                        unReadLeadTimelines: { $size: '$filteredLeadTimeline' },
                        upcomingTask: { $size: '$filteredUpcoming' },
                        lastFollowUpTime : '$lastFollowUp.followUpTime',
                        created: '$lastFollowUp.followUpTime'
                    },
                },
                {
                    $match: {
                        $or: [{'lastFollowUpTime': { "$exists": true }},{'lastFollowUpTime': { "$exists": true }}, {lastFollowUpBy: {$ne: req.user._id}, 'upcomingTask' : {$gt: 0}}],
                    }
                },
            ]).sort({ 'lastFollowUpTime': 1 });
            if (lead) {
                return res.success(
                    {
                        lead,
                    },
                    'Find All Lead Successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }
    async summeryReport(req, res, next) {
        try {
            let { empId } = req.query;
            let query = {};
            let query_ = {};
            let assignedlead = await AssignLead.find({ assignTo: ObjectId(empId) });
            let assignedLeadArray = await assignedlead.map(leadId => leadId.LeadId);
            let leadVist_ = new Date();
            let dateLead_ = moment.tz(leadVist_, 'Asia/Kolkata');
            let leadVistTime = dateLead_.format('YYYYMMDDHHmm');
            const convertedEndDate = dateLead_.format('YYYYMMDD');
            let checkEmployee = await Employee.findOne({ _id: ObjectId(empId) }).populate({
                path: 'designationId',
                model: Designation,
            });
            checkEmployee.lead_visit_time = leadVistTime;
            checkEmployee.save();
            if (checkEmployee.designationId.name == 'Executive') {
                query_ = {
                    $and: [
                        {
                            _id: { $in: assignedLeadArray },
                        },
                        { isActive: true },
                    ],
                };
            }
            query = {
                $and: [{ isDeleted: false }, query_],
            };
            let closedLead = await Lead.find({
                $and: [
                    {
                        leadStatus: 3,
                    },
                    query,
                ],
            }).countDocuments();
            let runningLeads = await Lead.find({
                $and: [
                    {
                        leadStatus: 1,
                    },
                    query,
                ],
            }).countDocuments();
            let assignedLead = await Lead.find(query).countDocuments();
            // today action lead
            const endDateString = String(convertedEndDate);
            let todayActionLeadRemark = await LeadTimeline.aggregate([
                {
                    $addFields: {
                        leadDateString: {
                            $substr: [{ $toString: '$leadDate' }, 0, 8],
                        },
                    },
                },
                {
                    $match: {
                        leadDateString: endDateString,
                    },
                },
            ]);
            let todayActionLeadArray = todayActionLeadRemark.map(lead => lead.LeadId);
            let todayActionQuery = {
                $and: [{ _id: { $in: todayActionLeadArray } }, query_],
            };
            let todayActionLead = await Lead.find(todayActionQuery).countDocuments();
            let successfulLeadPercent = (closedLead && assignedLead) ? Math.round((closedLead / assignedLead) * 100) : 0;
            let totalIncentiveEarn = await Salaries.find({
                employee_id: ObjectId(empId),
                salaryType: 'incentive',
            });
            let incentiveTotalEarn = 0;
            let incentiveCount = 0;
            totalIncentiveEarn.map(i => {
                incentiveTotalEarn += i.incentives;
                incentiveCount += 1;
            });
            //if (assignedLead) {
                return res.success(
                    {
                        assignedLead,
                        runningLeads,
                        closedLead,
                        todayActionLead,
                        successfulLeadPercent,
                        incentiveTotalEarn,
                        incentiveCount,
                    },
                    'Find Lead Summary Report Successfully'
                );
           // }
        } catch (err) {
            return next(err);
        }
    }
    async incentiveHistory(req, res, next) {
        try {
            let { empId } = req.query;
            let totalIncentiveEarn = await Salaries.find({
                employee_id: ObjectId(empId),
                salaryType: 'incentive',
            })
                .populate({ path: 'leadId', model: Lead, select: 'name phone' })
                .select('year month incentives leadId created');
            return res.success(
                {
                    totalIncentiveEarn,
                },
                'Find all incentive earn successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async sendLeadNotification() {
        try {
            let leadData = await LeadTimeline.find({
                "isNotificationSend": false,
                "followUpTime": {
                    "$lt": new Date(new Date().getTime() + 60000)
                }
            }).populate("LeadId").populate('remark');

            if (leadData && leadData.length > 0) {
                for (let item of leadData) {
                    const remark = (item.remark) ? item.remark.name : '';
                    const leadName = (item.LeadId) ? item.LeadId.name : '';
                    let employee = await Employee.findOne({ _id: item.senderId });
                    if (employee) {
                        let deviceToken = employee.deviceToken
                        let fcm = new FCM(serverKey);
                        let message = {
                            to: deviceToken,
                            notification: {
                                title: `Follow up Alert for the lead ${leadName} !!`,
                                body: `Action needed on the remark: ${remark}. Your response is important. Please reply when you can. Thanks!`,
                            },
                            data: {
                                screen: `home`,
                                channel_name: 'RealEstate',
                                channel_id: 'RealEstateChannel',
                                title: `Follow up Alert for the lead ${leadName} !!`,
                                body: `Action needed on the remark: ${remark}. Your response is important. Please reply when you can. Thanks!`,
                                type: 'Lead',
                                leadId: item.LeadId,
                                item_id: (Math.random() + 1).toString(36).substring(7)
                            }, 
                        };
                        fcm.send(message, async function (err, response) {
                            // if (err) {
                            //     console.log(err,"---------");
                            // } else {
                            if(item.LeadId == null) console.log(item)
                                let addNotification = {
                                    employee_id: employee._id,
                                    title: message.notification.title,
                                    description: message.notification.body,
                                    type: 'Lead',
                                    referanceId: item.LeadId._id,
                                    referanceType: "Lead"
                                };
                                await new Notification(addNotification).save();

                                //update lead time line
                                await LeadTimeline.updateOne(
                                    { _id: item._id },
                                    {
                                        $set: {
                                            isNotificationSend: true,
                                        },
                                    }
                                );
                           // }
                        });
                    }
                }
            }
        } catch (err) {
            throw err;
        }
    }

    async crmIntegration() {
        try {
            let sourceData = await Source.find({})
                .sort({ updated: 1 })
                .limit(1);

            if (sourceData && sourceData.length > 0) {
                let data = sourceData[0];
                if (data.name === 'magicBricks') {
                    let apiResponse = await LeadService.magicBrickService(data);
                    await Source.updateOne({ _id: sourceData[0]._id }, { $set: {} })
                    return {apiResponse};
                }
            } else {
                return {
                    message: 'No source data available'
                };
            }
        } catch (err) {
            return {err};
        }
    }

    async exportLead(req, res, next) {
        try {
            const { startDate, endDate, empId } = req.query;
            let leadQuery = [];
            let query = {};
            if (startDate && endDate) {
                let startDate_ = moment(startDate, 'YYYY-MM-DD');
                let convertedStartDate = startDate_.format('YYYYMMDD');
                let endDate_ = moment(endDate, 'YYYY-MM-DD');
                let convertedEndDate = endDate_.format('YYYYMMDD');

                query = {
                    leadDate: {
                        $gte: Number(convertedStartDate),
                        $lte: Number(convertedEndDate),
                    },
                };

                leadQuery.push({
                    '$match' : query
                })
            }


            leadQuery.push({
                $lookup: {
                    from: "locationpreferences",
                    localField: "propertyPreferences.locationpreferences",
                    foreignField: "_id",
                    as: "locationpreferences"
                }
            },
            {
                $lookup: {
                    from: "propertytypes",
                    localField: "propertyPreferences.propertyType",
                    foreignField: "_id",
                    as: "propertytypes"
                }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "projects"
                }
            },
            {
                $lookup: {
                    from: "leadsources",
                    localField: "leadSources",
                    foreignField: "_id",
                    as: "leadsources"
                }
            },
            {
                $lookup: {
                    from: "assignleads",
                    localField: "_id",
                    foreignField: "LeadId",
                    as: "assignleads"
                }
            },
            {
                $unwind: "$assignleads"
            })

            if(empId){
                leadQuery.push({
                    '$match': {
                        'assignleads.assignTo' : ObjectId(empId)
                    }
                })
            }

            leadQuery.push({
                $lookup: {
                    from: "employees",
                    localField: "assignleads.assignTo",
                    foreignField: "_id",
                    as: "employees"
                }
            },
            {
                $unwind: "$employees"
            },
            {
                $match: {
                    "employees.role": { $ne: "Admin" }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    email: { $first: "$email" },
                    name: { $first: "$name" },
                    phone: { $first: "$phone" },
                    age: { $first: "$age" },
                    gender: { $first: "$gender" },
                    leadStatus: { $first: "$leadStatus" },
                    location: { $first: { $arrayElemAt: ["$locationpreferences.name", 0] } },
                    propertytype: { $first: { $arrayElemAt: ["$propertytypes.name", 0] } },
                    projectsName: { $first: { $arrayElemAt: ["$projects.name", 0] } },
                    leadsources: { $first: { $arrayElemAt: ["$leadsources.name", 0] } },
                    assignTo: { $push: "$employees.name" },
                    comment: { $first: "$comments" },
                    leadDate: { $first: "$leadDate" },
                    createdDate: { $first: "$created" }
                }
            },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    name: 1,
                    phone: 1,
                    age: 1,
                    gender: 1,
                    leadStatus: 1,
                    location: 1,
                    propertytype: 1,
                    projectsName: 1,
                    leadsources: 1,
                    assignTo: 1,
                    comment: 1,
                    leadDate: 1,
                    createdDate: 1
                }
            },
            {
                $sort: { leadDate: -1 }
            });
            const leads = await Lead.aggregate(leadQuery);
            if(leads && leads.length > 0){
                leads.forEach(lead => {
                    let leadDate = moment(lead.leadDate, 'YYYY-MM-DD');
                    lead.email = lead.email ? lead.email : "",
                    lead.name = lead.name ? lead.name : "",
                    lead.phone = lead.phone ? lead.phone : "",
                    lead.age = lead.age ? lead.age : "",
                    lead.gender = lead.gender ? lead.gender : "",
                    lead.leadStatus = lead.leadStatus == 1 ? "running" : lead.leadStatus == 2 ? "unAssigned" : "Completed",
                    lead.location = lead.location ? lead.location : "",
                    lead.propertytype = lead.propertytype ? lead.propertytype : "",
                    lead.projectsName = lead.projectsName ? lead.projectsName : "",
                    lead.leadsources = lead.leadsources ? lead.leadsources : "",
                    lead.assignTo = lead.assignTo && lead.assignTo.length > 0 ? lead.assignTo.join(", ") : "",
                    lead.comment = lead.comment ? lead.comment : "",
                    lead.leadDate = leadDate ?  leadDate.format('YYYY-MM-DD') : "",
                    lead.createdDate = lead.createdDate ? moment(lead.createdDate).format('YYYY-MM-DD') : "";
                });
                let csvRespone = converter.json2csv(leads);
                let fileNamePayload = {
                    fileKeyName: 'Lead_List',
                    startDate,
                    endDate
                };
                let filename = createFileNameFromDate(fileNamePayload);
                res.attachment(filename);
                res.status(200).send(csvRespone);
            }else{
                return res.warn({}, 'Leads Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }

    async findTodayHoliday(req, res, next) {
        try {
            const currentTimezone = "Asia/Kolkata";
            let currentDate = moment().tz(currentTimezone);
            let dayOfWeek = currentDate.format("dddd");

            if (dayOfWeek !== "Friday") {
            return res.success({}, "This function should only run on Friday");
            }
    
            let nextMonday = currentDate.clone().add(1, 'weeks').startOf('week').add(1, 'days'); 
            let endOfNextWeek = nextMonday.clone().endOf('week').subtract(1, 'days');

            let startOfWeekDate = nextMonday.format("YYYYMMDD");
            let endOfWeekDate = endOfNextWeek.format("YYYYMMDD");

            let holidays = await Calendar.find({
            date_: {
              $gte: startOfWeekDate, 
              $lte: endOfWeekDate  
            }
            });

            if (!holidays || holidays.length === 0) {
                return res.success({}, "No holidays found for the next week.");
            }
            
            let holidayArray = holidays.map(holiday => holiday)

            let dates = holidays.map(holiday => moment(holiday.date_, "YYYYMMDD").format("DD/MM/YYYY")).join(", ");
            let occasionSet = new Set(holidays.map(holiday => holiday.occasion));
            let occasion = Array.from(occasionSet).join(", ");

            let admin = await Employee.find({isDeleted: false });
                let deviceTokens = [];
                let notifications = [];
                
                for (const adminData of admin) {
                    let addNotification = {
                        employee_id: adminData._id,
                        title: `Holiday Alert`,
                        description: `Next week on date(s): ${dates} there will be holiday due to occaision : ${occasion}`,
                        type: 'Holiday',
                        notificationTime: currentDate.format('YYYYMMDDHHmm')
                    };

                    notifications.push(addNotification);
                    if(adminData.deviceToken && adminData.deviceToken.length > 6) {
                        deviceTokens.push(adminData.deviceToken);
                    }
                }

                for (let token of deviceTokens) {
                    let message = {
                        token: token,
                        notification: {
                            title: `Holiday Alert`,
                            body: `Next week on date(s): ${dates} there will be holiday due to occaision : ${occasion}`,
                        },
                        data: {
                            screen: 'home',
                            channel_name: 'RealEstate',
                            channel_id: 'RealEstateChannel',
                            title: `Holiday Alert`,
                            type: 'Holiday',
                            body: `Next week on date(s): ${dates} there will be holiday due to occaision : ${occasion}`,
                            item_id: (Math.random() + 1).toString(36).substring(7)
                        },
                    };

                    await Notification.insertMany(notifications);

                    try {
                        await sendNotifications({message});
                    } catch (err) {
                        console.error('Error sending notification:', err);
                    }
                }
            return res.success({ holidays: holidayArray , occasion, dates }, "Holidays for the next week fetched successfully.");
        } catch (err) {
            console.log(err)
          return next(err);
        }
    }
}


function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

module.exports = new LeadController();
