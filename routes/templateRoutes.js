const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Routes for templates
router.post('/templates', templateController.createTemplate);  // Create template
router.get('/templates', templateController.getAllTemplates);  // Get all templates
router.get('/templates/:id', templateController.getTemplateById);  // Get template by ID
router.put('/templates/:id', templateController.updateTemplate);  // Update template
router.delete('/templates/:id', templateController.deleteTemplate);  // Delete template

module.exports = router;
