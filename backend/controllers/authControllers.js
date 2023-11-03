const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const bcrpty = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const {responseReturn} = require("../utiles/response");
const {createToken} = require("../utiles/tokenCreate");
const customerModel = require("../models/customerModel");
const customerOrder = require("../models/customerOrder");

class authControllers {

    admin_login = async (req, res) => {
        const {email, password} = req.body;
        try {
            const admin = await adminModel.findOne({email}).select("+password");
            if (admin) {
                const match = await bcrpty.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role,
                    });
                    res.cookie("accessToken", token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, {token, message: "Login success"});
                } else {
                    responseReturn(res, 404, {error: "Password wrong"});
                }
            } else {
                responseReturn(res, 404, {error: "Email not found"});
            }
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };

    seller_login = async (req, res) => {
        const {email, password} = req.body;
        try {
            const seller = await sellerModel.findOne({email}).select("+password");
            if (seller) {
                const match = await bcrpty.compare(password, seller.password);
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role,
                    });
                    res.cookie("accessToken", token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, {token, message: "Login success"});
                } else {
                    responseReturn(res, 404, {error: "Password wrong"});
                }
            } else {
                responseReturn(res, 404, {error: "Email not found"});
            }
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };

    seller_register = async (req, res) => {
        const {email, name, password} = req.body;
        try {
            const getUser = await sellerModel.findOne({email});
            if (getUser) {
                responseReturn(res, 404, {error: "Email alrady exit"});
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrpty.hash(password, 10),
                    method: "menualy",
                    shopInfo: {},
                });
                await sellerCustomerModel.create({
                    myId: seller.id,
                });
                const token = await createToken({id: seller.id, role: seller.role});
                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
                responseReturn(res, 201, {token, message: "register success"});
            }
        } catch (error) {
            responseReturn(res, 500, {error: "Internal server error"});
        }
    };

    getUserById = async (req, res) => {
        const {id} = req.params;
        try {
            const getUser = await customerModel.findById(id);
            const getUserOrder = await customerOrder.find({customerId: id});

            if (!getUser) {
                responseReturn(res, 404, {error: "User not exit"});
            }
            const user = await customerModel.findById(id);
            responseReturn(res, 200, {userInfo: user, order: getUserOrder});
        } catch (error) {
            responseReturn(res, 500, {error: error});
        }
    }
    getUser = async (req, res) => {
        const {id, role} = req;
        try {
            if (role === "admin") {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, {userInfo: user});
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, {userInfo: seller});
            }
        } catch (error) {
            responseReturn(res, 500, {error: "Internal server error"});
        }
    };

    deleteUser = async (req, res) => {
        const {id} = req.params
        try {
            const user = await customerModel.findById(id)
            if (!user) {
                responseReturn(res, 404, {error: "không tìm thấy Users"});
            }
            await customerModel.findByIdAndDelete(id)
            responseReturn(res, 200, {error: "Xoá thành công"});
        } catch (error) {
            responseReturn(res, 500, {error: "Internal server error"});
        }
    }

    getUsers = async (req, res) => {
        const {page, searchValue, parPage} = req.query;
        try {
            let skipPage = "";
            if (parPage && page) {
                skipPage = parseInt(parPage) * (parseInt(page) - 1);
            }
            if (searchValue && page && parPage) {
                const customers = await customerModel
                    .find({
                        $text: {$search: searchValue},
                    })
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                console.log(customers);
                const totalCustomers = await customerModel
                    .find({
                        $text: {$search: searchValue},
                    })
                    .countDocuments();
                responseReturn(res, 200, {totalCustomers, customers});
            } else if (searchValue === "" && page && parPage) {
                const customers = await customerModel
                    .find({})
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({createdAt: -1});
                const totalCustomers = await customerModel.find({}).countDocuments();
                responseReturn(res, 200, {totalCustomers, customers});
            } else {
                const customers = await customerModel.find({}).sort({createdAt: -1});
                const totalCustomers = await customerModel.find({}).countDocuments();
                responseReturn(res, 200, {totalCustomers, customers});
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    profile_image_upload = async (req, res) => {
        const {id} = req;
        const form = formidable({multiples: true});
        form.parse(req, async (err, _, files) => {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true,
            });
            const {image} = files;
            try {
                const result = await cloudinary.uploader.upload(image.filepath, {
                    folder: "profile",
                });
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url,
                    });
                    const userInfo = await sellerModel.findById(id);
                    responseReturn(res, 201, {
                        message: "image upload success",
                        userInfo,
                    });
                } else {
                    responseReturn(res, 404, {error: "image upload failed"});
                }
            } catch (error) {
                //console.log(error)
                responseReturn(res, 500, {error: error.message});
            }
        });
    };

    profile_info_add = async (req, res) => {
        const {division, district, shopName, sub_district} = req.body;
        const {id} = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district,
                },
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, {
                message: "Profile info add success",
                userInfo,
            });
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };


    profile_info_update = async (req, res) => {
        const {division, district, shopName, sub_district, status, name, email} = req.body;

        const {id} = req.params;


        try {
            await sellerModel.findByIdAndUpdate(id, {
                name,
                email,
                shopInfo: {
                    shopName,
                    district,
                    sub_district,
                },
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, {
                message: "Profile info add success",
                userInfo,
            });
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };


    deleteSeller = async (req, res, next) => {
        const {idSeller} = req.params;
        try {
            const seller = await sellerModel.findById(idSeller);
            if (!seller) {
                responseReturn(res, 404, {message: "Seller không tồn tại"});
            }
            await sellerModel.findByIdAndDelete(idSeller)
            responseReturn(res, 200, {message: "Xóa thành công"});
        } catch (error) {
            console.log(error)
            responseReturn(res, 500, {message: error.message});
        }

    }


    logout = async (req, res) => {
        try {
            res.cookie("accessToken", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            responseReturn(res, 200, {message: "logout success"});
        } catch (error) {
            responseReturn(res, 500, {error: error.message});
        }
    };
}

module.exports = new authControllers();
