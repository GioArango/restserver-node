const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models')

const allowedCollections = [
    'users',
    'categories',
    'products',
    'rols'
];

const searchUsers = async( searchCriteria = '', res = response ) => {
    
    const isMongoId = ObjectId.isValid( searchCriteria );

    if ( isMongoId ) {
        const user = await User.findById( searchCriteria );
        res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp( searchCriteria, 'i' )

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: users
    });
}

const searchCategories = async( searchCriteria = '', res = response ) => {
    
    const isMongoId = ObjectId.isValid( searchCriteria );

    if ( isMongoId ) {
        const category = await Category.findById( searchCriteria );
        res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp( searchCriteria, 'i' )

    const categories = await Category.find({ name: regex, status: true });

    res.json({
        results: categories
    });
}

const searchProducts = async( searchCriteria = '', res = response ) => {
    
    const isMongoId = ObjectId.isValid( searchCriteria );

    if ( isMongoId ) {
        const product = await Product.findById( searchCriteria ).populate('category', 'name');
        res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp( searchCriteria, 'i' )

    const products = await Product.find({ name: regex, status: true }).populate('category', 'name');

    res.json({
        results: products
    });
}


const search = ( req, res = response ) => {

    const { collection, searchCriteria } = req.params;

    if( !allowedCollections.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers( searchCriteria, res );
            break;
        case 'categories':
            searchCategories( searchCriteria, res );
            break;

        case 'products':
            searchProducts( searchCriteria, res );
            break;
        default:
            res.status(500).json({
                msg: "Se le olvido hacer esta búsqueda"
            });
    }
}

module.exports = {
    search
}