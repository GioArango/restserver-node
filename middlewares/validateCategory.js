const { response } = require("express");
const { Category } = require("../models");


const validateCategory = async( req, res = response, next ) => {
    const name = req.body.category;

    try {
        const isValidCategory = await Category.findOne({ name });
    
        if( !isValidCategory ) {
            return res.status(400).json({
                msg: 'La categoría no existe'
            })
        }
    
        if( !isValidCategory.status ) {
            return res.status(400).json({
                msg: 'La categoría está inactiva'
            })
        }
    
        req.category = isValidCategory;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error validando la categoría'
        }) 
    }

}

module.exports = {
    validateCategory
};