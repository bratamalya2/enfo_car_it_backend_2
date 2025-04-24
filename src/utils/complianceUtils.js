const { calculateWorkDuration } = require('./timeUtils');
const { haversineDistance } = require('./distanceUtils');

// Constants for compliance
const MAX_WORK_HOURS = 10; // Maximum work hours per day
const MAX_DRIVE_DISTANCE = 100; // Maximum driving distance in kilometers

const checkWorkCompliance = (checkInTime, checkOutTime) => {
    const workDuration = calculateWorkDuration(checkInTime, checkOutTime);
    if (workDuration > MAX_WORK_HOURS) {
        return {
            success: false,
            message: `Agent exceeded the maximum allowed work hours of ${MAX_WORK_HOURS} hours.`,
        };
    }
    return { success: true };
};

const checkDriveCompliance = (warehouseLat, warehouseLon, deliveryLat, deliveryLon) => {
    const distance = haversineDistance(warehouseLat, warehouseLon, deliveryLat, deliveryLon);
    if (distance > MAX_DRIVE_DISTANCE) {
        return {
            success: false,
            message: `Agent exceeded the maximum allowed driving distance of ${MAX_DRIVE_DISTANCE} km.`,
        };
    }
    return { success: true };
};

module.exports = {
    checkWorkCompliance,
    checkDriveCompliance,
};
