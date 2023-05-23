const { response } = require("express");
const { Product } = require("../models");

const getProducts = async( req, res = response ) => {
    const { limit = 5, from =  0 } = req.query;
    const query = { status: true };
    
    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
       total,
       products
    });
}

const getProductById = async( req, res = response ) => {
    const { id } = req.params;
    
    const product = await Product.findById( id )
        .populate('user', 'name')
        .populate('category', 'name');
    
    res.json(product);
}

const createProduct = async( req, res = response ) => {
    
    try {
        const { status, user, ...body } = req.body;
    
        const productDB = await Product.findOne({ name: body.name });
    
        if ( productDB ) {
            return res.status(400).json({
                msg: `El producto ${ productDB.name } ya existe` 
            })
        }
    
        // Generar la data a guardar
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id,
        }
    
        const product = new Product( data );
    
        // Guardar en DB
        await product.save();
    
        res.status(201).json({
            product
        })
        
    } catch (error) {
        console.log('ERROR!',error);
    }
}

const updateProduct = async( req, res = response ) => {
    const { id } = req.params;
    const { status, user, category, ...data } = req.body;

    if ( data.name ) {
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    try {
        const productUpdated = await Product.findByIdAndUpdate( id, data, { new: true } );      
        res.json(productUpdated);
    } catch (error) {
        console.log(error);
    }

}

const deleteProduct = async( req, res = response ) => {
    const { id } = req.params;
    try {
        const productDeleted = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );
        res.json(productDeleted);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}