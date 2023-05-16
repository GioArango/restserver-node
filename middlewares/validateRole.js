const { response } = require("express")


const isAdminRole = ( req, res = response, next ) => {
    
    if( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token'
        })
    }
    
    const { role, name } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${name} no es un administrador - No puede hacer esto`
        })
    }
    next();
}

const roleAllowed = ( ...roles ) => {


    return (req, res = response, next) => {

        if( !req.user ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token'
            })
        }

        if ( !roles.includes( req.user.role) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        
        next();
    }
} 

module.exports = {
    isAdminRole,
    roleAllowed
}