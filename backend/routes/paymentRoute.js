const express = require('express')
const { isUserAuthenticated } = require('../middlewares/auth')
const { createPaymentOrder, verifyPayment } = require('../controllers/payment/paymentConroller')
const router = express.Router()

router.route('/payments/order').post(isUserAuthenticated,createPaymentOrder)
router.route('/payments/verify').post(isUserAuthenticated,verifyPayment)

module.exports = router