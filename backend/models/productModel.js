const {Schema, model} = require("mongoose");

const productSchema = new Schema(
    {
        sellerId: {
            type: Schema.ObjectId,
            required: true,
            ref: "sellers"
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },
        shopName: {
            type: String,
            required: true,
        },
        loaibia: {
            type: String,
            required: true,
        },
        sotrang: {
            type: Number,
            required: true,
        },
        nxb: {
            type: String,
            required: true,
        },
        nam_nxb: {
            type: String,
            required: true,
        },
        trongluong: {
            type: String,
            required: true,
        },
        kichthuocbaobi: {
            type: String,
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
);

productSchema.index(
    {
        name: "text",
        category: "text",
        brand: "text",
        description: "text",
    },
    {
        weights: {
            name: 5,
            category: 4,
            brand: 3,
            description: 2,
        },
    }
);

module.exports = model("products", productSchema);
