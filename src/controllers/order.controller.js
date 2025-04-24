const orderService = require('../services/orderService');
const agentService = require('../services/agentService');
const { calculateDistance } = require('../utils/locationUtils');
const { checkWorkCompliance, checkDistanceCompliance } = require('../utils/complianceUtils');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new order
const createOrder = async (req, res) => {
    const { itemDetails, address, latitude, longitude, warehouseId } = req.body;
    try {
        const newOrder = await orderService.createOrder({ itemDetails, address, latitude, longitude, warehouseId });
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an order's details
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { itemDetails, address, latitude, longitude, warehouseId } = req.body;
    try {
        const updatedOrder = await orderService.updateOrder(id, { itemDetails, address, latitude, longitude, warehouseId });
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await orderService.deleteOrder(id);
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get unassigned orders for a specific warehouse
const getUnassignedOrders = async (req, res) => {
    const { warehouseId } = req.params;
    try {
        const orders = await orderService.getUnassignedOrders(warehouseId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const allocateOrders = async (req, res) => {
    try {
        // Fetch all orders that need to be allocated
        const orders = await orderService.getPendingOrders();

        if (orders.length === 0) {
            return res.status(200).json({ success: false, message: 'No pending orders to allocate.' });
        }

        // Fetch all agents who are checked in
        const agents = await agentService.getCheckedInAgents();

        if (agents.length === 0) {
            return res.status(400).json({ success: false, message: 'No agents available for allocation.' });
        }

        // Allocate orders to agents
        let allocationResult = [];
        let unallocatedOrders = [...orders];

        for (let agent of agents) {
            let agentOrders = [];
            let totalWorkTime = 0; // in minutes
            let totalDistance = 0; // in km

            // Try to allocate orders to the agent until the limits are hit
            for (let i = 0; i < unallocatedOrders.length; i++) {
                const order = unallocatedOrders[i];

                // Calculate distance and work time for the order
                const distance = calculateDistance(agent.warehouseLocation, order.deliveryAddress);
                const estimatedTime = distance * 5; // 5 minutes per km (approx)

                // Check compliance with work time and distance
                if (checkWorkCompliance(totalWorkTime + estimatedTime) && checkDistanceCompliance(totalDistance + distance)) {
                    // Assign the order to the agent
                    agentOrders.push(order);
                    totalWorkTime += estimatedTime;
                    totalDistance += distance;

                    // Remove the allocated order from the list
                    unallocatedOrders.splice(i, 1);
                    i--; // Adjust index after removal
                } else {
                    // If the agent cannot take more orders due to compliance, stop assigning more orders
                    break;
                }
            }

            // Save the allocated orders for the agent
            if (agentOrders.length > 0) {
                const updatedAgent = await agentService.allocateOrdersToAgent(agent.id, agentOrders);
                allocationResult.push({
                    agentId: agent.id,
                    allocatedOrders: agentOrders,
                    totalDistance,
                    totalWorkTime,
                    agent: updatedAgent,
                });
            }

            // If no more orders left to allocate, break out of the loop
            if (unallocatedOrders.length === 0) {
                break;
            }
        }

        // Return the allocation results
        return res.status(200).json({
            success: true,
            message: 'Orders allocated successfully.',
            allocationResult,
            unallocatedOrders, // The remaining orders that couldn't be allocated
        });
    } catch (error) {
        console.error('Error allocating orders:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getOrdersByAgent = async (req, res) => {
    try {
        // Get agent ID from request parameters
        const { agentId } = req.params;

        // Fetch the orders assigned to the given agent
        const orders = await orderService.getOrdersForAgent(parseInt(agentId));

        // Return the list of orders
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders for agent:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUnassignedOrders,
    allocateOrders,
    getOrdersByAgent
};
