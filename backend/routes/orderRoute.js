const express = require('express')
const { isUserAuthenticated, authorizedRoles } = require('../middlewares/auth')
const { createNewOrder, getMyOrder, getMyAllOrders, getAllOrders, updateOrderStatus, getTotalNumberOfOrders, deleteOrderAndPaymentOrder } = require('../controllers/order/orderController')
const router = express.Router()



router.route('/orders').post(isUserAuthenticated,createNewOrder).get(isUserAuthenticated,getMyAllOrders)
router.route('/orders/:productId/:quantity').post(isUserAuthenticated,createNewOrder)
router.route('/orders/:id').get(isUserAuthenticated,getMyOrder).delete(isUserAuthenticated,deleteOrderAndPaymentOrder)
router.route('/admin/orders/:status').get(isUserAuthenticated,authorizedRoles('admin'),getAllOrders)
router.route('/admin/orders').get(isUserAuthenticated,authorizedRoles('admin'),getTotalNumberOfOrders)
router.route('/admin/orders/:id').patch(isUserAuthenticated,authorizedRoles('admin'),updateOrderStatus)



module.exports = router