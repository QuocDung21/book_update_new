const router = require("express").Router();

const voucherController = require('../../controllers/voucher/voucherController')

router.get("/voucher", voucherController.getVouchers)
router.get("/voucher/:id", voucherController.getVoucher)
router.put("/voucher/:id", voucherController.updateVoucher)
router.post('/voucher', voucherController.addVoucher)
router.delete("/voucher/:id", voucherController.deleteVoucher)

module.exports = router;
