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

const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

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
