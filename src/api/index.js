// require('custom-env').env('api');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const { Response } = require('../../lib/http-response');
const mongoose = require('mongoose');
const { Joi, validate } = require('./util/validations');
const { __, languages } = require('./i18n');
const {
    enums: { Platform },
    models: {  Employee,LocationTruck,Notification },
} = require('../../lib/models');
const flash = require('connect-flash');
const serverKey = process.env.SERVER_KEY;
const moment = require('moment');
const FCM = require('fcm-node');
const BASE_URL = process.env.BASE_URL;
const request = require('request');
const CronJob = require('cron').CronJob;
const mongoURI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    serverSelectionTimeoutMS: 30000 // 30 seconds
};

async function connectToMongo() {
    try {
        mongoose.connect(mongoURI, options);
        console.log('Connected to MongoDB using Mongoose');
    } catch (error) {
        console.error('Mongoose connection error:', error);
        
        if (error.name === 'MongoTimeoutError') {
            console.log('MongoTimeoutError detected, exiting process...');
            process.exit(1);
        }
    }
}

mongoose.connection.on('error', (error) => {
    console.error('Mongoose client error:', error);

    if (error.name === 'MongoTimeoutError') {
        console.log('MongoTimeoutError detected, exiting process...');
        process.exit(1);
    }
});

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.set('debug', process.env.NODE_ENV === 'development');
connectToMongo();

global.ObjectId = mongoose.Types.ObjectId;
app.use(cors());
app.use(require('compression')());
const path = require('path');
const engine = require('ejs-locals');
app.use(express.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
if (process.env.NODE_ENV === 'development') {
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./docs/swagger.json');
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'static')));
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            customfavIcon: '/fav32.png',
            customSiteTitle: 'Real Estate',
            authorizeBtn: false,
            swaggerOptions: {
                filter: true,
                displayRequestDuration: true,
            },
        })
    );
}

const LeadController = require('./routes/Lead/LeadController');

//set cron for notifications
async function sendNotify_location_not_Truck() {
    console.log('Running your task every minute');
    let admin = await Employee.find({ role: 'Admin' });
    let adminDeviceToken = admin.map(i => i.deviceToken);
    let employees = await Employee.find({isActivity: true});
    employees.forEach(async employee => {
        let locationTruck = await LocationTruck.find({ empId: ObjectId(employee._id) }).sort({_id:-1}).limit(1);
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
            //check employee
            if (employee.isActivity == true) {
                if (timeDifferenceInMinutes > 30) {
                    let fcm = new FCM(serverKey);
                    let message = {
                        registration_ids: adminDeviceToken,
                        notification: {
                            title: `${employee.name} is not trackable at the moment`,
                            body: `${employee.name} is not trackable at the moment`,
                        },
                        data: {
                            screen: `home`,
                            channel_name: 'RealEstate',
                            channel_id: 'RealEstateChannel',
                            title: `${employee.name} executive is not trackable at the moment`,
                            body: `${employee.name} executive is not trackable at the moment`,
                            item_id: (Math.random() + 1).toString(36).substring(7)
                        },
                    };
                    fcm.send(message, async function(err, response) {
                        // if (err) {
                        //     console.log(err);
                        // } else {
                        console.log('----ok----');
                        for (const adminData of admin) {
                            let addNotification = {
                                employee_id: adminData._id,
                                title: message.notification.title,
                                description: message.notification.body,
                                type: 'location',
                            };
                            await new Notification(addNotification).save();
                        }
                        await Employee.updateOne(
                            { _id: ObjectId(employee._id) },
                            {
                                $set: {
                                    isActivity: false,
                                },
                            }
                        );
                        // }
                    });
                }
            }
        }
    });
}

async function addLead_Time_Line(){
  await LeadController.sendLeadNotification();
}
async function RUN_CRM_API(){
    await LeadController.crmIntegration();
}

async function SEND_HOLIDAY_NOTIFICATION(){
    await LeadController.findTodayHoliday();
}

const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

const addLeadTimeLineTask = new CronJob('*/1 * * * *', addLead_Time_Line, null, true, 'Asia/Kolkata');
addLeadTimeLineTask.start();

const crmApi = new CronJob('*/1 * * * *', RUN_CRM_API, null, true, 'Asia/Kolkata');
crmApi.start();

const task = new CronJob('*/1 * * * *', sendNotify_location_not_Truck, null, true, 'Asia/Kolkata');
task.start();

const holidayNotification = new CronJob('30 15 * * 5', SEND_HOLIDAY_NOTIFICATION, null, true, 'Asia/Kolkata');
holidayNotification.start();

// Create a Cron job to run at 11:59 PM on the last day of the current month
const salaryData = new CronJob(`50 23 ${lastDay} * *`, calculateSalary, null, true, 'Asia/Kolkata');
salaryData.start();

//------------------------------------------------------------------------------
var _request = async value =>
    new Promise((resolve, reject) => {
        request(value, (error, response, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
async function calculateSalary() {
    let currentDate = new Date();
    let dateMoment = moment.tz(currentDate, 'Asia/Kolkata');
    let year = dateMoment.format('YYYY');
    let month = dateMoment.format('MM');
    console.log('Running your task on the last day of the current month at 11:59 PM');
    let employee = await Employee.find({isDeleted:false,status:true});
    employee.forEach(async (emp)=>{
        const result = await _request({
            method: 'get',
            uri: `salary/calculateSalary?year=${year}&month=${month}&empId=${emp._id}`,
            baseUrl: BASE_URL,
            json: true,
            headers: {},
        });
        //console.log(result)
    })
}
//------------------------------------------------------------------------------

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(204).send('OK');
    }
    next();
});

app.use((req, res, next) => {
    req.__ = __;
    for (const method in Response) {
        if (Response.hasOwnProperty(method)) res[method] = Response[method];
    }
    next();
});

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const headerValidations = Joi.object()
    .keys({
        'x-hrms-version': Joi.string()
            .regex(/^[\d]+\.[\d]+\.[\d]+$/, 'Semantic Version')
            .required(),
        'accept-language': Joi.string()
            .valid(...Object.keys(languages))
            .required(),
    })
    .required();

app.use((req, res, next) => {
    let x = req.url.split('/');
    if (x && x[1] == 'authpage') {
        //req.__ = 'en';
        res.locals.siteUrl = `${req.protocol}://${req.get('host')}`;
        res.locals.siteTitle = process.env.SITE_TITLE;
        res.locals.DM = __;
        res.locals.s3Base = process.env.AWS_S3_BASE;
        return next();
    } else {
        //validate(headerValidations, 'headers', {allowUnknown: true})(req, res, next);
        return next();
    }
});

app.use('/', require('./routes'));
app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    // console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.message === 'EntityNotFound') {
        return res.notFound('', req.__('NOT_FOUND'));
    }

    return res.status(err.status || 500).send({
        success: false,
        data: [],
        message: req.__('GENERAL_ERROR'),
    });
});

app.use(function(req, res) {
    return res.status(404).send({
        success: false,
        data: [],
        message: req.__('NOT_FOUND_ERR'),
    });
});


/***
    update working today true on 24:00
*/

const port = process.env.PORT || 3001;
let server;
if (process.env.SERVER_MODE === 'https') {
    const https = require('https');
    const fs = require('fs');
    const privateKey = fs.readFileSync('./ssl_keys/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('./ssl_keys/cert.pem', 'utf8');
    const ca = fs.readFileSync('./ssl_keys/chain.pem', 'utf8');
    var credentials = { key: privateKey, cert: certificate, ca: ca };
    server = https.createServer(credentials, app);
} else {
    const http = require('http');
    server = http.createServer(app);
}

server.listen(port, function() {
    // eslint-disable-next-line no-console
    console.info(`Server Started on port ${port}`);
});
