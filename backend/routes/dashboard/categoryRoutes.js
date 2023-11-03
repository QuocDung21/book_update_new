const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const categoryController = require("../../controllers/dashboard/categoryController");

// Add categories routes
router.post("/category-add", authMiddleware, categoryController.add_category);

// Update categories routes
router.put(
  "/category-update/:id_category",
  authMiddleware,
  categoryController.update_category
);

// Edit categories routes
router.get(
  "/category-edit/:id_category",
  authMiddleware,
  categoryController.edit_category
);

// Get category routes
router.get("/category-get", authMiddleware, categoryController.get_category);

// Delete category routes
router.delete(
  "/category-delete/:id_category",
  authMiddleware,
  categoryController.delete_category
);

module.exports = router;
