const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJTW = async ( req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPUBLICKEY);

        // leer el usuario que corresponde al uid
        const user  = await User.findById(uid);

        if( !user ) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            })
        }

        if( !user.status ) {
            return res.status(401).json({
                msg: 'Usuario no activo'
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


}

module.exports = {
    validateJTW
}