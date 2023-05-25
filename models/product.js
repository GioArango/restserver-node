

const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        require: [ true, 'El nombre del producto es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },
    // Campo de relación
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    description: {
        type: String,
    },
    inStock: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Product', ProductSchema );