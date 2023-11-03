const router = require("express").Router();
const customerAuthController = require("../../controllers/home/customerAuthController");
router.post(
  "/customer/customer-register",
  customerAuthController.customer_register
);

router.get(
  "/customer/reset-pass/:email",
  customerAuthController.customer_resetPassword_sendEmail
);

router.post(
  "/customer/reset-pass",
  customerAuthController.customer_ResetPassword
);



router.post("/customer/status", customerAuthController.customer_status);
router.post("/customer/customer-login", customerAuthController.customer_login);
router.get("/customer/logout", customerAuthController.customer_logout);
router.get("/customer/block/:email", customerAuthController.customer_block);

router.post(
  "/customer/change-password",
  customerAuthController.customer_changePassword
);

// customer_changePassword;

module.exports = router;
