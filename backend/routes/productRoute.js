const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct} = require('../controllers/product/productController')
const {createOrUpdateProductReview, getAllReviewsOfAProduct, deleteProductReview } = require('../controllers/product/reviewController')
const { isUserAuthenticated, authorizedRoles } = require('../middlewares/auth')
const router = express.Router()


// =================================== Admin User Routes =======================================
router.route('/admin/products').post(isUserAuthenticated,authorizedRoles('admin'),createProduct)
router.route('/admin/products/:id').patch(isUserAuthenticated,authorizedRoles('admin'),updateProduct).delete(isUserAuthenticated,authorizedRoles('admin'),deleteProduct)



// =================================== Every User Routes =======================================
router.route('/products').get(getAllProducts)
router.route('/products/:id').get(getProduct)

router.route('/products/:id/reviews').patch(isUserAuthenticated,createOrUpdateProductReview).get(getAllReviewsOfAProduct)
router.route('/products/:productId/reviews/:reviewId').delete(isUserAuthenticated,deleteProductReview)



module.exports = router