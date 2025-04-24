const calculateDistance = (warehouseLocation, deliveryAddress) => {
    const R = 6371; // Radius of the Earth in kilometers

    // Convert degrees to radians
    const dLat = (deliveryAddress.lat - warehouseLocation.lat) * Math.PI / 180;
    const dLng = (deliveryAddress.lng - warehouseLocation.lng) * Math.PI / 180;

    // Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(warehouseLocation.lat * Math.PI / 180) * Math.cos(deliveryAddress.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate distance in kilometers
    const distance = R * c;

    return distance;
};

module.exports = {
    calculateDistance,
};