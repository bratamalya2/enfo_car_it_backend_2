const express = require('express');
const app = express();
require('dotenv').config();
const cron = require('node-cron');

const allocateOrders = require('./src/jobs/allocation.job');
const agentRoutes = require('./src/routes/agent.routes');
const orderRoutes = require('./src/routes/order.routes');
const warehouseRoutes = require('./src/routes/warehouse.routes');
const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');

// Middleware
app.use(express.json());

app.use(logger);
app.use(errorHandler);

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/warehouses', warehouseRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('🚚 Delivery Management System is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server started at http://localhost:${PORT}`);
});

cron.schedule('0 8 * * *', () => {
    console.log('🕗 8AM Job Triggered');
    allocateOrders();
});
