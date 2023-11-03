const router = require("express").Router();
const shippingController = require("../../controllers/admin/shippingController");

router.get("/shipping", shippingController.getShipping)

router.post("/get-Shipping", shippingController.getCostShipping)

router.post("/shipping", shippingController.updateShipping)

router.delete("/shipping/:id", shippingController.deleteShipping)

module.exports = router;