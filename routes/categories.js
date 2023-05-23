const { Router } = require('express');
const { check } = require('express-validator');

const { validateJTW, validateFields, roleAllowed, isAdminRole } = require('../middlewares');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const { existCategoryById, existCategory, validateRole } = require('../helpers/db-validators');

const router = Router();


router.get('/', getCategories);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], getCategoryById);

router.post('/', [
    validateJTW,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], createCategory );

router.put('/:id', [
    validateJTW,
    check('name').custom(existCategory),
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJTW,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existCategoryById ),
    validateFields
], deleteCategory);

module.exports = router;