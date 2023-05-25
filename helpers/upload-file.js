const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = [ 'png', 'jpg', 'jpeg', 'txt' ], folder = '' ) => {
    console.log(files);
    return new Promise( (resolve, reject ) => {
        const { file } = files;
        const segmentFile = file.name.split('.');
        const extension = segmentFile[ segmentFile.length - 1];
    
        // Validar la extensión
    
        if( !validExtensions.includes(extension) ) {
            return reject(`La extensión ${extension} no es permitida ${validExtensions}`);
        }    
    
        const temporalName =  uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName);
    
        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }
    
            resolve( temporalName );
        });
    }) 

}


module.exports = {
    uploadFile
}