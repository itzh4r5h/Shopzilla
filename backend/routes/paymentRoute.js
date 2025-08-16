const express = require('express')
const { isUserAuthenticated, authorizedRoles } = require('../middlewares/auth')
const { createPaymentOrder, verifyPayment, getTotalRevenue, getYears, getMonthlyRevenueByYear } = require('../controllers/payment/paymentConroller')
const router = express.Router()

router.route('/payments/order').post(isUserAuthenticated,createPaymentOrder)
router.route('/payments/verify').post(isUserAuthenticated,verifyPayment)
router.route('/payments/revenue/:year').get(isUserAuthenticated,authorizedRoles('admin'),getTotalRevenue)
router.route('/payments/revenue/monthly/:year').get(isUserAuthenticated,authorizedRoles('admin'),getMonthlyRevenueByYear)
router.route('/payments/years').get(isUserAuthenticated,authorizedRoles('admin'),getYears)

module.exports = router