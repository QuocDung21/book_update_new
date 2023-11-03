const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const {responseReturn} = require("../../utiles/response");

class productController {
    add_product = async (req, res) => {
        const {id} = req;
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            let {
                name,
                category,
                description,
                stock,
                price,
                discount,
                shopName,
                brand,
                loaibia,
                sotrang,
                nxb,
                nam_nxb,
                trongluong,
                kichthuocbaobi,
                status,
            } = field;
            console.log(status);
            const {images} = files;
            name = name.trim();
            const slug = name.split(" ").join("-");
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true,
            });
            try {
                let allImageUrl = [];
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, {
                        folder: "products",
                    });
                    allImageUrl = [...allImageUrl, result.url];
                }
                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    loaibia,
                    sotrang,
                    nxb,
                    nam_nxb,
                    trongluong,
                    kichthuocbaobi,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim(),
                });
                responseReturn(res, 201, {message: "Thêm sản phẩm thành công"});
            } catch (error) {
                responseReturn(res, 500, {error: error.message});
            }
        });
    };

    products_get = async (req, res) => {
        const {page, searchValue, parPage} = req.query;
        const {id} = req;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);
        try {
            if (searchValue) {
                const products = await productModel
                    .find({
                        $text: {$search: searchValue},
                        sellerId: id,
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalProduct = await productModel
                    .find({
                        $text: {$search: searchValue},
                        sellerId: id,
                    })
                    .countDocuments();
                responseReturn(res, 200, {totalProduct, products});
            } else {
                const products = await productModel
                    .find({sellerId: id})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalProduct = await productModel
                    .find({sellerId: id})
                    .countDocuments();
                responseReturn(res, 200, {totalProduct, products});
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    product_get = async (req, res) => {
        const {productId} = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, {product});
        } catch (error) {
            console.log(error.message);
        }
    };

    product_delete = async (req, res, next) => {
        console.log(req.params);
        const {productId} = req.params;
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                responseReturn(res, 404, {message: "Sản phẩm không tồn tại"});
            }
            await productModel.findByIdAndDelete(productId);
            responseReturn(res, 200, {message: "Xóa sản phẩm thành công"});
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, {message: error.message});
        }
    };

    product_update = async (req, res) => {
        let {
            name,
            category,
            description,
            stock,
            price,
            discount,
            shopName,
            brand,
            loaibia,
            sotrang,
            nxb,
            nam_nxb,
            trongluong,
            kichthuocbaobi,
            productId,
            status,
        } = req.body;
        console.log(status);
        name = name.trim();
        const slug = name.split(" ").join("-");
        try {
            await productModel.findByIdAndUpdate(productId, {
                name,
                category,
                description,
                stock,
                price,
                discount,
                shopName,
                brand,
                loaibia,
                sotrang,
                nxb,
                nam_nxb,
                trongluong,
                kichthuocbaobi,
                productId,
                status,
            });
            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
                product,
                message: "Cập nhật sản phẩm thành công",
            });
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };

    product_image_update = async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, field, files) => {
            const {productId, oldImage} = field;
            const {newImage} = files;
            if (err) {
                responseReturn(res, 404, {error: err.message});
            } else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true,
                    });
                    const result = await cloudinary.uploader.upload(newImage.filepath, {
                        folder: "products",
                    });
                    if (result) {
                        let {images} = await productModel.findById(productId);
                        const index = images.findIndex((img) => img === oldImage);
                        images[index] = result.url;
                        await productModel.findByIdAndUpdate(productId, {
                            images,
                        });
                        const product = await productModel.findById(productId);
                        responseReturn(res, 200, {
                            product,
                            message: "Cập nhật ảnh sản phẩm thành công",
                        });
                    } else {
                        responseReturn(res, 404, {error: "Upload ảnh thất bại"});
                    }
                } catch (error) {
                    responseReturn(res, 404, {error: error.message});
                }
            }
        });
    };

    product_get_all_admin = async (req, res, next) => {
        const {id} = req.params;
        try {
            const products = await productModel
                .find({sellerId: id})
                .populate('sellerId')
                .exec();
            if (!products || products.length === 0) {
                return res.status(404).json({message: 'No products found'});
            }
            return res.json(products)
        } catch (e) {
            return res.json({error: e.message});
        }
    }

}

module.exports = new productController();
