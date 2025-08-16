const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isUserAuthenticated, isOtpValid, isEmailVerified, authorizedRoles } = require('../middlewares/auth')
const {signInWithGoogle, signUpUser, signInUser, signOut, verifyUserEmail,resetPassword} = require('../controllers/user/authController')
const {getAllUsers, deleteUser, getUser, updateUserName, updateUserEmail, updateUserProfilePic, updateUserPassword, cancelUpdateUserEmail, createPassword, getTotalNumberOfUsers} = require('../controllers/user/profileContoller')
const {sendEmailForResetPassword, sendEmailForEmailVerification, sendOtpToEmail} = require('../controllers/user/emailController')
const { addNewShippingAddress, getShippingAddress, getAllShippingAddress, updateShippingAddress, deleteShippingAddress, updateShippingAddressIndex } = require('../controllers/user/addressController')
const { getAllProductsOfCart, addProductToCartOrUpdateQuantity, removeProductFromCart } = require('../controllers/user/cartController')
const { upload } = require('../utils/uploadImages')


// ========================= AUTH ==============================
router.route('/users/auth/google').get(passport.authenticate('google'))
router.route('/users/auth/google/callback').get(passport.authenticate('google',{ failureRedirect: `${process.env.FRONTEND_URL}/signin`,session:false}),signInWithGoogle)
router.route('/users/signup').post(signUpUser)
router.route('/users/signin').post(isEmailVerified,signInUser)
router.route('/users/signout').get(isUserAuthenticated,signOut)
router.route('/users/verify/email/:token').get(isUserAuthenticated,verifyUserEmail)
router.route('/users/reset/password/:token').patch(resetPassword)


// ========================= PROFILE ==============================
router.route('/admin/users').get(isUserAuthenticated,authorizedRoles('admin'),getAllUsers)
router.route('/admin/users/total').get(isUserAuthenticated,authorizedRoles('admin'),getTotalNumberOfUsers)
router.route('/admin/users/:id').delete(isUserAuthenticated,authorizedRoles('admin'),deleteUser)
router.route('/users/me').get(isUserAuthenticated,getUser)
router.route('/users/name').patch(isUserAuthenticated,updateUserName)
router.route('/users/email').patch(isUserAuthenticated,isOtpValid,updateUserEmail)
router.route('/users/email').get(isUserAuthenticated,cancelUpdateUserEmail)
router.route('/users/profile-pic').patch(isUserAuthenticated, upload.single('image'), updateUserProfilePic)
router.route('/users/password').patch(isUserAuthenticated,updateUserPassword)
router.route('/users/password/new').patch(isUserAuthenticated,createPassword)


// ========================= SEND EMAIL ==============================
router.route('/users/email').post(isUserAuthenticated,sendOtpToEmail)
router.route('/users/verify/email').get(isUserAuthenticated,sendEmailForEmailVerification)
router.route('/users/reset/password').post(isEmailVerified,sendEmailForResetPassword)


// ========================= SHIPPING ADDRESS ==============================
router.route('/users/address').post(isUserAuthenticated,addNewShippingAddress).get(isUserAuthenticated,getAllShippingAddress).patch(isUserAuthenticated,updateShippingAddressIndex)
router.route('/users/address/:id').get(isUserAuthenticated,getShippingAddress).patch(isUserAuthenticated,updateShippingAddress).delete(isUserAuthenticated,deleteShippingAddress)

// ========================= CART PRODUCTS ==============================
router.route('/users/cart/:id').patch(isUserAuthenticated,addProductToCartOrUpdateQuantity).delete(isUserAuthenticated,removeProductFromCart)
router.route('/users/cart').get(isUserAuthenticated,getAllProductsOfCart)

module.exports = router