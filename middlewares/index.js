const validateFields = require('../middlewares/validate-fields');
const validateJTW = require('../middlewares/validateJWT');
const isAdminRole = require('../middlewares/validateRole');
const roleAllowed = require('../middlewares/validateRole');

module.exports = {
    ...validateFields,
    ...validateJTW,
    ...isAdminRole,
    ...roleAllowed,
}