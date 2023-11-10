const express = require("express");
const router = express.Router();
const voucher = require("../../models/voucherModel");
const {responseReturn} = require("../../utiles/response");
const formidable = require("formidable");

class VoucherController {
    // Lấy danh sách tất cả các voucher
    getVouchers = async (req, res) => {
        try {
            const vouchers = await voucher.find();
            return responseReturn(res, 200, vouchers);
        } catch (err) {
            console.error(err);
            return responseReturn(res, 500, "Internal Server Error");
        }
    };

    // Lấy thông tin của một voucher dựa trên ID
    getVoucher = async (req, res) => {
        const voucherId = req.params.id;
        try {
            const foundVoucher = await voucher.findById(voucherId);
            if (!foundVoucher) {
                return responseReturn(res, 404, "Voucher not found");
            }
            return responseReturn(res, 200, "Success", foundVoucher);
        } catch (err) {
            console.error(err);
            return responseReturn(res, 500, "Internal Server Error");
        }
    };

    // Cập nhật thông tin một voucher dựa trên ID
    updateVoucher = async (req, res) => {
        const voucherId = req.params.id;
        const formData = new formidable.IncomingForm();

        formData.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return responseReturn(res, 500, "Internal Server Error");
            }

            try {
                const updatedVoucher = await voucher.findByIdAndUpdate(voucherId, fields, {new: true});

                if (!updatedVoucher) {
                    return responseReturn(res, 404, "Voucher not found");
                }

                return responseReturn(res, 200, "Voucher updated successfully", updatedVoucher);
            } catch (err) {
                console.error(err);
                return responseReturn(res, 500, "Internal Server Error");
            }
        });
    };

    deleteVoucher = async (req, res) => {
        const voucherId = req.params.id;
        console.log(voucherId)
        try {
            const deletedVoucher = await voucher.findByIdAndDelete(voucherId);
            if (!deletedVoucher) {
                return responseReturn(res, 404, "Voucher not found");
            }
            return responseReturn(res, 200, "Voucher deleted successfully", deletedVoucher);
        } catch (err) {
            console.error(err);
            return responseReturn(res, 500, "Internal Server Error");
        }
    };

    // Thêm một voucher mới
    addVoucher = async (req, res) => {
        const formData = new formidable.IncomingForm();
        formData.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return responseReturn(res, 500, "Internal Server Error");
            }
            try {
                console.log(fields)
                const newVoucher = await voucher.create(fields);
                return responseReturn(res, 201, "Voucher created successfully", newVoucher);
            } catch (error) {
                console.error(error);
                return responseReturn(res, 500, "Internal Server Error");
            }
        });
    };
}

module.exports = new VoucherController();

