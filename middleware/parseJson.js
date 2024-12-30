// const express = require('express');

const { STATUS_CODES } = require("../constants");

// const parseJson = express.json();

// module.exports = parseJson;

const parseJson = (req, res, next) => {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);  
    } catch (error) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: 'Invalid JSON format' });
    }
  }
  next();
};

module.exports = parseJson;
