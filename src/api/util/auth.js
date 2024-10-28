const jwt = require('jsonwebtoken');
const {
    models: { User,Admin, Vendor, Employee },
} = require('../../../lib/models');

const { getPlatform } = require('./common');

const signToken = (user) => {
    const payload = {
        sub: user._id,
        email: user.email,
        iat: user.authTokenIssuedAt,
        role: user.role
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
};

const signTempToken = (user) => {
    const payload = {
        id: user._id,
    };
    return jwt.sign(payload, process.env.JWT_SECRET_TEMP);
};

const verifyToken = (req, res, next) => {
    jwt.verify(req.headers['authorization'], process.env.JWT_SECRET, async (err, decoded) => {
        if (err || !decoded || !decoded.sub) {
            return res.unauthorized(null, req.__('UNAUTHORIZED'));
        }
        const user = await Employee.findOne({
            _id: decoded.sub,
            //isDeleted: false,
          authTokenIssuedAt: decoded.iat
        });
        const admin = await Admin.findOne({
            _id: decoded.sub,
           // isDeleted: false,
            authTokenIssuedAt: decoded.iat,
        });
        if (!user && !admin) {
            return res.unauthorized(null, req.__('UNAUTHORIZED'));
        }
        req.user = admin;
        res.user = admin;
        req.user = user;
        next();
    });
}




module.exports = {
    signToken,
    signTempToken,
    verifyToken
};
