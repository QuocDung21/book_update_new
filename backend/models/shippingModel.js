const {Schema, model} = require('mongoose')

const shippingSchema = new Schema({
    city: {
        type: String,
        unique: true,
        required: true
    },
    // name: {
    //     type: String,
    //     required: true
    // },
    price: {
        type: Number,
        required: true,
    },
}, {timestamps: true})


module.exports = model('shipping', shippingSchema)