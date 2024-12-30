const { STATUS_CODES } = require("../constants");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);
  
    const statusCode = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal server error';
    
    res.status(statusCode).json({ message });
  };
  
  module.exports = errorMiddleware;
  