const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const validateId = require('../middlewares/validateId');

// Get all warehouses
router.get('/', warehouseController.getAllWarehouses);

// Get warehouse with its agents and orders
router.get('/:warehouseId', validateId('id'), warehouseController.getWarehouseDetails);

module.exports = router;
