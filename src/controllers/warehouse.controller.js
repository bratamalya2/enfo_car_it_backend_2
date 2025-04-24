const warehouseService = require('../services/warehouseService');

// Get all warehouses
const getAllWarehouses = async (req, res) => {
    try {
        const warehouses = await warehouseService.getAllWarehouses();
        res.status(200).json({ success: true, data: warehouses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a warehouse by ID
const getWarehouseById = async (req, res) => {
    const { id } = req.params;
    try {
        const warehouse = await warehouseService.getWarehouseById(id);
        if (!warehouse) {
            return res.status(404).json({ success: false, message: 'Warehouse not found' });
        }
        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new warehouse
const createWarehouse = async (req, res) => {
    const { name, latitude, longitude } = req.body;
    try {
        const newWarehouse = await warehouseService.createWarehouse({ name, latitude, longitude });
        res.status(201).json({ success: true, data: newWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update warehouse details
const updateWarehouse = async (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;
    try {
        const updatedWarehouse = await warehouseService.updateWarehouse(id, { name, latitude, longitude });
        res.status(200).json({ success: true, data: updatedWarehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete warehouse
const deleteWarehouse = async (req, res) => {
    const { id } = req.params;
    try {
        await warehouseService.deleteWarehouse(id);
        res.status(200).json({ success: true, message: 'Warehouse deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getWarehouseDetails = async (req, res) => {
    try {
        // Get warehouse ID from request parameters
        const { warehouseId } = req.params;

        // Fetch the warehouse details along with orders and agents
        const warehouseDetails = await warehouseService.getWarehouseDetails(warehouseId);

        // If warehouse is not found
        if (!warehouseDetails) {
            return res.status(404).json({ message: 'Warehouse not found.' });
        }

        // Return the warehouse details
        return res.status(200).json({
            message: 'Warehouse details retrieved successfully.',
            warehouse: warehouseDetails,
        });
    } catch (error) {
        console.error('Error fetching warehouse details:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseDetails
};
