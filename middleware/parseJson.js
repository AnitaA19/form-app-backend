// const express = require('express');

// const parseJson = express.json();

// module.exports = parseJson;

const parseJson = (req, res, next) => {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);  // Parse the string if it's not already an object
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }
  }
  next();
};

module.exports = parseJson;
