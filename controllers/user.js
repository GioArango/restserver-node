const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const getUsers = async(req = request , res = response ) => {
    
    const { limit = 5, from =  0 } = req.query;
    const query = { status: true };   

    const [ total, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
       total,
       users
    });
}

const putUsers = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    // TODO: Validar contra BD
    if ( password ) {
         // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.json(user);
}

const postUsers = async(req, res) => {
    
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
}

const deleteUsers = async(req, res) => {

    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json(user);
}

const patchUsers = (req, res) => {
    res.json({
        msg: "patch API - Controller"
    });
}


module.exports = {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers
}