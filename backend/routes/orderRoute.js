const express = require('express')
const { isUserAuthenticated, authorizedRoles } = require('../middlewares/auth')
const { createNewOrder, getMyOrder, getMyAllOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/order/orderController')
const router = express.Router()



router.route('/orders').post(isUserAuthenticated,createNewOrder).get(isUserAuthenticated,getMyAllOrders)
router.route('/orders/:productId/:quantity').post(isUserAuthenticated,createNewOrder)
router.route('/orders/:id').get(isUserAuthenticated,getMyOrder)
router.route('/admin/orders/all').get(isUserAuthenticated,authorizedRoles('admin'),getAllOrders)
router.route('/admin/orders/:id').patch(isUserAuthenticated,authorizedRoles('admin'),updateOrderStatus).delete(isUserAuthenticated,authorizedRoles('admin'),deleteOrder)



module.exports = router