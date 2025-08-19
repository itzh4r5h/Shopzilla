const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getTotalNumberOfProducts,
  getInStockAndOutOfStockProductCount,
} = require("../controllers/product/productController");
const {
  createOrUpdateProductReview,
  deleteProductReview,
  getAllReviewsAndRatingsOfAProduct,
} = require("../controllers/product/reviewController");
const { isUserAuthenticated, authorizedRoles } = require("../middlewares/auth");
const { upload } = require("../utils/uploadImages");
const {
  createCategory,
  updateCategoryName,
  addSubCategory,
  updateSubCategoryName,
  updateSubCategoryAttriubtes,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  getAllSubCategoriesOfSpecifiedCategory,
  getAllAttributesOfSubCategory,
} = require("../controllers/product/categoryController");
const router = express.Router();

// =================================== Admin User Product Related Routes =======================================
router
  .route("/admin/products")
  .post(
    isUserAuthenticated,
    authorizedRoles("admin"),
    upload.array("images", Number(process.env.PRODUCT_MAX_IMAGES)),
    createProduct
  )
  .get(isUserAuthenticated, authorizedRoles("admin"), getTotalNumberOfProducts);
router
  .route("/admin/products/:id")
  .patch(
    isUserAuthenticated,
    authorizedRoles("admin"),
    upload.array("images", Number(process.env.PRODUCT_MAX_IMAGES)),
    updateProduct
  )
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteProduct);
router
  .route("/admin/products/stock_status")
  .get(
    isUserAuthenticated,
    authorizedRoles("admin"),
    getInStockAndOutOfStockProductCount
  );

// ===================================== Admin User Product Category Related Routes ==========================================
router
  .route("/admin/products/categories")
  .post(isUserAuthenticated, authorizedRoles("admin"), createCategory)
  .get(isUserAuthenticated,authorizedRoles('admin'),getAllCategories)
router
  .route("/admin/products/categories/:id")
  .patch(isUserAuthenticated, authorizedRoles("admin"), updateCategoryName)
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteCategory)
router
  .route("/admin/products/categories/:id/subcategories")
  .patch(isUserAuthenticated, authorizedRoles("admin"), addSubCategory)
  .get(isUserAuthenticated,authorizedRoles('admin'),getAllSubCategoriesOfSpecifiedCategory)
router
  .route("/admin/products/categories/:id/subcategories/:subId")
  .patch(isUserAuthenticated, authorizedRoles("admin"), updateSubCategoryName)
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteSubCategory);
router
  .route("/admin/products/categories/:id/subcategories/:subId/attributes")
  .get(isUserAuthenticated,authorizedRoles('admin'),getAllAttributesOfSubCategory)
  .patch(
    isUserAuthenticated,
    authorizedRoles("admin"),
    updateSubCategoryAttriubtes
  );

// =================================== Every User Routes =======================================
router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getProduct);

router
  .route("/products/:id/reviews")
  .patch(isUserAuthenticated, createOrUpdateProductReview)
  .get(getAllReviewsAndRatingsOfAProduct)
  .delete(isUserAuthenticated, deleteProductReview);

module.exports = router;
