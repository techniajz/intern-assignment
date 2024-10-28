const {Joi, common} = require('../../util/validations');
const {languages} = require('../../../../lib/i18n');

const requireId = Joi.object().keys({
    id: Joi.objectId()
        .valid()
        .optional().allow('')
});

module.exports = {
    requireId,
};
