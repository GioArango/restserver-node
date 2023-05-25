const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFiles, updateFile, getImage, updateFileCloudDinary } = require('../controllers/uploads');
const { collectionsAllowed } = require('../helpers');
const { validFileUploaded, validateFields } = require('../middlewares');

const router = Router();

router.post( '/', validFileUploaded, uploadFiles );

router.put( '/:collection/:id', [
    validFileUploaded,
    check('id', 'Debe ser un id de Mongo válido').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, [ 'users', 'products' ] )),
    validateFields
], updateFileCloudDinary );
// ], updateFile );

router.get( '/:collection/:id', [
    check('id', 'Debe ser un id de Mongo válido').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, [ 'users', 'products' ] )),
    validateFields
], getImage)


module.exports = router;