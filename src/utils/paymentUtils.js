const calculatePayment = (ordersDelivered) => {
    if (ordersDelivered < 25) {
        return 500; // Minimum guarantee
    } else if (ordersDelivered >= 25 && ordersDelivered < 50) {
        return 500 + (ordersDelivered * 35); // 35 INR per order for 25+ orders
    } else {
        return 500 + (ordersDelivered * 42); // 42 INR per order for 50+ orders
    }
};

module.exports = {
    calculatePayment,
};
