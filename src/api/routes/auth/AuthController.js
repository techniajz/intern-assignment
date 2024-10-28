const {
    models: { Employee,Designation,Remark,AdminSetting },
} = require('../../../../lib/models');

const { signToken } = require('../../util/auth');
const { utcDateTime, generateCode, randomString } = require('../../../../lib/util');
const { uploadImage } = require('../../../../lib/util');
var _ = require('lodash');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_MAIL = process.env.FROM_MAIL;
const multiparty = require('multiparty');
const {AWS_BASE_URL,BASE_URL} = process.env;

class AuthController {
    async logIn(req, res, next) {
        try {
            let { mobile, empId, deviceToken, deviceType, deviceId } = req.body;
            let userr = await Employee.findOne({
                $or: [
                    { $and: [{ status: true }, { mobile: mobile }, { isDeleted: false }] },
                    { $and: [{ status: true }, { id: empId }] },
                ],
            }).populate({
                path: 'designationId',
                model: Designation,
                select: 'name',
            });
            if (!userr) {
                return res.warn({}, req.__('USER_NOT_REGISTER'));
            }
            if (userr && userr.designationId.name == 'Executive') {
                if (userr.isDeleted === true) {
                    return res.warn({}, req.__('Your account has been deleted'));
                }
                if (userr.adminApproved === false) {
                    return res.warn({}, req.__('USER_NOT_APPROV'));
                }
                let otp = generateCode();
                userr.otp = otp;
                userr.authTokenIssuedAt = utcDateTime().valueOf();
                userr.deviceToken = deviceToken;
                userr.deviceType = deviceType;
                let resetToken = randomString(10);
                userr.resetToken = resetToken;
                let deviceArr = userr.deviceId;
                let newDevice = 'no';
                if (deviceArr.indexOf(deviceId) !== -1) {
                    newDevice = 'no';
                } else {
                    userr.deviceId.push(deviceId);
                    newDevice = 'yes';
                }
                await userr.save();
                const userJson = userr.toJSON();
                ['password', 'authTokenIssuedAt', 'otp', 'emailToken', '__v'].forEach(key => delete userJson[key]);
                return res.success(
                    {
                        verifyToken: resetToken,
                        role: userr.role,
                        mobile: userr.mobile,
                        employ: userr.id,
                    },
                    req.__('OTP_VERIFY_TO_LOGIN')
                );
            } else if (userr && (userr.designationId.name === 'Admin' || userr.designationId.name === 'HR')) {
                userr.authTokenIssuedAt = utcDateTime().valueOf();
                userr.deviceToken = deviceToken;
                userr.deviceType = deviceType;
                let resetToken = randomString(10);
                userr.resetToken = resetToken;
                let deviceArr = userr.deviceId;
                let newDevice = 'no';
                if (deviceArr.indexOf(deviceId) !== -1) {
                    newDevice = 'no';
                } else {
                    userr.deviceId.push(deviceId);
                    newDevice = 'yes';
                }
                await userr.save();
                const userJson = userr.toJSON();
                ['password', 'authTokenIssuedAt', 'otp', 'emailToken', '__v'].forEach(key => delete userJson[key]);
                return res.success(
                    {
                        verifyToken: resetToken,
                        role: userr.role,
                        mobile: userr.mobile,
                    },
                    req.__('ENTER_PASSWORD_TO_LOGIN')
                );
            } else {
                return res.warn({}, req.__('USER_DOES_NOT'));
            }
        } catch (err) {
            return next(err);
        }
    }
    async logInWeb(req, res, next) {
        try {
            let { email, empId, deviceToken, deviceType, deviceId, password } = req.body;
            let userr = await Employee.findOne({
                $or: [
                    { $and: [{ status: true }, { mobile: String(email) }, { isDeleted: false }] },
                    { $and: [{ status: true }, { email: String(email) }, { isDeleted: false }] },
                    { $and: [{ status: true }, { id: empId }] },
                ],
            }).populate({
                path: 'designationId',
                model: Designation,
                select: 'name',
            });
            if (!userr) {
                return res.warn({}, req.__('USER_NOT_REGISTER'));
            }
            const isPasswordMatch = await userr.comparePassword(password);
            if(!isPasswordMatch){
                return res.warn({}, req.__('Please enter correct password'));
            }
            if (userr && userr.designationId.name == 'Executive') {
                if (userr.isDeleted === true) {
                    return res.warn({}, req.__('Your account has been deleted'));
                }
                if (userr.adminApproved === false) {
                    return res.warn({}, req.__('USER_NOT_APPROV'));
                }
               
                userr.authTokenIssuedAt = utcDateTime().valueOf();
                userr.deviceToken = deviceToken;
                userr.deviceType = deviceType;
                let resetToken = randomString(10);
                userr.resetToken = resetToken;
                let deviceArr = userr.deviceId;
                let newDevice = 'no';
                if (deviceArr.indexOf(deviceId) !== -1) {
                    newDevice = 'no';
                } else {
                    userr.deviceId.push(deviceId);
                    newDevice = 'yes';
                }
                if (isPasswordMatch) {
                    const jwttoken = signToken(userr);
                    await userr.save();
                    const userJson = userr.toJSON();
                    return res.success(
                        {
                            jwt: jwttoken,
                            token: resetToken,
                            user: userJson,
                        },
                        req.__('Login successfully')
                    );
                }
            } else if (userr && (userr.designationId.name === 'Admin' || userr.designationId.name === 'HR')) {
                userr.authTokenIssuedAt = utcDateTime().valueOf();
                userr.deviceToken = deviceToken;
                userr.deviceType = deviceType;
                let resetToken = randomString(10);
                userr.resetToken = resetToken;
                let deviceArr = userr.deviceId;
                let newDevice = 'no';
                if (deviceArr.indexOf(deviceId) !== -1) {
                    newDevice = 'no';
                } else {
                    userr.deviceId.push(deviceId);
                    newDevice = 'yes';
                }
                if (isPasswordMatch) {
                    const jwttoken = signToken(userr);
                    await userr.save();
                    const userJson = userr.toJSON();
                    return res.success(
                        {
                            jwt: jwttoken,
                            token: resetToken,
                            user: userJson,
                        },
                        req.__('Login successfully')
                    );
                }
            } else {
                return res.warn({}, req.__('USER_DOES_NOT'));
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            let { mobile, empId, password, otp, resetToken } = req.body;
            var users = await Employee.findOne({ $or: [{ mobile }, { id: empId }] }).populate({
                path: 'designationId',
                model: Designation,
                select: 'name',
            });
            if (users && (users.designationId.name === 'Admin' || users.designationId.name === 'HR')) {
                const passwordMatched = await users.comparePassword(password);
                if (!passwordMatched) {
                    return res.warn({}, req.__('INCORRECT_EMAIL_PASSWORDS'));
                }
                if (passwordMatched) {
                    if (users.emailToken == resetToken || users.resetToken == resetToken) {
                        const jwttoken = signToken(users);
                        const userJson = users.toJSON();
                        return res.success(
                            {
                                jwt: jwttoken,
                                token: resetToken,
                                user: userJson,
                            },
                            req.__('Login successfully')
                        );
                    }
                }
            }
            if (users && users.designationId.name == 'Executive') {
                if (users.otp == otp) {
                    if (users.emailToken == resetToken || users.resetToken == resetToken) {
                        users.mobileVerify = true;
                    }
                    let newUser = await users.save();
                    const jwttoken = signToken(users);
                    const userJson = users.toJSON();
                    return res.success(
                        {
                            _id: newUser._id,
                            emailVerified: newUser.emailVerify,
                            jwt: jwttoken,
                            token: resetToken,
                            user: userJson,
                        },
                        req.__('OTP_VERIFY_SUCCESS')
                    );
                } else {
                    return res.warn('', req.__('INVALID_OTP'));
                }
            } else {
                return res.warn({}, req.__('USER_DOES_NOT'));
            }
        } catch (err) {
            return next(err);
        }
    }
    async forgotPassword(req, res, next) {
        let { email } = req.body;
        try {
            let user;
            user = await Employee.findOne({
                email,
            });
            if (!user) {
                return res.warn('', req.__('EMAIL_NOT_REGISTER'));
            }
            if (user) {
                //generated unique token and save in user table and send reset link
                let resetToken = randomString(10);
                let otp = generateCode();
                user.otp = otp;
                user.resetToken = resetToken;
                user.emailVerify = false;
                user.authTokenIssuedAt = utcDateTime().valueOf();
                await user.save();
                if (user.email != '') {
                    let emailToSend = user.email;
                    const msg = {
                        to: emailToSend,
                        from: FROM_MAIL,
                        subject: 'Real Estate: Forgot Password OTP',
                        text: 'Please enter the following OTP to reset your password : ' + user.otp,
                        html:
                            '<strong>Please enter the following OTP to reset your password :' + user.otp + ' </strong>',
                    };
                    //Send Email Here
                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log('Email sent');
                            return res.success(
                                {
                                    token: resetToken,
                                },
                                req.__('OTP_SEND_TO_CHANGE_PASSWORD')
                            );
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            } else {
                return res.warn('', req.__('EMAIL_NOT_REGISTER'));
            }
        } catch (err) {
            return next(err);
        }
    }
    async forgotPasswordVerify(req, res, next) {
        try {
            let { email, resetToken, otp } = req.body;
            var users = await Employee.findOne({ email });
            if (users) {
                if (users.otp == otp) {
                    if (users.emailToken == resetToken || users.resetToken == resetToken) {
                        users.emailVerify = true;
                    }
                    await users.save();
                    return res.success(
                        {
                            token: users.resetToken,
                        },
                        req.__('OTP_VERIFY_SUCCESS')
                    );
                } else {
                    return res.warn('', req.__('INVALID_OTP'));
                }
            } else {
                return res.warn({}, req.__('USER_DOES_NOT'));
            }
        } catch (err) {
            return next(err);
        }
    }
    async resetPassword(req, res, next) {
        let { password, email } = req.body;
        try {
            const user = await Employee.findOne({
                email,
            });
            if (!user) {
                return res.unauthorized(null, req.__('UNAUTHORIZED'));
            }
            if (user) {
                user.password = password;
                await user.save();
                return res.success('', req.__('PASSWORD_CHANGED'));
            } else {
                return res.warn('', req.__('GENERAL_ERROR'));
            }
        } catch (err) {
            return next(err);
        }
    }
    async resendOtp(req, res, next) {
        let { token } = req.body;
        if (req.body.mobile) {
            let mobile = req.body.mobile;
            var user = await Employee.findOne({
                mobile,
                status: true,
            });
        }
        try {
            if (!user) {
                return res.unauthorized(null, req.__('UNAUTHORIZED'));
            }
            if (user) {
                if (req.body.mobile) {
                    let otp = generateCode();
                    user.otp = otp;
                    user.mobileVerify = false;
                    let newUser = await user.save();
                    let forgotToken = newUser.resetToken;
                    if (token == forgotToken) {
                        if (newUser.mobile != '') {
                            return res.success({}, `Please enter the following OTP to reset your password : 1234`);
                        }
                    }
                }
            } else {
                return res.warn('', req.__('GENERAL_ERROR'));
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
    async logOut(req, res) {
        const { user } = req;
        user.authTokenIssuedAt = null;
        user.deviceToken = null;
        await user.save();
        return res.success('', req.__('LOGOUT_SUCCESS'));
    }
    async editProfile(req, res, next) {
        try {
            let employeeId = req.user._id;
            let employeeDB = await Employee.findOne({ _id: ObjectId(employeeId) });
            let employee = {};
            if (employeeDB) {
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        if(key != 'password')
                        employee[key] = field[0];
                    });
                    try {
                        if (typeof files.image !== 'undefined') {
                            let fileupload = files.image[0];
                            let image = await uploadImage(fileupload, 'image');
                            employee['profile_pitcture'] = image.Key;
                        }
                        console.log(employee, 'updated form'); 
                        if(employee['emergency_contact'] == null) employee['emergency_contact'] = {};
                        employee['emergency_contact']['mobile'] = fields.emergencyNumber[0];
                        delete employee['password'];
                        console.log(employee); 
                        await Employee.updateMany(
                            { _id: employeeDB._id },
                            {
                                $set: employee,
                            }
                        );
                        //await new Employee(employee).save();
                        return res.success(
                            {
                                data: employee,
                            },
                            'Updated Profile Successfully'
                        );
                    } catch (err) {
                        console.log(err);
                        return next(err);
                    }
                });
            } else {
                return res.warn({}, 'Employee Not Found');
            }
        } catch (err) {
            console.log(err,"23434");
            return next(err);
        }
    }
    async healthCheck(req, res, next) {
        return res.success(
            {
                data: [],
            },
            'Updated Profile Successfully'
        );
    }
    async testing(req, res, next) {
        try {
            let obj = {
                name: 'Revisit with time',
                isActive: true,
                isDeleted: false,
            };
            await new Remark(obj).save();
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
    async upload_new_build(req, res, next) {
        try {
            let adminSetting = await AdminSetting.findOne({});
            if (adminSetting) {
                let form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    _.forOwn(fields, (field, key) => {
                        adminSetting[key] = field[0];
                    });
                    try {
                        if (typeof files.file_ !== 'undefined') {
                            let fileupload = files.file_[0];
                            let image = await uploadImage(fileupload, 'file');
                            adminSetting['file_'] = image.Key;
                        }
                        await adminSetting.save();
                        return res.success(
                            {
                                data: adminSetting,
                            },
                            'Updated New Build Successfully'
                        );
                    } catch (err) {
                        console.log(err);
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
    async download_real_rstate(req, res, next) {
        try {
            let adminSetting = await AdminSetting.findOne({});
            let downloadBuild = `${AWS_BASE_URL}${adminSetting.file_}`;
            res.render('download_build_page', { BASE_URL, AWS_BASE_URL, adminSetting, downloadBuild });
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new AuthController();
