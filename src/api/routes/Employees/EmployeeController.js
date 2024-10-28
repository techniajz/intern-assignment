const {
    models: {
        Employee,
        Designation,
        Attendance,
        Attachment,
        LeadTimeline,
        Lead,
        Remark,
        Calendar,
        LeaveRequest,
        Message,
        LocationTruck,
        Notification,
        AdminSetting,
        Expense
    },
} = require('../../../../lib/models');
const multiparty = require('multiparty');
const { uploadImage,getAddressFromCoordinates, convertJsonToCsv, createFileNameFromDate,formatDate2,showpunchTime, sendNotifications } = require('../../../../lib/util');
var _ = require('lodash');
const moment = require('moment-timezone');
const async = require('async');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_MAIL = process.env.FROM_MAIL;
const FCM = require('fcm-node');
const serverKey = process.env.SERVER_KEY;

class EmployeeController {
    async addEmployee(req, res, next) {
        try {
            let employee = {};
            let designations = await Designation.findOne({ name: 'Executive' });
            let form = new multiparty.Form();
            form.parse(req, async function(err, fields, files) {
                let checkEmp = await Employee.findOne({
                    isDeleted: false,
                    $or: [{ mobile: fields.mobile[0] }, { email: fields.email[0] }],
                });
                if (checkEmp) {
                    return res.warn({}, 'Already exists this mobile');
                }
                _.forOwn(fields, (field, key) => {
                    employee[key] = field[0];
                });
                try {
                    if (typeof files.image !== 'undefined') {
                        let fileupload = files.image[0];
                        let image = await uploadImage(fileupload, 'image');
                        employee['profile_pitcture'] = image.Key;
                    }
                    employee['mobile'] = Number(fields.mobile[0]);
                    employee['emergency_contact.mobile'] = fields.emergencyNumber[0];
                    employee['designationId'] = designations._id;
                    await new Employee(employee).save();
                    return res.success(
                        {
                            data: employee,
                        },
                        'Create Employee Successfully'
                    );
                } catch (err) {
                    return next(err);
                }
            });
        } catch (err) {
            return next(err);
        }
    }
    async editEmployee(req, res, next) {
        try {
            const { employeeId } = req.params;
            let employee = await Employee.findOne({ _id: ObjectId(employeeId) });
            if (employee) {
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        employee[key] = field[0];
                    });
                    try {
                        if (typeof files.image !== 'undefined') {
                            let fileupload = files.image[0];
                            let image = await uploadImage(fileupload, 'image');
                            employee['profile_pitcture'] = image.Key;
                        }
                        employee['emergency_contact']['mobile'] = fields.emergencyNumber[0];
                        await new Employee(employee).save();
                        return res.success(
                            {
                                data: employee,
                            },
                            'Update Employee Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async employeeDetails(req, res, next) {
        try {
            const { employeeId } = req.params;
            let employee = await Employee.findOne({ _id: employeeId }).populate({
                path: 'designationId',
                model: Designation,
                select: 'name',
            });
            let location = await LocationTruck.findOne({ empId: ObjectId(employeeId) }).sort({ created: -1 });
            if (employee) {
                return res.success(
                    {
                        employee: employee,
                        location: location,
                        totalCount: 50,
                    },
                    'Find Employee Detail Successfully'
                );
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async allEmployee(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;
            const search = req.query.search || "";
            // Constructing the search criteria
            const searchCriteria = { isDeleted: false };
            if (search) {
                const orConditions = [];
                const searchNumber = Number(search);

                if (!isNaN(searchNumber)) {
                    orConditions.push({ mobile: searchNumber });
                }

                orConditions.push({ email: { $regex: new RegExp(search, 'i') } });
                orConditions.push({ name: { $regex: new RegExp(search, 'i') } });
                searchCriteria.$or = orConditions;
            }

            let employee = await Employee
                .find(searchCriteria)
                .populate({
                    path: 'designationId',
                    model: Designation,
                    select: 'name otp',
                })
                .sort({ created: -1 })
                .skip(skip)
                .limit(limit);
                const totalCount = await Employee.countDocuments(searchCriteria);
            if (employee) {
                return res.success(
                    {
                        employee,
                        totalCount
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
    async deleteEmployee(req, res, next) {
        try {
            let { employeeId } = req.params;
            let employee = await Employee.findOne({ _id: ObjectId(employeeId) });
            if (employee) {
                await Employee.updateOne(
                    { _id: ObjectId(employeeId) },
                    {
                        $set: {
                            isDeleted: true,
                        },
                    }
                );
            }
            return res.success({}, 'Employee Deleted Successfully');
        } catch (err) {
            return next(err);
        }
    }
    async employeeStatus(req, res, next) {
        try {
            const { employeeId } = req.params;
            let employee = await Employee.findOne({ _id: ObjectId(employeeId) });
            if (employee) {
                if (employee.status) {
                    employee.status = false;
                    employee.authTokenIssuedAt = null;
                    employee.deviceToken = null;
                    await employee.save();
                    return res.success({}, 'Employee inActive successfully');
                } else {
                    employee.status = true;
                    await employee.save();
                    return res.success({}, 'Employee Active successfully');
                }
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async profile(req, res, next) {
        try {
            let employeeId = req.user._id;
            let employee = await Employee.findOne({ _id: employeeId });
            return res.success(employee);
        } catch (err) {
            return next(err);
        }
    }
    async attendance(req, res, next) {
        try {
            const empId = req.user._id;
            let form = new multiparty.Form();
    
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    return next(err); // Handle error
                }
    
                const attId = fields.attId && fields.attId.length > 0 ? fields.attId[0] : null;
                const punchIn = fields.punchIn ? fields.punchIn[0] : null;
                const punchOut = fields.punchOut ? fields.punchOut[0] : null;
                const lat = fields.lat ? fields.lat[0] : null;
                const long = fields.long ? fields.long[0] : null;

                /**Get Address from lat long */
                const address = await getAddressFromCoordinates(lat, long);
                let leadDate = new Date();
                let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
                let attDate = dateLead.format('YYYYMMDD');
                let attTime = dateLead.format('HHmmss');
    
                let attendance = await Attendance.findOne({ empId: ObjectId(empId), attDate: attDate });

                if(attId){
                    attendance = await Attendance.findOne({ _id: ObjectId(attId) });
                }
    
                // Handle file uploads
                let punchInSelfi, punchOutSelfi;
                if (files) {
                    if (files && files.punchInSelfi) {
                        let fileupload = files.punchInSelfi[0];
                        punchInSelfi = await uploadImage(fileupload, 'image');
                    }
                    if (files && files.punchOutSelfi) {
                        let fileupload = files.punchOutSelfi[0];
                        punchOutSelfi = await uploadImage(fileupload, 'image');
                    }
                }
    
                if (!attendance) {
                    if (punchOut) {
                        return res.status(400).json({ message: "Cannot punch out without punching in first." });
                    }
                    attendance = new Attendance({
                        empId,
                        attDate,
                        punchIn,
                        punchInTime: attTime,
                        inAddress: address,
                        loc: {
                            type: "",
                            coordinates: [lat, long]
                        },
                        history: []
                    });
                    if (punchIn) {
                        attendance.history.push({
                            punchIn,
                            punchInTime: attTime,
                            inAddress: address,
                            loc: {
                                type: "",
                                coordinates: [lat, long]
                            },
                            punchInSelfi: punchInSelfi ? punchInSelfi.key : null
                        });
                    }
                } else {
                    if (punchIn) {
                        if (attendance.punchIn && !attendance.punchOut) {
                            return res.status(400).json({ message: "Already punched in, please punch out first." });
                        }
                        const lastHistoryEntry = attendance.history[attendance.history.length - 1];
                        if (lastHistoryEntry && lastHistoryEntry.punchOut) {
                            if(attendance.punchInTime === '0'){
                                attendance.punchInTime = attTime;
                            }
                            attendance.punchOut = false;
                            attendance.history.push({
                                punchIn,
                                punchInTime: attTime,
                                inAddress: address,
                                loc: {
                                    type: "",
                                    coordinates: [lat, long]
                                },
                                punchInSelfi: punchInSelfi ? punchInSelfi.key : null
                            });
                        } else if (!lastHistoryEntry || !lastHistoryEntry.punchOut) {
                            return res.status(400).json({ message: "Cannot punch in without punching out first." });
                        }
                    } else if (punchOut) {
                        if (!attendance.punchIn) {
                            return res.status(400).json({ message: "Cannot punch out without punching in first." });
                        }
                        attendance.outAddress = address;
                        attendance.outLoc = {
                            type: "Point",
                            coordinates: [lat, long]
                        };
                        const lastHistoryEntry = attendance.history[attendance.history.length - 1];
                        if (lastHistoryEntry && !lastHistoryEntry.punchOut) {
                            lastHistoryEntry.punchOut = true;
                            lastHistoryEntry.punchOutTime = attTime;
                            lastHistoryEntry.outAddress = address;
                            lastHistoryEntry.outLoc = {
                                type: "Point",
                                coordinates: [lat, long]
                            };
                            lastHistoryEntry.punchOutSelfi = punchOutSelfi ? punchOutSelfi.key : null;

                            let totalDuration = moment.duration();
                            attendance.history.forEach(entry => {
                                if (entry.punchInTime && entry.punchOutTime) {
                                    const entryPunchInTime = moment(entry.punchInTime, 'HHmmss');
                                    const entryPunchOutTime = moment(entry.punchOutTime, 'HHmmss');
                                    if (entryPunchOutTime.isBefore(entryPunchInTime)) {
                                        entryPunchOutTime.add(1, 'day');
                                    }
                                    const entryDuration = moment.duration(entryPunchOutTime.diff(entryPunchInTime));
                                    totalDuration.add(entryDuration);
                                }
                            });
                            const totalHoursStr = `${Math.floor(totalDuration.asHours())}h ${totalDuration.minutes()}m`;
                            attendance.totalHours = totalHoursStr;
                        } else {
                            return res.status(400).json({ message: "Cannot punch out without punching in first." });
                        }
    
                        attendance.punchOut = true;
                        attendance.punchOutTime = attTime;
                    }
                }
    
                await attendance.save();
    
                return res.success(
                    {
                        attendance,
                    },
                    'Attendance recorded successfully'
                );
            });
        } catch (err) {
            return next(err);
        }
    }
    async attendanceList(req, res, next) { 
        try {
            let empId = req.query.empId ? req.query.empId : req.params.empId ? req.params.empId : '';
            let { startDate, endDate ,page = 1, limit = 10 } = req.query;
            const isExport = req.query.isExport && req.query.isExport !== 'false' ? true : false;
            let query = {};
            let startDate_ = moment.tz(startDate, 'Asia/Kolkata');
            let convertedStartDate = startDate_.format('YYYYMMDD');
            let endDate_ = moment.tz(endDate, 'Asia/Kolkata');
            let convertedendDate = endDate_.format('YYYYMMDD');
            if(empId){
               query = { empId: ObjectId(empId) }; 
            }
            if (startDate && endDate) {
                query = {
                    $and: [
                        {
                            attDate: {
                                $gte: Number(convertedStartDate),
                                $lte: Number(convertedendDate),
                            },
                        }
                    ],
                };
            }
            if (startDate && endDate && empId) {
                query = {
                    $and: [
                        {
                            attDate: {
                                $gte: Number(convertedStartDate),
                                $lte: Number(convertedendDate),
                            },
                        },
                        {
                            empId: ObjectId(empId),
                        },
                    ],
                };
            };
            let sortOptions = {};
            sortOptions = {
                attDate: -1,
                punchInTime: -1
            }
            let options = {
                sort: sortOptions,
                skip: parseInt(limit, 10) * (parseInt(page, 10) - 1) || 0,
                limit: parseInt(limit, 10) || 10,
            };
            let attListQuery = Attendance.find(query)
            .populate({
                path: 'empId',
                model: Employee,
                select: 'name mobile',
            })
            .sort(sortOptions);
            if (!isExport) {
                attListQuery.skip(options.skip).limit(options.limit);
            }
            let attList = await attListQuery.exec();
            if (isExport) {
                if (attList && attList.length > 0) {
                    let mappedData = [];
                    for (let item of attList) {
                        mappedData.push({
                            Name: item.empId.name,
                            Date: formatDate2(item.created),
                            'Punch In Time': item.punchInTime ? showpunchTime(item.punchInTime) : '',
                            'Punch Out Time': item.punchOutTime ? showpunchTime(item.punchOutTime) : '',
                            'Total Hours': item.totalHours ? item.totalHours : '' ,
                            'Punch In Latitude': item.loc.coordinates.length > 0 && item.loc.coordinates[0] ? item.loc.coordinates[0] : '' ,
                            'Punch In Longitude': item.loc.coordinates.length > 1 && item.loc.coordinates[1] ? item.loc.coordinates[1] : '',
                            'Punch In Address': item.inAddress,
                            'Punch Out Latitude': item.outLoc.coordinates.length > 0 && item.outLoc.coordinates[0] ? item.outLoc.coordinates[0] : '' ,
                            'Punch Out Longitude': item.outLoc.coordinates.length > 1 && item.outLoc.coordinates[1] ? item.outLoc.coordinates[1] : '',
                            'Punch out Address': item.outAddress,
                            'Last Screen Opened': item.lastScreenVisited ? moment.tz(item.lastScreenVisited, 'Asia/Kolkata').format('hh:mm:ss A') : '',
                        })
                    }
                    let csvRespone = await convertJsonToCsv(mappedData);
                    let fileNamePayload = {
                        fileKeyName: 'attendanceList',
                        startDate,
                        endDate
                    };
                    let filename = createFileNameFromDate(fileNamePayload);
                    res.attachment(filename);
                    res.status(200).send(csvRespone);
                } else {
                    return next({ message: req.__('Export data was not found.') });
                }
            } else {
                let total = await Attendance.countDocuments(query);
                return res.success({
                    attList: attList,
                    total: total,
                }, attList.length > 0 ? 'Attendance found successfully' : 'Attendance list not found.');
            }
        } catch (err) {
            return next(err);
        }
    }
    async checkDayAttendance(req, res, next) {
        try {
            const {empId} = req.params;
            let leadDate = new Date();
            let dateLead = moment(leadDate);
            let attDate = dateLead.format('YYYYMMDD');
            let checkTodayAtt = await Attendance.findOne({
                    $and: [{ empId: ObjectId(empId) }, { attDate: attDate }],
                }).select('punchIn punchOut punchInTime punchOutTime');
            
            if (checkTodayAtt) {
                return res.success({
                    checkTodayAtt,
                });
            } else {
                return res.warn({}, 'Today record not found');
            }
        } catch (err) {
            return next(err);
        }
    }

    async checkYesterdayAttendance(req, res, next) {
        try {
            console.log('called')
            const {empId} = req.params;
            let leadDate = new Date();
            let dateLead = moment(leadDate);
            let yesterdayDate = dateLead.clone().subtract(1, 'days');
            let yesterdayAttDate = yesterdayDate.format('YYYYMMDD');
            let checkTodayAtt = await Attendance.findOne({
                $and: [{ empId: ObjectId(empId) }, { attDate: yesterdayAttDate }],
            }).select('punchIn punchOut punchInTime punchOutTime attDate');
            
            if (checkTodayAtt) {
                return res.success({
                    checkTodayAtt,
                });
            } else {
                return res.warn({}, 'Today record not found');
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

    async employeeInfo(req, res, next) {
        try {
            const { employeeId } = req.params;
            let employee = await Employee.findOne({ id: employeeId })
            .select('name _id');
            if (employee) {
                return res.success(
                    {
                        employee: employee,
                    },
                    'Find Employee Detail Successfully'
                );
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

    async getEmployeeAttendance(req, res, next) {
        try {
            let { empId, attDate } = req.query;
            let dateLead = moment.tz(attDate, 'Asia/Kolkata');
            let attendanceDate = dateLead.format('YYYYMMDD');

            let checkEmployeeAtt = await Attendance.findOne({
                $and: [{ empId: ObjectId(empId) }, { attDate: attendanceDate }],
            }).select('punchInTime punchOutTime');
            if (checkEmployeeAtt) {
                return res.success({
                    checkEmployeeAtt,
                });
            } else {
                return res.warn({}, 'Attendance record not found');
            }
        } catch (err) {
            return next(err);
        }
    }

    async centralAttendance(req, res, next) {
        try {
            // const empId = req.user._id;
            let form = new multiparty.Form();
    
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    return next(err); // Handle error
                }
    
                const empId = fields.empId ? fields.empId[0] : null;
                const punchIn = fields.punchIn ? fields.punchIn[0] : null;
                const punchOut = fields.punchOut ? fields.punchOut[0] : null;
                const lat = fields.lat ? fields.lat[0] : null;
                const long = fields.long ? fields.long[0] : null;

                /**Get Address from lat long */
                const address = await getAddressFromCoordinates(lat, long);
                let leadDate = new Date();
                let dateLead = moment.tz(leadDate, 'Asia/Kolkata');
                let attDate = dateLead.format('YYYYMMDD');
                let attTime = dateLead.format('HHmmss');
    
                let attendance = await Attendance.findOne({ empId: ObjectId(empId), attDate: attDate });
    
                // Handle file uploads
                let punchInSelfi, punchOutSelfi;
                if (files) {
                    if (files && files.punchInSelfi) {
                        let fileupload = files.punchInSelfi[0];
                        punchInSelfi = await uploadImage(fileupload, 'image');
                    }
                    if (files && files.punchOutSelfi) {
                        let fileupload = files.punchOutSelfi[0];
                        punchOutSelfi = await uploadImage(fileupload, 'image');
                    }
                }
    
                if (!attendance) {
                    if (punchOut) {
                        return res.status(400).json({ message: "Cannot punch out without punching in first." });
                    }
                    attendance = new Attendance({
                        empId,
                        attDate,
                        punchIn,
                        punchInTime: attTime,
                        inAddress: address,
                        loc: {
                            type: "",
                            coordinates: [lat, long]
                        },
                        history: []
                    });
                    if (punchIn) {
                        attendance.history.push({
                            punchIn,
                            punchInTime: attTime,
                            inAddress: address,
                            loc: {
                                type: "",
                                coordinates: [lat, long]
                            },
                            punchInSelfi: punchInSelfi ? punchInSelfi.key : null
                        });
                    }
                } else {
                    if (punchIn) {
                        if (attendance.punchIn && !attendance.punchOut) {
                            return res.status(400).json({ message: "Already punched in, please punch out first." });
                        }
                        const lastHistoryEntry = attendance.history[attendance.history.length - 1];
                        if (lastHistoryEntry && lastHistoryEntry.punchOut) {
                            if(attendance.punchInTime === '0'){
                                attendance.punchInTime = attTime;
                            }
                            attendance.punchOut = false;
                            attendance.history.push({
                                punchIn,
                                punchInTime: attTime,
                                inAddress: address,
                                loc: {
                                    type: "",
                                    coordinates: [lat, long]
                                },
                                punchInSelfi: punchInSelfi ? punchInSelfi.key : null
                            });
                        } else if (!lastHistoryEntry || !lastHistoryEntry.punchOut) {
                            return res.status(400).json({ message: "Cannot punch in without punching out first." });
                        }
                    } else if (punchOut) {
                        if (!attendance.punchIn) {
                            return res.status(400).json({ message: "Cannot punch out without punching in first." });
                        }
                        attendance.outAddress = address;
                        attendance.outLoc = {
                            type: "Point",
                            coordinates: [lat, long]
                        };
                        const lastHistoryEntry = attendance.history[attendance.history.length - 1];
                        if (lastHistoryEntry && !lastHistoryEntry.punchOut) {
                            lastHistoryEntry.punchOut = true;
                            lastHistoryEntry.punchOutTime = attTime;
                            lastHistoryEntry.outAddress = address;
                            lastHistoryEntry.outLoc = {
                                type: "Point",
                                coordinates: [lat, long]
                            };
                            lastHistoryEntry.punchOutSelfi = punchOutSelfi ? punchOutSelfi.key : null;

                            let totalDuration = moment.duration();
                            attendance.history.forEach(entry => {
                                if (entry.punchInTime && entry.punchOutTime) {
                                    const entryPunchInTime = moment(entry.punchInTime, 'HHmmss');
                                    const entryPunchOutTime = moment(entry.punchOutTime, 'HHmmss');
                                    if (entryPunchOutTime.isBefore(entryPunchInTime)) {
                                        entryPunchOutTime.add(1, 'day');
                                    }
                                    const entryDuration = moment.duration(entryPunchOutTime.diff(entryPunchInTime));
                                    totalDuration.add(entryDuration);
                                }
                            });
                            const totalHoursStr = `${Math.floor(totalDuration.asHours())}h ${totalDuration.minutes()}m`;
                            attendance.totalHours = totalHoursStr;
                        } else {
                            return res.status(400).json({ message: "Cannot punch out without punching in first." });
                        }
    
                        attendance.punchOut = true;
                        attendance.punchOutTime = attTime;
                    }
                }
    
                await attendance.save();
    
                return res.success(
                    {
                        attendance,
                    },
                    'Attendance recorded successfully'
                );
            });
        } catch (err) {
            return next(err);
        }
    }

    async updateEmployeeAttendance(req, res, next) {
        try {
            let form = new multiparty.Form();
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    return next(err);
                }
    
                const attId = fields.attId && fields.attId.length > 0 ? fields.attId[0] : null;
                const attendancedate = fields.date ? fields.date[0] : null;
                const empId = fields.empId ? fields.empId[0] : null;
                const lat = fields.lat ? fields.lat[0] : null;
                const long = fields.long ? fields.long[0] : null;
                const punchInTime = fields.punchInTime ? fields.punchInTime[0] : null;
                const punchOutTime = fields.punchOutTime ? fields.punchOutTime[0] : null;
    
                if (!attendancedate || !empId) {
                    return res.warn({}, 'Date and Employee ID are required');
                }
    
                const currentDate = new Date();
                let todayDate = moment.tz(attendancedate, 'Asia/Kolkata');
                const attendanceDateObj = new Date(todayDate);
    
                if (attendanceDateObj.setHours(0, 0, 0, 0) >= currentDate.setHours(0, 0, 0, 0)) {
                    return res.warn({}, 'Attendance date cannot be today or a future date');
                }
    
                let dateLead = moment.tz(attendancedate, 'Asia/Kolkata');
                let attDate = dateLead.format('YYYYMMDD');
                const address = await getAddressFromCoordinates(lat, long);
    
                const attendanceData = {
                    empId: empId,
                    attDate: attDate,
                    punchIn: true,
                    punchOut: true,
                    punchInTime: punchInTime,
                    punchOutTime: punchOutTime,
                    inAddress: address,
                    outAddress: address,
                };
    
                if (attId && attId !== 'undefined') {
                    let attendance = await Attendance.findOne({ _id: ObjectId(attId) });
    
                    if (attendance) {
                        const length = attendance.history.length;
    
                        if (attendance.loc.coordinates.length === 0) {
                            attendanceData.loc = {
                                type: "",
                                coordinates: [lat, long],
                            };
                        }
    
                        if (attendance.outLoc.coordinates.length === 0) {
                            attendanceData.outLoc = {
                                type: "",
                                coordinates: [lat, long],
                            };
                        }

                        if(length > 0 ){
                            attendance.history[0].punchInTime = punchInTime;
                            attendance.history[length - 1].punchOutTime = punchOutTime;
                            attendance.history[length - 1].punchOut = true;
                            attendance.history[0].loc = {
                                type: "",
                                coordinates: [lat, long],
                            };
                            attendance.history[length - 1].outLoc = {
                                type: "",
                                coordinates: [lat, long],
                            };
                        } else {
                            const history = {
                                punchInTime: punchInTime,
                                punchOutTime: punchOutTime,
                                punchIn: true,
                                punchOut: true,
                                loc: {
                                    type: "",
                                    coordinates: [lat, long],
                                },
                                outLoc: {
                                    type: "",
                                    coordinates: [lat, long],
                                },
                            };
                            attendance.isLeave = false;

                            attendance.history.push(history);
                        }
    
                        let totalDuration = moment.duration();
                        attendance.history.forEach(entry => {
                            if (entry.punchInTime && entry.punchOutTime) {
                                const entryPunchInTime = moment(entry.punchInTime, 'HHmmss');
                                const entryPunchOutTime = moment(entry.punchOutTime, 'HHmmss');
                                if (entryPunchOutTime.isBefore(entryPunchInTime)) {
                                    entryPunchOutTime.add(1, 'day');
                                }
                                const entryDuration = moment.duration(entryPunchOutTime.diff(entryPunchInTime));
                                totalDuration.add(entryDuration);
                            }
                        });
    
                        const totalHoursStr = `${Math.floor(totalDuration.asHours())}h ${totalDuration.minutes()}m`;
                        attendance.totalHours = totalHoursStr;
    
                        Object.assign(attendance, attendanceData);
                        const empAttendance = await attendance.save();
    
                        return res.success({
                            empAttendance,
                        }, 'Attendance updated successfully');
                    } else {
                        return res.warn({}, 'Attendance record not found');
                    }
                } else {
                    const history = {
                        punchInTime: punchInTime,
                        punchOutTime: punchOutTime,
                        punchIn: true,
                        punchOut: true,
                        loc: {
                            type: "",
                            coordinates: [lat, long],
                        },
                        outLoc: {
                            type: "",
                            coordinates: [lat, long],
                        },
                    };
    
                    let totalDuration = moment.duration();
                    const entryPunchInTime = moment(punchInTime, 'HHmmss');
                    const entryPunchOutTime = moment(punchOutTime, 'HHmmss');
                    if (entryPunchOutTime.isBefore(entryPunchInTime)) {
                        entryPunchOutTime.add(1, 'day');
                    }
                    const entryDuration = moment.duration(entryPunchOutTime.diff(entryPunchInTime));
                    totalDuration.add(entryDuration);
    
                    const totalHoursStr = `${Math.floor(totalDuration.asHours())}h ${totalDuration.minutes()}m`;
    
                    attendanceData.history = [history];
                    attendanceData.totalHours = totalHoursStr;
                    attendanceData.loc = {
                        type: "",
                        coordinates: [lat, long],
                    };
                    attendanceData.outLoc = {
                        type: "",
                        coordinates: [lat, long],
                    };
    
                    const empAttendance = new Attendance(attendanceData);
                    await empAttendance.save();
    
                    return res.success({
                        empAttendance,
                    }, 'Attendance created successfully');
                }
            });
        } catch (err) {
            return next(err);
        }
    }
    

    async attendanceCron(req, res, next) {
        try {
            let date = new Date();
            let attendanceDate = moment.tz(date, 'Asia/Kolkata');
            let attDate = attendanceDate.format('YYYYMMDD');
            let attTime = attendanceDate.format('HHmmss');

            // Find attendance records for the date
            let attendance = await Attendance.find({ attDate: attDate });
            // Extract empId from attendance records
            let attendedEmpIds = attendance.map(record => record.empId);
            // Fetch employees whose entries are not in the attendance collection
            let absentEmployees = await Employee.find({
                _id: { $nin: attendedEmpIds },
                isDeleted: false
            });
            for (let employee of absentEmployees) {
                let newAttendance = new Attendance({
                    loc: { type: '', coordinates: [] },
                    outLoc: { type: '', coordinates: [] },
                    attDate: attDate,
                    punchIn: true,
                    punchOut: true,
                    punchOutTime: '0',
                    isDeleted: false,
                    totalHours: '0',
                    inAddress: '',
                    outAddress: '',
                    empId: employee._id,
                    punchInTime: '0',
                    history: [{
                        loc: { type: '', coordinates: [] },
                        outLoc: { type: '', coordinates: [] },
                        punchIn: true,
                        punchOut: true,
                        punchOutTime: '0',
                        punchInSelfi: '',
                        punchOutSelfi: '',
                        inAddress: '',
                        outAddress: '',
                        punchInTime: '0',
                    }],
                });
                await newAttendance.save();
            }
            return res.success(
                {},
                'Attendance processed successfully'
            );
    
        } catch (err) {
            return next(err);
        }
    }
    async attachment(req, res, next) {
        try {
            let attachment = {};
            let employee_id = req.user._id;
            let form = new multiparty.Form();
            let checkAttachment = await Attachment.findOne({ empId: ObjectId(employee_id) });
            if (checkAttachment) {
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        checkAttachment[key] = field[0];
                    });
                    try {
                        if (files && files.upload_path) {
                            let fileupload = files.upload_path;
                            let filePathArray = await Promise.all(
                                fileupload.map(async filePath => {
                                    let image = await uploadImage(filePath, 'image');
                                    return image.Key;
                                })
                            );
                            checkAttachment['upload_path'] = filePathArray;
                        }
                        checkAttachment['empId'] = employee_id;
                        await checkAttachment.save();
                        return res.success(
                            {
                                data: checkAttachment,
                            },
                            'Uploaded Attachment Successfully'
                        );
                    } catch (err) {
                        return next(err);
                    }
                });
            } else {
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        attachment[key] = field[0];
                    });
                    try {
                        if (files && files.upload_path) {
                            let fileupload = files.upload_path;
                            let filePathArray = await Promise.all(
                                fileupload.map(async filePath => {
                                    let image = await uploadImage(filePath, 'image');
                                    return image.Key;
                                })
                            );
                            attachment['upload_path'] = filePathArray;
                        }
                        attachment['empId'] = employee_id;
                        await new Attachment(attachment).save();
                        return res.success(
                            {
                                data: attachment,
                            },
                            'Uploaded Attachment Successfully'
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
    async employeeAttachmentList(req, res, next) {
        try {
            let empId = req.user._id;
            const employeeAttachment = await Attachment.find({ empId: ObjectId(empId) }).populate({
                path: 'empId',
                model: Employee,
                select: 'name',
            });
            if (employeeAttachment) {
                return res.success(
                    {
                        employeeAttachment,
                    },
                    'Find Document Successfully'
                );
            } else {
                return res.warn({}, 'Document not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async TimelineActivity(req, res, next) {
        try {
            let { empId } = req.query;
            let query = {};
            if (empId) {
                query = {
                    senderId: ObjectId(empId),
                };
            }
            const timeline = await LeadTimeline.find(query)
                .populate({ path: 'LeadId', model: Lead, select: 'name phone' })
                .populate({ path: 'senderId', model: Employee, select: 'name' })
                .populate({ path: 'remark', model: Remark, select: 'name' }).sort({created:-1});
            if (timeline) {
                return res.success(
                    {
                        timeline,
                    },
                    'Find Employee Timeline successfully'
                );
            } else {
                return res.warn({}, 'Employee Timeline not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async addHoliday(req, res, next) {
        try {
            let { startDate, endDate, occasion } = req.body;
            let startMoment = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Kolkata');
            let endMoment = moment.tz(endDate, 'YYYY-MM-DD', 'Asia/Kolkata');
            // Calculate the difference in days
            let daysDifference = endMoment.diff(startMoment, 'days');
            for (let i = 0; i <= daysDifference; i++) {
                let currentDate = startMoment.clone().add(i, 'days'); // Get the current date
                let attDate = currentDate.format('YYYYMMDD'); // Format the date
                let checkDay = await Calendar.findOne({ occasion, date_: attDate }); // Check if entry exists
                if (!checkDay) {
                    let calendar = {
                        date_: attDate,
                        occasion,
                    };
                    await new Calendar(calendar).save(); // Create entry
                } else {
                    // Entry already exists, do nothing
                    console.log(`Entry for ${occasion} on ${attDate} already exists.`);
                }
            }
            return res.success({}, 'Add Holiday(s) successfully');
        } catch (err) {
            return next(err);
        }
    }
    async CalendarList(req, res, next) {
        try {
            const calendar = await Calendar.find({});
            if (calendar) {
                return res.success(
                    {
                        calendar,
                    },
                    'Find Calendar Successfully'
                );
            } else {
                return res.warn({}, 'Data Not Found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async deleteHoliday(req, res, next) {
        try {
            const calendar = await Calendar.findByIdAndDelete(req.params.id);
            if (!calendar) {
                return res.warn({}, 'calendar not found');
            }
            return res.success({}, 'holiday deleted successfully');
        } catch (err) {
            return next(err);
        }
    }
    async leaveTypeDropdown(req, res, next) {
        try {
            let remark = ['Week off', 'Paid Leave', 'Unpaid Leave'];
            let type = ['Full Day', 'Half Day'];
            return res.success(
                {
                    remark,
                    type,
                },
                'Find Data Successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async leaveRequest(req, res, next) {
        try {
            let { empId, remark, type, startDate, endDate, description } = req.body;
            let Date_ = new Date();
            let projectDate = moment.tz(Date_, 'Asia/Kolkata');
            let formatProjectDate = projectDate.format('YYYYMMDDHHmm');
            function getDates(startDate, endDate, type) {
                const dateArray = [];
                let currentDate = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Kolkata');
                while (currentDate <= moment.tz(endDate, 'YYYY-MM-DD', 'Asia/Kolkata')) {
                    let dayType = type === 'Half Day' && dateArray.length === 0 ? 'Half Day' : 'Full Day';
                    dateArray.push({ date: currentDate.format('YYYYMMDD'), type: dayType, is_paid: true });
                    currentDate.add(1, 'days');
                }
                return dateArray;
            }
            const datesInRange = getDates(startDate, endDate, type);
            let leaveRequest = {
                employee_id: empId,
                remark: remark,
                description: description,
                dates: datesInRange,
            };
            let leaveData = await LeaveRequest(leaveRequest).save();

            let employeeDetails = await Employee.find({ _id: empId });
            let employeeName = employeeDetails.length > 0 ? employeeDetails[0].name ? employeeDetails[0].name : '' : "";
            let admin = await Employee.find({ role: 'Admin' });
            let adminDeviceToken = admin
            .map(admin => admin.deviceToken)
            .filter(deviceToken => deviceToken && deviceToken.length > 6);
            let notifications = adminDeviceToken.map(token => ({
                token,
                notification: {
                    title: `Leave application from ${employeeName}`,
                    body: '',
                },
                data: {
                    screen: 'home',
                    channel_name: 'RealEstate',
                    channel_id: 'RealEstateChannel',
                    title: 'Leave application',
                    type: 'Leave Application',
                    body: `remark :- ${remark}, description:-${description}`,
                    item_id: (Math.random() + 1).toString(36).substring(7),
                },
            }));
            
            for (const adminData of admin) {
                let addNotification = {
                    employee_id: adminData._id,
                    title: `Leave application from ${employeeName}`,
                    description: `Remark: ${remark}, Description: ${description}`,
                    type: 'Leave Application',
                    notificationTime: formatProjectDate,
                };
                await new Notification(addNotification).save();
            }

            for (const message of notifications) {
                try {
                    await sendNotifications({ message : message });
                } catch (err) {
                    console.error('Error sending notification:', err);
                }
            }
            
            let dayCount = datesInRange.reduce((total, day) => {
                return total + (day.type === 'Half Day' ? 0.5 : 1);
            }, 0);
            let startDay = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Kolkata');
            let endDay = moment.tz(endDate, 'YYYY-MM-DD', 'Asia/Kolkata');
            let formattedStartDay = startDay.format('DD-MM-YYYY');
            let formattedEndDay = endDay.format('DD-MM-YYYY');
                const msg = {
                    to: ['info@techniajz.com' , 'techniajz@gmail.com' , 'hr@techniajz.com'],
                    from: FROM_MAIL,
                    subject: 'Leave Request Notification for ' + employeeName,
                    text: `
                        Dear Admin,

                        This is to inform you that ${employeeName}, has submitted a leave request. Below are the details of the request:

                        Employee Name: ${employeeName}
                        Leave Type: ${type}
                        Leave Start Date: ${formattedStartDay}
                        Leave End Date: ${formattedEndDay}
                        Total Days: ${dayCount} day(s)
                        Reason for Leave: ${description}

                        Please take the necessary action to review and approve or reject this request at your earliest convenience.

                        Best regards,
                        Leave Management System
                    `,
                    html: `
                        <strong>Dear Admin,</strong><br><br>
                        This is to inform you that <strong>${employeeName}</strong>, has submitted a leave request. Below are the details of the request:<br><br>

                        <strong>Employee Name:</strong> ${employeeName}<br>
                        <strong>Leave Type:</strong> ${type}<br>
                        <strong>Leave Start Date:</strong> ${formattedStartDay}<br>
                        <strong>Leave End Date:</strong> ${formattedEndDay}<br>
                        <strong>Total Days:</strong> ${dayCount} day(s)<br>
                        <strong>Reason for Leave:</strong> ${description}<br><br>

                        Please take the necessary action to review and approve or reject this request at your earliest convenience.<br><br>

                        Best regards,<br>
                        <strong>Leave Management System</strong>
                    `,
                };
                sgMail
                    .sendMultiple(msg)
                    .then(() => {
                        console.log('Email sent');
                    })
                    .catch(error => {
                        console.error(error);
                    });
            return res.success(
                {
                    leaveData,
                },
                'Send leave request successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async leaveList(req, res, next) {
        try {
            let { empId, limit = 10, page = 1 } = req.query;
            limit = parseInt(limit, 10);
            page = parseInt(page, 10);

            let query = {};
            if (empId) {
                query = { employee_id: ObjectId(empId) };
            }

            const totalRecords = await LeaveRequest.countDocuments(query);
            const totalPages = Math.ceil(totalRecords / limit);
            const skip = (page - 1) * limit;

            let leaveRequests = await LeaveRequest.find(query)
                .populate({ path: 'employee_id', model: Employee, select: 'name profile_pitcture' })
                .sort({ created: -1 })
                .skip(skip)
                .limit(limit);

            if (leaveRequests) {
                leaveRequests = leaveRequests.map(request => {
                    let dayCount = 0;
                    if (request.dates && request.dates.length > 0) {
                        for(let day of request.dates){
                            if(day.type === 'Half Day'){
                                dayCount = dayCount + 0.5;
                            }else{
                                dayCount = dayCount + 1;
                            }
                        }
                    }
                    return {
                        ...request.toObject(),
                        dayCount: `${request.remark} ${dayCount} days`,
                    };
                });
            }
            return res.success(
                {
                    leaveRequests,
                    pagination: {
                        totalRecords,
                        totalPages,
                        currentPage: page,
                        limit,
                    },
                },
                'Find all leave requests successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async leaveStatus(req, res, next) {
        try {
            let Date_ = new Date();
            let projectDate = moment.tz(Date_, 'Asia/Kolkata');
            let formatProjectDate = projectDate.format('YYYYMMDDHHmm');
            let { leaveId } = req.params;
            let { status } = req.body;
            let checkLeaveRequest = await LeaveRequest.findOne({ _id: ObjectId(leaveId) });
            let notes = '';
            if (status === 'Approved') {
                notes = 'Your leave approved';
                if (checkLeaveRequest.dates.length > 0) {
                    for (const leaveEntry of checkLeaveRequest.dates) {
                        if (leaveEntry.type === 'Full Day') {
                            const attendanceData = {
                                attDate: leaveEntry.date,
                                empId: checkLeaveRequest.employee_id,
                                isLeave: true,
                                punchOutTime: 0,
                                punchInTime: 0
                            };

                            const empAttendance = new Attendance(attendanceData);
                            await empAttendance.save();
                        }
                    }
                }
            } else if (status === 'Rejected') {
                notes = 'Your leave was not approved';
            } else {
                notes = '';
            }
            if (checkLeaveRequest) {
                await LeaveRequest.updateOne(
                    { _id: ObjectId(leaveId) },
                    {
                        $set: {
                            status: status,
                            notes: notes,
                        },
                    }
                );
                const employeeId = checkLeaveRequest.employee_id ? checkLeaveRequest.employee_id :"";
                let employeeDetails = await Employee.findOne({ _id:employeeId ,isDeleted:false});
                let message = {
                    token: employeeDetails.deviceToken,
                    notification: {
                        title: 'Leave '+status,
                        body: notes,
                    },
                    data: {
                        screen: `home`,
                        channel_name: 'RealEstate',
                        channel_id: 'RealEstateChannel',
                        title: 'Leave '+status,
                        type: 'Leave Application',
                        body: notes,
                        item_id: (Math.random() + 1).toString(36).substring(7)
                    },
                };
                try {
                    await sendNotifications({message});
                } catch (err) {
                    console.error('Error sending notification:', err);
                }
                let addNotification = {
                    employee_id: employeeDetails._id,
                    title: 'Leave '+status,
                    description: notes,
                    type: 'Leave',
                    notificationTime: formatProjectDate
                };
                await new Notification(addNotification).save();

                return res.success({}, 'Status updated successfully');
            } else {
                return res.warn({}, 'Leave request not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async sendMessage(req, res, next) {
        try {
            let { receiverId, description } = req.body;
            let receiverUser = await Employee.findOne({ _id: receiverId });
            let senderUser = await Employee.findOne({ _id: req.user._id });
            let date = new Date();
            let msgDate = moment.tz(date, 'Asia/Kolkata');
            let msgFormatedate = msgDate.format('YYYYMMDD');
            let msgFormateTime = msgDate.format('HHmmss');
            let messageObj = {
                senderId: req.user._id,
                receiverId: receiverId,
                description: description,
                messageDate: msgFormatedate,
                messageTime: msgFormateTime,
            };
            let messageData = await Message(messageObj).save();
            let fcm = new FCM(serverKey);
            let message = {
                to: receiverUser.deviceToken,
                notification: {
                    title: senderUser.name,
                    body: description,
                },
                data: {
                    screen: `home`,
                    channel_name: 'RealEstate',
                    channel_id: 'RealEstateChannel',
                    type: "message",
                    title: senderUser.name,
                    reference_id: req.user._id,
                    body: description,
                    item_id: (Math.random() + 1).toString(36).substring(7)
                },
            };
            fcm.send(message, async function(err, response) {
                if (err) {
                    console.log(err);
                } else {
                }
            });
            return res.success(
                {
                    messageData,
                },
                'Message sent Successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async messageEmpList(req, res, next) {
        try {
            let employee = await Employee.aggregate([
                {
                    $match: {
                        _id: { $ne: req.user._id },
                    },
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: {
                            adminId: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            {
                                                $eq: ['$receiverId', '$$adminId'],
                                            },
                                            {
                                                $eq: ['$senderId', '$$adminId'],
                                            },
                                        ],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    messageDate: -1,
                                    messageTime: -1,
                                },
                            },
                            {
                                $limit: 1,
                            },
                        ],
                        as: 'messages',
                    },
                },
                {
                    $project: {
                        profile_pitcture: 1,
                        name: 1,
                        'messages.description': 1,
                        'messages.messageDate': 1,
                        'messages.messageTime': 1,
                        'messages.isRead': 1,
                    },
                },
                {
                    $addFields: {
                        latestMessage: { $arrayElemAt: ['$messages', 0] },
                    },
                },
                {
                    $sort: {
                        'latestMessage.messageDate': -1,
                        'latestMessage.messageTime': -1,
                    },
                },
                {
                    $unset: 'messages',
                },
            ]);
            let unReadMessage = await Employee.aggregate([
                {
                    $match: {
                        _id: { $ne: req.user._id },
                    },
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: {
                            adminId: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$receiverId', req.user._id] },
                                            { $eq: ['$senderId', '$$adminId'] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'messages',
                    },
                },
                {
                    $unwind: '$messages',
                },
                {
                    $match: {
                        'messages.isRead': false,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        messages: { $push: '$messages' },
                        unreadCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        messages: 1,
                        unreadCount: 1,
                    },
                },
            ]);
            const unreadCountMap = new Map(unReadMessage.map(item => [item._id.toString(), item.unreadCount]));
            employee.forEach(emp => {
                const empId = emp._id.toString();
                if (unreadCountMap.has(empId)) {
                    emp.unreadCount = unreadCountMap.get(empId);
                } else {
                    emp.unreadCount = 0;
                }
            });
            return res.success({
                employee,
            });
        } catch (err) {
            return next(err);
        }
    }
    async messageList(req, res, next) {
        try {
            const { empId } = req.query;
            const loggedInUserId = req.user._id;

            const chatList = await Message.find({
                $or: [
                    {
                        $and: [{ senderId: ObjectId(loggedInUserId) }, { receiverId: ObjectId(empId) }],
                    },
                    {
                        $and: [{ senderId: ObjectId(empId) }, { receiverId: ObjectId(loggedInUserId) }],
                    },
                ],
            })
                .populate({ path: 'senderId', model: Employee, select: 'profile_pitcture name' })
                .populate({ path: 'receiverId', model: Employee, select: 'profile_pitcture name' });

            if (chatList) {
                return res.success(
                    {
                        chatList,
                    },
                    'Find message history successfully'
                );
            } else {
                return res.warn({}, 'Message not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async updateMessageStatus(req, res, next) {
        try {
            let { empId } = req.query;
            await Message.updateMany(
                { $and: [{ senderId: ObjectId(empId) }, { receiverId: ObjectId(req.user._id) }] },
                {
                    $set: {
                        isRead: true,
                    },
                }
            );
            return res.success({}, 'Message read successfully');
        } catch (err) {
            return next(err);
        }
    }
    async admin_And_HR(req, res, next) {
        try {
            const designations = await Designation.find({ name: { $in: ['HR', 'Admin'] } });
            let designationsArray = designations.map(i => i._id);
            const emp_hr = await Employee.find({ designationId: { $in: designationsArray } }).select(
                'name profile_pitcture role'
            );
            return res.success(
                {
                    emp_hr,
                },
                'Find Employee and HR successfully'
            );
        } catch (err) {
            return next(err);
        }
    }
    async locationTruck(req, res, next) {
        try {
            let { empId, lat, long } = req.body;
            let Date_ = new Date();
            let truckDateTime = moment.tz(Date_, 'Asia/Kolkata');
            let formatTruckDateTime = truckDateTime.format('YYYYMMDDHHmm');
            let DateTime = truckDateTime.format('YYYYMMDD');
            let employee = await Employee.findOne({ _id: ObjectId(empId) });
            let checkTodayAtt = await Attendance.findOne({ empId: ObjectId(empId), attDate: DateTime });

            if (
                employee.status == true &&
                employee.isDeleted == false &&
                checkTodayAtt.punchIn == true &&
                checkTodayAtt.punchOut == false
            ) {
                let location = [];
                if (lat && long) {
                    location.push(lat);
                    location.push(long);
                }
                let locationTruck = {
                    'loc.coordinates': location,
                    empId: empId,
                    truckTime: formatTruckDateTime,
                };
                let locationData = await new LocationTruck(locationTruck).save();
                await Employee.updateOne(
                    { _id: ObjectId(empId) },
                    {
                        $set: {
                            isActivity: true,
                        },
                    }
                );
                return res.success(
                    {
                        locationData,
                    },
                    'Update location successfully'
                );
            } else {
                return res.warn({}, 'employee is not active');
            }
        } catch (err) {
            return next(err);
        }
    }
    async notification(req, res, next) {
        try {
            let notification = await Notification.find({ employee_id: req.user._id })
                .populate({
                    path: 'employee_id',
                    model: Employee,
                    select: 'name profile_pitcture',
                })
                .sort({ created: -1 });
            let Date_ = new Date();
            let notification_read_time = moment.tz(Date_, 'Asia/Kolkata');
            let formatNotification_read_time = notification_read_time.format('YYYYMMDDHHmm');
            await Employee.updateOne(
                { _id: req.user._id },
                {
                    $set: {
                        notification_read_time: formatNotification_read_time,
                    },
                }
            );
            if (notification) {
                return res.success(
                    {
                        notification,
                    },
                    'find all notification successfully'
                );
            } else {
                return res.warn({}, 'notification was not found');
            }
        } catch (err) {
            return next(err);
        }
    }
    async unreadNotifications(req, res, next) {
        try {
            let unreadCount = 0;
            let checkEmployeeNotTime = await Employee.findOne({ _id: req.user._id }).select('notification_read_time');
            let unreadNotification = await Notification.find({ employee_id: req.user._id });
            async
                .mapSeries(unreadNotification, async unRead => {
                    if (checkEmployeeNotTime.notification_read_time < unRead.notificationTime) {
                        if (unRead) {
                            unreadCount += 1;
                        }
                    }
                })
                .then(() => {
                    return res.success(
                        {
                            unreadCount,
                        },
                        'find un-read notification count successfully'
                    );
                });
        } catch (err) {
            return next(err);
        }
    }
    async appVersion(req, res, next) {
        try {
            const forceUpdate = await AdminSetting.findOne({});
            if (forceUpdate) {
                return res.success(
                    {
                        forceUpdate,
                    },
                    'find app data successfully'
                );
            }
        } catch (err) {
            return next(err);
        }
    }

    // Expensens
    createExpenses = async (req, res, next) => {
        try {
            let userId = req.user._id;
            let expense = {};
            let form = new multiparty.Form();
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    return res.warn({}, 'Error parsing form data');
                }
                _.forOwn(fields, async (field, key) => {
                    expense[key] = field[0];
                });
                try {
                    if (typeof files.billImage !== 'undefined') {
                        let fileupload = files.billImage[0];
                        let image = await uploadImage(fileupload, 'image');
                        expense['billImage'] = image.Key;
                    }

                    if (expense.type !== 'officeExpense' && expense.type !== "others") {
                        let permissions = req.user && req.user.permission ? req.user.permission : {};
                        let isPermission = checkPermission('expenses', permissions);
                        if (!isPermission) {
                            return res.invalidAccess(null, req.__('INVALID_PERMISSION'));
                        }
                    }
                    expense.createdBy = userId;

                    let expenseData = await new Expense(expense).save();
                    return res.success(
                        {
                            expense: expenseData,
                        },
                        'Expense created successfully'
                    );
                } catch (err) {
                    return next(err);
                }
            });
        } catch (err) {
            return next(err);
        }
    }

    updateExpenses = async (req, res, next) => {
       
        let form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            if (err) return next(err);

            let expenseUpdates = {};
            _.forOwn(fields, (field, key) => {
                expenseUpdates[key] = field[0];
            });

            try {
                if (files.image) {
                    let fileupload = files.image[0];
                    let image = await uploadImage(fileupload, 'image');
                    expenseUpdates.image = image.Key;
                }

                let updatedExpense = await Expense.findByIdAndUpdate(
                    req.params.expenseId,
                    { $set: expenseUpdates },
                    { new: true }
                );

                if (!updatedExpense) {
                    return res.warn({}, 'Expense Not Found');
                }

                return res.success(
                    {
                        updatedExpense
                    },
                    'Expense updated successfully'
                )
            } catch (err) {
                return next(err);
            }
        });
    };

    deleteExpenseById = async (req, res, next) => {
        try {
            const expense = await Expense.findByIdAndDelete(req.params.expenseId);
            if (!expense) {
                return res.warn({}, 'Expense not found');
            }
            return res.success({}, 'Expense deleted successfully');
        } catch (err) {
            return next(err);
        }
    };

    fetchAllExpense = async (req, res, next) => {
        try {
            let startDate = req.query.start_date;
            let endDate = req.query.end_date;
           
            const { type, modeOfPayment, paidBy, limit, pageNo, status } = req.query;
            const setLimit = limit != undefined ? parseInt(limit) : 50;
            const offsetpaginate = pageNo > 0 ? (parseInt(pageNo) - 1) * setLimit : 0;

            let matchPattern = {};
            if (startDate && endDate) {
                matchPattern.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            if (type) matchPattern.type = type;
            if (modeOfPayment) matchPattern.modeOfPayment = modeOfPayment;
            if (paidBy) matchPattern.paidBy = ObjectId(paidBy);
            

            let query = [
                { $match: matchPattern },
                {
                    $lookup: {
                        from: "employees",
                        localField: "empId",
                        foreignField: "_id",
                        as: "employee"
                    }
                },
                {
                    $lookup: {
                        from: "employees",
                        localField: "paidBy",
                        foreignField: "_id",
                        as: "paidByEmp",
                        pipeline: [{ $project: { name: 1, _id: 1 } }],
                    }
                },
                {
                    $unwind: {
                        path: "$paidByEmp",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$employee",
                        preserveNullAndEmptyArrays: true
                    }
                },
            ];
            // query.push({ $match: matchPattern });

            let countQuery = [...query];
            countQuery.push({
                $count: "totalRecords"
            });

            let expense = await Expense.aggregate(query)
                .sort({ date: -1 })
                .skip(offsetpaginate)
                .limit(setLimit);
            let countResult = await Expense.aggregate(countQuery);

            if (expense) {
                return res.success(
                    {
                        expense,
                        total: countResult.length > 0 ? countResult[0].totalRecords : 0
                    },
                    'Find All Expences Successfully'
                );
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    };


    getExpenseById = async (req, res, next) => {
        try {
            const expense = await Expense.findById(req.params.expenseId)
            .populate({
                path: 'paidBy',
                model: Employee,
                select: 'name _id'
            });

            return res.success(
                {
                    expense,
                },
                'expense fetched successfully'
            );
        } catch (err) {
            return next(err);
        }
    };

    exportExpense = async (req, res, next) => {
        try {
            let startDate = req.query.start_date;
            let endDate = req.query.end_date;
           
            const { type, modeOfPayment, paidTo } = req.query;

            let matchPattern = {};
            if (startDate && endDate) {
                matchPattern.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }
            if (type) matchPattern.type = type;
            if (modeOfPayment) matchPattern.modeOfPayment = modeOfPayment;
            if (paidTo) matchPattern.paidTo = paidTo;

            let query = [];
            query.push({ $match: matchPattern });
            query.push(
                { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'paidBy',
                        foreignField: '_id',
                        as: 'paidBy'
                    }
                },
                { $unwind: { path: '$paidBy', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        type: 1,
                        amountPaid: 1,
                        modeOfPayment: 1,
                        particulars: 1,
                        paidBy: '$paidBy.name',
                        details: 1,
                        chequeNumber: 1,
                        billImage: 1,
                        remark: 1,
                        date: 1
                    }
                },
                { $sort: { date: -1 } },
            )

            let expense = await Expense.aggregate(query);

            if (expense && expense.length > 0) {
                let maapedData = [];
                expense.forEach(item => {
                    maapedData.push({
                        date: item.date ? moment(item.date).format('YYYY-MM-DD') : "",
                        type: item.type ? item.type : "",
                        modeOfPayment: item.modeOfPayment ? item.modeOfPayment : "",
                        particulars: item.particulars ? item.particulars : "",
                        paidBy: item.paidBy ? item.paidBy : "",
                        amountPaid: item.amountPaid ? item.amountPaid : "",
                        chequeNumber: item.chequeNumber ? item.chequeNumber : "",
                        remark: item.remark ? item.remark : "",
                    })

                })
                let csvRespone = await convertJsonToCsv(maapedData);
                let fileNamePayload = {
                    fileKeyName: 'expenseList',
                    startDate,
                    endDate
                };
                let filename = createFileNameFromDate(fileNamePayload);
                res.attachment(filename);
                res.status(200).send(csvRespone);
            }else{
                return next({ message: req.__('Export data was not found.') });
            }
        } catch (err) {
            return next(err);
        }
    };

    fetchExpenseByEmpId = async (req, res, next) => {
        try {
            const expense = await Expense.find({ empId: req.params.empId });
            return res.success(
                {
                    expense,
                },
                'vendors fetched successfully'
            );
        } catch (err) {
            return next(err);
        }
    };
}

module.exports = new EmployeeController();
