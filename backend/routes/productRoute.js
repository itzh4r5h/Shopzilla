const express = require("express");
const {
  getAllProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  createProduct,
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
const {
  createNewVariant,
  updateVariant,
  deleteVariant,
  getVariant,
  getInStockAndOutOfStockVariantCount,
  getTotalNumberOfVariants,
  getAllVariantsOfAProduct,
  getAllVariants,
} = require("../controllers/product/variantController");
const router = express.Router();

// ===================================== Admin User Product Category Related Routes ==========================================
router
  .route("/admin/products/categories")
  .post(isUserAuthenticated, authorizedRoles("admin"), createCategory)
  .get(isUserAuthenticated, authorizedRoles("admin"), getAllCategories);
router
  .route("/admin/products/categories/:id")
  .patch(isUserAuthenticated, authorizedRoles("admin"), updateCategoryName)
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteCategory);
router
  .route("/admin/products/categories/:id/subcategories")
  .patch(isUserAuthenticated, authorizedRoles("admin"), addSubCategory)
  .get(
    isUserAuthenticated,
    authorizedRoles("admin"),
    getAllSubCategoriesOfSpecifiedCategory
  );
router
  .route("/admin/products/categories/:id/subcategories/:subId")
  .patch(isUserAuthenticated, authorizedRoles("admin"), updateSubCategoryName)
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteSubCategory);
router
  .route("/admin/products/categories/:id/subcategories/:subId/attributes")
  .get(
    isUserAuthenticated,
    authorizedRoles("admin"),
    getAllAttributesOfSubCategory
  )
  .patch(
    isUserAuthenticated,
    authorizedRoles("admin"),
    updateSubCategoryAttriubtes
  );

// =================================== Admin User Product Variant Related Routes =======================================
router
  .route("/admin/products/:productId/variants")
  .post(
    isUserAuthenticated,
    authorizedRoles("admin"),
    upload.any(),
    createNewVariant
  )
  .get(isUserAuthenticated, authorizedRoles("admin"), getAllVariantsOfAProduct);

router
  .route("/admin/products/:productId/variants/:id")
  .put(
    isUserAuthenticated,
    authorizedRoles("admin"),
    upload.any(),
    updateVariant
  )
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteVariant);

router
  .route("/admin/products/variants")
  .get(isUserAuthenticated, authorizedRoles("admin"), getTotalNumberOfVariants);

router
  .route("/admin/products/variants/stock_status")
  .get(
    isUserAuthenticated,
    authorizedRoles("admin"),
    getInStockAndOutOfStockVariantCount
  );

// =================================== Admin User Product Related Routes =======================================
router
  .route("/admin/products")
  .post(isUserAuthenticated, authorizedRoles("admin"), createProduct)
  .get(isUserAuthenticated, authorizedRoles("admin"), getAllProduct);

router
  .route("/admin/products/:id")
  .patch(isUserAuthenticated, authorizedRoles("admin"), updateProduct)
  .delete(isUserAuthenticated, authorizedRoles("admin"), deleteProduct)
  .get(isUserAuthenticated, authorizedRoles("admin"), getProduct);

// =================================== Product Variant Related Routes =======================================
router.route("/products/variants").get(getAllVariants);
router
  .route("/products/:productId/variants/:id")
  .get(isUserAuthenticated, getVariant);

// =================================== Product Review Related Routes =======================================
router
  .route("/products/:id/reviews")
  .patch(isUserAuthenticated, createOrUpdateProductReview)
  .get(getAllReviewsAndRatingsOfAProduct)
  .delete(isUserAuthenticated, deleteProductReview);

module.exports = router;
