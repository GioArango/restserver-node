
const { Category, User, Role, Product } = require('../models');

const validateRole = async(role = '') => {
    const existsRole = await Role.findOne({ role });
    
    if ( !existsRole ) {
        throw new Error(`El rol ${role} no está registrado en la BD`)
    }
}
// Verificar si el correo existe
const existEmail = async( email = '' ) => {
    const existEmail = await User.findOne({ email });
    if( existEmail ) {
        throw new Error(`El email ${email} ya está registrado`)
    }
}

const existCategory = async( name = '' ) => {
    const existCategory = await Category.findOne({ name });
    if( existCategory ) {
        throw new Error(`La categoría ${name} ya está registrada`)
    }
}

const existProduct = async( name = '' ) => {
    const existProduct = await Product.findOne({ name });
    if( existProduct ) {
        throw new Error(`El producto ${name} ya está registrada`)
    }
}

const existUserById = async( id ) => {
    const existUser = await User.findById( id );
    if( !existUser ) {
        throw new Error(`El ID ${id} no existe`)
    }
}

const existCategoryById = async( id ) => {

    const existCategory = await Category.findById( id );
    
    if( !existCategory ) {
        throw new Error(`La categoría con id ${id} no existe`)
    } 

    if( !existCategory.status ) {
        throw new Error(`La categoría con id ${id} está inactiva`)
    }

}

const existProductById = async( id ) => {

    const existProduct = await Product.findById( id );
    
    if( !existProduct ) {
        throw new Error(`El producto con id ${id} no existe`)
    } 

    if( !existProduct.status ) {
        throw new Error(`El producto con id ${id} está inactivo`)
    }

}


// validar colecciones permitidas
const collectionsAllowed = ( collection = '', collections = [] ) => {

    const include = collections.includes(collection);

    if ( !include ) {
        throw new Error(`La colección ${collection} no es permitida, ${collections}`);
    }

    return true;
}

module.exports = {
    validateRole,
    existEmail,
    existCategory,
    existProduct,
    existUserById,
    existCategoryById,
    existProductById,
    collectionsAllowed
}