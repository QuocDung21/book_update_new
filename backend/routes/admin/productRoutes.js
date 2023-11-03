const router = require("express").Router();
const productController = require("../../controllers/dashboard/productController");

router.get("/products/:id",
    productController.product_get_all_admin)

router.delete("/products/:productId"
    , productController.product_delete)

module.exports = router;
