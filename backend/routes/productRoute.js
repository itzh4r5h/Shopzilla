const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct, getTotalNumberOfProducts} = require('../controllers/product/productController')
const {createOrUpdateProductReview, deleteProductReview, getAllReviewsAndRatingsOfAProduct } = require('../controllers/product/reviewController')
const { isUserAuthenticated, authorizedRoles } = require('../middlewares/auth')
const { upload } = require('../utils/uploadImages')
const router = express.Router()


// =================================== Admin User Routes =======================================
router.route('/admin/products').post(isUserAuthenticated,authorizedRoles('admin'),upload.array('images',Number(process.env.PRODUCT_MAX_IMAGES)),createProduct).get(isUserAuthenticated,authorizedRoles('admin'),getTotalNumberOfProducts)
router.route('/admin/products/:id').patch(isUserAuthenticated,authorizedRoles('admin'),upload.array('images',Number(process.env.PRODUCT_MAX_IMAGES)),updateProduct).delete(isUserAuthenticated,authorizedRoles('admin'),deleteProduct)



// =================================== Every User Routes =======================================
router.route('/products').get(getAllProducts)
router.route('/products/:id').get(getProduct)

router.route('/products/:id/reviews').patch(isUserAuthenticated,createOrUpdateProductReview).get(getAllReviewsAndRatingsOfAProduct).delete(isUserAuthenticated,deleteProductReview)


module.exports = router