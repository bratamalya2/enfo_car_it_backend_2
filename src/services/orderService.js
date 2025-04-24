const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { calculateAverageOrdersPerHour } = require('../utils/orderUtils');

const getAllOrders = () => {
    return prisma.order.findMany({ include: { warehouse: true, agent: true } });
};

const getOrderById = (id) => {
    return prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: { warehouse: true, agent: true },
    });
};

const createOrder = (data) => {
    return prisma.order.create({ data });
};

const updateOrder = (id, data) => {
    return prisma.order.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteOrder = (id) => {
    return prisma.order.delete({ where: { id: parseInt(id) } });
};

const getUnassignedOrders = (warehouseId) => {
    return prisma.order.findMany({
        where: {
            warehouseId: parseInt(warehouseId),
            assigned: false,
        },
    });
};

const getOrdersForAgent = async (agentId) => {
    const orders = await prisma.order.findMany({
        where: {
            agentId,
        },
        include: {
            warehouse: true,
        },
        orderBy: {
            deliveryDate: 'asc',
        },
    });

    return orders;
};

const assignOrdersToAgents = async (agents, orders, totalWorkHours) => {
    const averageOrdersPerHour = calculateAverageOrdersPerHour(orders.length, totalWorkHours);

    // Further logic for order assignment, checking compliance, etc.
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getUnassignedOrders,
    getOrdersForAgent
};
