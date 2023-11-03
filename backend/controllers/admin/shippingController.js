const shippingModel = require("../../models/shippingModel");
const {responseReturn} = require("../../utiles/response");

class shippingControllers {

    getShipping = async (req, res, next) => {
        const shipping = await shippingModel.find()
        responseReturn(res, 200, shipping);
    }

    deleteShipping = async (req, res, next) => {
        const {id} = req.params
        try {
            const shipping = await shippingModel.findById(id)
            if (shipping) {
                await shippingModel.findByIdAndDelete(id)
                responseReturn(res, 200, "Xoá thanh công")
            }
        } catch (e) {
            console.log(e)
        }
    }


    createShipping = async (req, res, next) => {
        const {city, price, name} = req.body;
        try {
            await shippingModel.create({city, price, name});
            responseReturn(res, 200, {message: "Tạo mới thành công"});
        } catch (err) {
            console.log(err);
            responseReturn(res, 500, {message: err});
        }
    }

    // updateShipping = async (req, res) => {
    //     const {city, price, name} = req.body;
    //     const {id} = req.params
    //     try {
    //         const shipping = await shippingModel.findById(id);
    //         if (shipping) {
    //             await shippingModel.findByIdAndUpdate(id, {price,name});
    //             responseReturn(res, 200, {message: "Cập nhật thành công"});
    //         } else {
    //             await shippingModel.create({city, price});
    //             responseReturn(res, 200, {message: "Tạo mới thành công"});
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         responseReturn(res, 500, {message: err});
    //     }
    // }


    getCostShipping = async (req, res) => {
        const {city} = req.body;
        const finShip = await shippingModel.findOne({city: city});
        if (!finShip) {
            const data = await shippingModel.findOne({city: "Default"});
            responseReturn(res, 200, data);
        } else {
            responseReturn(res, 200, finShip);
        }
    }


    updateShipping = async (req, res) => {
        const {city, price} = req.body;
        try {
            const shipping = await shippingModel.findOne({city});
            console.log(shipping)
            if (shipping) {
                await shippingModel.updateOne({city}, {price});
                responseReturn(res, 200, {message: "Cập nhật thành công"});
            } else {
                await shippingModel.create({city, price});
                responseReturn(res, 200, {message: "Tạo mới thành công"});
            }
        } catch (err) {
            console.log(err);
            responseReturn(res, 500, {message: err});
        }
    }

    // updateShipping = async (req, res) => {
    //     const {city, price} = req.body;
    //     try {
    //         const shipping = await shippingModel.findOne({city});
    //         console.log(shipping)
    //         if (shipping) {
    //             await shippingModel.updateOne({city}, {price});
    //             responseReturn(res, 200, {message: "Cập nhật thành công"});
    //         } else {
    //             await shippingModel.create({city, price});
    //             responseReturn(res, 200, {message: "Tạo mới thành công"});
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         responseReturn(res, 500, {message: err});
    //     }
    // }


}

module.exports = new shippingControllers();
