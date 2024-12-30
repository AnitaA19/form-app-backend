import { STATUS_CODES } from "../constants";

const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};