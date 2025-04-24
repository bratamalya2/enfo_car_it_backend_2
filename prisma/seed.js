const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NUM_WAREHOUSES = 10;
const AGENTS_PER_WAREHOUSE = 20;
const ORDERS_PER_AGENT = 60;

const getRandomCoords = () => ({
    latitude: parseFloat((28 + Math.random()).toFixed(6)),
    longitude: parseFloat((77 + Math.random()).toFixed(6)),
});

const generateOrderNumber = (index) => `ORD-${1000 + index}`;

const seed = async () => {
    try {
        console.log('🚨 Clearing existing data...');
        await prisma.order.deleteMany();
        await prisma.agent.deleteMany();
        await prisma.warehouse.deleteMany();

        let totalOrderCount = 0;

        console.log('🏗️ Seeding data...');

        for (let w = 1; w <= NUM_WAREHOUSES; w++) {
            const warehouse = await prisma.warehouse.create({
                data: {
                    name: `Warehouse ${w}`,
                    city: `Area ${w}`,
                },
            });

            for (let a = 1; a <= AGENTS_PER_WAREHOUSE; a++) {
                const agent = await prisma.agent.create({
                    data: {
                        name: `Agent-${w}-${a}`,
                        warehouseId: warehouse.id,
                        checkedIn: false,
                        totalKm: 0,
                        totalTime: 0,
                        phone: `XXXXXX-XXXX-XXX${a}-${Math.floor(Math.random() * 100)}`
                    },
                });

                for (let o = 1; o <= ORDERS_PER_AGENT; o++) {
                    const coords = getRandomCoords();

                    await prisma.order.create({
                        data: {
                            address: `Street ${o}, Zone ${w}`,
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            warehouseId: warehouse.id,
                            agentId: null,
                            deliveryDate: new Date()
                        },
                    });

                    totalOrderCount++;
                }
            }
        }

        console.log(`✅ Seed completed. Total orders created: ${totalOrderCount}`);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();
