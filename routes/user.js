

const { Router } = require('express');
const { check } = require('express-validator');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJTW } = require('../middlewares/validateJWT');
// const { isAdminRole } = require('../middlewares/validateRole');
// const { roleAllowed } = require('../middlewares/validateRole');

const {
    validateFields,
    validateJTW,
    isAdminRole,
    roleAllowed,
}  = require('../middlewares')

const { validateRole, existEmail, existUserById } = require('../helpers/db-validators');

const { 
    getUsers, 
    putUsers, 
    postUsers, 
    deleteUsers, 
    patchUsers 
} = require('../controllers/user');

const router = Router();

router.get('/', getUsers );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(validateRole),
    validateFields
], putUsers );

router.post('/', [
    check('name', 'El nombre es requerido').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 dígitos').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(existEmail),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(validateRole),
    validateFields
], postUsers );

router.delete('/:id', [
    validateJTW,
    // isAdminRole,
    roleAllowed('ADMIN_ROLE','SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserById),
    validateFields
], deleteUsers );

router.patch('/', patchUsers );

module.exports = router;