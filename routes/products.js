const { Router } = require('express');
const { check } = require("express-validator");

const { validateJTW, validateFields, isAdminRole } = require("../middlewares");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/products");
const { existProductById, existProduct, existCategoryById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], getProductById);

router.post('/', [
    validateJTW,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'Envíe una categoría válida').isMongoId(),
    check('category').custom( existCategoryById ),
    validateFields
], createProduct );

router.put('/:id', [
    validateJTW,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existProductById ),
    check('category', 'Envíe una categoría válida').isMongoId(),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJTW,    
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existProductById ),
    validateFields
], deleteProduct);

module.exports = router;