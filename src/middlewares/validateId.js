const { Prisma } = require('@prisma/client');

const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: `Invalid ${paramName}` });
        }
        next();
    };
};

module.exports = validateId;
