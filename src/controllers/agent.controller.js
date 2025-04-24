const agentService = require('../services/agentService');

// Get all agents
const getAllAgents = async (req, res) => {
    try {
        const agents = await agentService.getAllAgents();
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get an agent by ID
const getAgentById = async (req, res) => {
    const { id } = req.params;
    try {
        const agent = await agentService.getAgentById(id);
        if (!agent) {
            return res.status(404).json({ success: false, message: 'Agent not found' });
        }
        res.status(200).json({ success: true, data: agent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new agent
const createAgent = async (req, res) => {
    const { name, checkedIn, warehouseId } = req.body;
    try {
        const newAgent = await agentService.createAgent({ name, checkedIn, warehouseId });
        res.status(201).json({ success: true, data: newAgent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an agent's details
const updateAgent = async (req, res) => {
    const { id } = req.params;
    const { name, checkedIn, warehouseId } = req.body;
    try {
        const updatedAgent = await agentService.updateAgent(id, { name, checkedIn, warehouseId });
        res.status(200).json({ success: true, data: updatedAgent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an agent
const deleteAgent = async (req, res) => {
    const { id } = req.params;
    try {
        await agentService.deleteAgent(id);
        res.status(200).json({ success: true, message: 'Agent deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkInAgent = async (req, res) => {
    const { agentId } = req.params;
    const { checkInTime } = req.body;  // Expecting check-in time in ISO format

    try {
        // Fetch the agent from the database
        const agent = await agentService.getAgentById(agentId);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found.' });
        }

        // Check if agent is already checked in
        if (agent.checkedIn) {
            return res.status(400).json({ message: 'Agent already checked in.' });
        }

        // Update the agent's check-in time
        const updatedAgent = await agentService.checkInAgent(agentId, checkInTime);

        // Check if the work duration is within the compliance limits (e.g., no more than 10 hours)
        const complianceResult = checkWorkCompliance(agent.checkInTime, checkInTime);
        if (!complianceResult.success) {
            return res.status(400).json({ message: complianceResult.message });
        }

        return res.status(200).json({
            message: 'Agent checked in successfully.',
            agent: updatedAgent,
        });
    } catch (error) {
        console.error('Error checking in agent:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    getAllAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    checkInAgent
};
