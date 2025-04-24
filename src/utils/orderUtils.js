// This function calculates the average number of orders an agent should deliver per hour
const calculateAverageOrdersPerHour = (totalOrders, totalWorkHours) => {
    if (totalWorkHours <= 0) {
        throw new Error('Total work hours must be greater than zero.');
    }
    return totalOrders / totalWorkHours;
};

module.exports = {
    calculateAverageOrdersPerHour,
};
