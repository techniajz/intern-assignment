const { Joi, common } = require('../../util/validations');

const logIn = Joi.object().keys({
    email: Joi.string(),
    empId:Joi.number(),
    password: Joi.string(),
    mobile: Joi.number(),
    deviceToken: Joi.string().trim().optional().allow(''),
    deviceId: Joi.string().trim().optional().allow(''),
    deviceType: Joi.string().trim().optional().allow(''),
    
    //role : Joi.string().trim().required()
});
const signup = Joi.object().keys({
    email: Joi.string(),
    displayName:Joi.string(),
    user_name:Joi.string().alphanum().min(3).max(30).required().error(() => {
        return {
          message: 'User name must only contain alpha-numeric characters',
        };
      }),
    password: Joi.string(),
    user_type:Joi.string(),
    mobile:Joi.string().min(10).max(15),
    referred_by:Joi.string(),
    confirm_password:Joi.string(),
    deviceToken:Joi.string(),
    deviceType:Joi.string(),
    deviceId:Joi.string(),
    deviceFingerprint:Joi.object()
    
});
// const profile = Joi.object().keys({
//   user_name:Joi.string().alphanum().min(3).max(30).required().error(() => {
//       return {
//         message: 'User name must only contain alpha-numeric characters',
//       };
//     }),
// });

module.exports = {
    logIn,
    signup
};

