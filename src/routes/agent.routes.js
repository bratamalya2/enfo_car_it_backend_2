const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const validateId = require('../middlewares/validateId');

// Check in an agent
router.post('/checkin/:agentId', validateId('id'), agentController.checkInAgent);

// Get all agents (optional filter by warehouse)
router.get('/', agentController.getAllAgents);

// Get a single agent by ID
router.get('/:agentId', validateId('id'), agentController.getAgentById);

module.exports = router;
