const validateFields = require('../middlewares/validate-fields');
const validateJTW = require('../middlewares/validateJWT');
const validateCategory = require('../middlewares/validateCategory');
const isAdminRole = require('../middlewares/validateRole');
const roleAllowed = require('../middlewares/validateRole');

module.exports = {
    ...validateFields,
    ...validateJTW,
    ...validateCategory,
    ...isAdminRole,
    ...roleAllowed,
}