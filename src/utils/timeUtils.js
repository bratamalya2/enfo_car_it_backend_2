const calculateWorkDuration = (checkInTime, checkOutTime) => {
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const durationInMilliseconds = checkOut - checkIn;

    if (durationInMilliseconds < 0) {
        throw new Error("Check-out time must be after check-in time.");
    }

    const durationInHours = durationInMilliseconds / (1000 * 60 * 60); // Convert to hours
    return durationInHours;
};

module.exports = {
    calculateWorkDuration,
};
