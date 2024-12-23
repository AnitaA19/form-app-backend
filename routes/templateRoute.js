const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/uploadMiddleware');

router.post('/create', authenticate, upload, TemplateController.createTemplate);

router.get('/:id', TemplateController.getTemplateById);

router.put('/:id', authenticate, upload, TemplateController.updateTemplate);

router.delete('/:id', authenticate, TemplateController.deleteTemplate);

module.exports = router;
