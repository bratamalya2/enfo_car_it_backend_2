const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Get all orders (optional filters)
router.get('/', orderController.getAllOrders);

// Trigger allocation (manual trigger, job will auto-run at 8AM too)
router.post('/allocate', orderController.allocateOrders);

// Get orders assigned to an agent
router.get('/agent/:agentId', orderController.getOrdersByAgent);

module.exports = router;
