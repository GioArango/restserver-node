const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );
 
const { response } = require("express");
const { uploadFile } = require("../helpers");

const { User, Product } = require("../models");


const uploadFiles = async( req, res = response ) => {

    try {
        // const fileName = await uploadFile( req.files, ['txt', 'md'], 'textos' );
        const fileName = await uploadFile( req.files, undefined, 'imgs' );
    
        res.json({
            fileName
        });        
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }
    
}

const updateFile = async( req, res = response ) => {
    
    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imágenes previas
    if ( model.img ) {
        // Borra la imagen del servidor
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( imagePath ) ) {
            fs.unlinkSync( imagePath );
        }
    }

    const fileName = await uploadFile( req.files, undefined, collection );
    model.img = fileName;

    await model.save();

    res.json(model);
}

const getImage = async( req, res = response ) => {

    const { id, collection } = req.params;
    
    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imágenes previas
    if ( model.img ) {
        // Borra la imagen del servidor
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( imagePath ) ) {
            return res.sendFile(imagePath);
        }
    }

    const placeholderImage = path.join( __dirname, '../assets/no-image.jpg' );

    res.sendFile(placeholderImage);
}

const updateFileCloudDinary = async( req, res = response ) => {
    
    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'products':
            model = await Product.findById(id);
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imágenes previas
    if ( model.img ) {
        // Borra la imagen del servidor
        const nameArr = model.img.split('/');
        const fileName = nameArr[ nameArr.length - 1 ];

        const [ public_id ] = fileName.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    model.img = secure_url;

    await model.save();

    res.json(model);
}

module.exports = {
    uploadFiles,
    updateFile,
    getImage,
    updateFileCloudDinary
}