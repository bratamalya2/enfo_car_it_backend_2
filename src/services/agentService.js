const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { checkWorkCompliance, checkDriveCompliance } = require('../utils/complianceUtils');
const { calculatePayment } = require('../utils/paymentUtils');

const getAllAgents = () => {
    return prisma.agent.findMany({ include: { warehouse: true } });
};

const getAgentById = (id) => {
    return prisma.agent.findUnique({
        where: { id: parseInt(id) },
        include: { warehouse: true },
    });
};

const createAgent = (data) => {
    return prisma.agent.create({ data });
};

const updateAgent = (id, data) => {
    return prisma.agent.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteAgent = (id) => {
    return prisma.agent.delete({ where: { id: parseInt(id) } });
};

const allocateOrdersToAgent = async (agent, orders) => {
    // Assuming agent has work schedule and is checked in

    let totalDistance = 0;
    let totalOrders = orders.length;

    // Check compliance for each order
    for (let order of orders) {
        const compliance = checkDriveCompliance(agent.warehouse.latitude, agent.warehouse.longitude, order.latitude, order.longitude);
        if (!compliance.success) {
            throw new Error(compliance.message);
        }
        totalDistance += compliance.distance;
    }

    // Calculate the payment for the agent based on the orders delivered
    const payment = calculatePayment(totalOrders);

    // Handle other logic, like updating agent records in DB
    return { payment };
};

module.exports = {
    getAllAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    allocateOrdersToAgent
};
