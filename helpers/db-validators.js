
const Role = require('../models/role');
const User = require('../models/user');

const validateRole = async(role = '') => {
    const existsRole = await Role.findOne({ role });
    
    if ( !existsRole ) {
        throw new Error(`El rol ${role} no está registrado en la BD`)
    }
}
// Verificar si el correo existe
const existEmail = async( email = '') => {
    const existEmail = await User.findOne({ email });
    if( existEmail ) {
        throw new Error(`El email ${email} ya está registrado`)
    }
}

const existUserById = async( id ) => {
    const existUser = await User.findById( id );
    if( !existUser ) {
        throw new Error(`El ID ${id} no existe`)
    }
}

module.exports = {
    validateRole,
    existEmail,
    existUserById
}