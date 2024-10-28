const {Joi, common} = require('../../util/validations');
const {languages} = require('../../../../lib/i18n');

const requireId = Joi.object().keys({
    id: Joi.objectId()
        .valid()
        .optional().allow('')
});

const designation = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required()
})

module.exports = {
    requireId,
    designation
};
