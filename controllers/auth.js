const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // verificar si el email existe
        const user = await User.findOne({ email });

        if( !user ) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas'
            })
        }

        // verificar si el usuario está activo

        if( !user.status ) {
            return res.status(400).json({
                msg: 'Usuario inactivo'
            })
        }

        // verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, user.password);
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - password'
            }) 
        }

        // generar el JWT
        const token = await generateJWT( user.id );
        
        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error'
        });
    }

}

const googleSingIn = async( req, res = response ) => {
    const { id_token } = req.body;

    try {

        const { name, picture, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if ( ! user ) {
            const data = {
                name,
                email,
                password: ':P',
                img: picture,
                role: "USER_ROLE",
                google: true
            };

            user = new User( data );
            console.log(user);
            await user.save();
        }

        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Usuario bloqueado, contacte el administrador'
            })
        }

        // generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            msg: 'OK!',
            token,
            user
        });

    } catch (error) {
        console.log(error);
        return response.status(400).json({
            msg: 'Ha ocurrido un error autenticandose a Google'
        })
    }

}


module.exports = {
    login,
    googleSingIn
}