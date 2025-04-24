const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllWarehouses = () => {
    return prisma.warehouse.findMany({ include: { agents: true, orders: true } });
};

const getWarehouseById = (id) => {
    return prisma.warehouse.findUnique({
        where: { id: parseInt(id) },
        include: { agents: true, orders: true },
    });
};

const createWarehouse = (data) => {
    return prisma.warehouse.create({ data });
};

const updateWarehouse = (id, data) => {
    return prisma.warehouse.update({
        where: { id: parseInt(id) },
        data,
    });
};

const deleteWarehouse = (id) => {
    return prisma.warehouse.delete({ where: { id: parseInt(id) } });
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
