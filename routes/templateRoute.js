const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/uploadMiddleware'); 

router.post('/create', authenticate, upload, TemplateController.createTemplate);

module.exports = router;
