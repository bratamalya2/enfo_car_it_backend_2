const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: Haversine formula to calculate distance between two geo points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = angle => (angle * Math.PI) / 180;
    const R = 6371; // Earth radius in KM

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in KM
};

// Allocation logic
const allocateOrders = async () => {
    console.log('🚀 Running Order Allocation Job...');

    const warehouses = await prisma.warehouse.findMany({
        include: {
            agents: { where: { checkedIn: true } },
            orders: { where: { agentId: null } },
        },
    });

    for (const warehouse of warehouses) {
        const { agents, orders } = warehouse;

        if (agents.length === 0 || orders.length === 0) continue;

        // Sort orders by proximity to warehouse
        const sortedOrders = orders.sort((a, b) => {
            const d1 = calculateDistance(warehouse.latitude, warehouse.longitude, a.latitude, a.longitude);
            const d2 = calculateDistance(warehouse.latitude, warehouse.longitude, b.latitude, b.longitude);
            return d1 - d2;
        });

        // Assign orders to agents based on distance and constraints
        let orderIndex = 0;

        for (const agent of agents) {
            let assignedOrders = [];
            let totalDistance = 0;
            let totalTime = 0;

            while (
                orderIndex < sortedOrders.length &&
                totalTime + 5 <= 600 && // max 600 minutes (10 hours)
                totalDistance + calculateDistance(warehouse.latitude, warehouse.longitude, sortedOrders[orderIndex].latitude, sortedOrders[orderIndex].longitude) <= 100
            ) {
                const order = sortedOrders[orderIndex];
                const distance = calculateDistance(warehouse.latitude, warehouse.longitude, order.latitude, order.longitude);
                assignedOrders.push(order.id);
                totalDistance += distance;
                totalTime += 5; // 5 min per delivery (1 km = 5 min approx.)
                orderIndex++;
            }

            // Update agent + assign orders
            await prisma.agent.update({
                where: { id: agent.id },
                data: {
                    totalKm: totalDistance,
                    totalTime: totalTime,
                    orders: {
                        connect: assignedOrders.map(id => ({ id })),
                    },
                },
            });

            console.log(`📦 Assigned ${assignedOrders.length} orders to agent ${agent.id}`);
        }

        // Mark postponed orders
        const postponedOrders = sortedOrders.slice(orderIndex);
        for (const order of postponedOrders) {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
                },
            });
        }

        console.log(`⏩ Postponed ${postponedOrders.length} orders at warehouse ${warehouse.id}`);
    }

    console.log('✅ Allocation Job Done');
};

module.exports = allocateOrders;
