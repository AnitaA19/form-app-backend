const Template = require('../models/templateModel');
const upload = require('../middleware/uploadMiddleware');

class TemplateController {
  static async createTemplate(req, res) {
    try {
      console.log('Received body:', req.body); 
      console.log('Received file:', req.file);

      const { title, description, theme, is_public } = req.body;
      const imageUrl = req.file ? req.file.filename : null;

      if (!title || !description || !theme || is_public === undefined || !imageUrl) {
        console.error('Validation failed:', { title, description, theme, is_public, imageUrl });
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const validThemes = ['data-science', 'front', 'back', 'devops', 'database'];
      if (!validThemes.includes(theme)) {
        console.error('Invalid theme value:', theme);
        return res.status(400).json({ message: 'Invalid theme value' });
      }

      const user_id = req.user.userId;

      const newTemplate = new Template(user_id, title, description, theme, imageUrl, is_public);
      const result = await Template.create(newTemplate);

      res.status(201).json({
        message: 'Template created successfully',
        template_id: result.insertId,
      });
    } catch (err) {
      console.error('Error creating template:', err);
      res.status(500).json({ message: 'Failed to create template' });
    }
  }

  static async getTemplateById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Template ID is required' });
      }

      const template = await Template.getById(id);

      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      res.status(200).json({
        message: 'Template retrieved successfully',
        template,
      });
    } catch (err) {
      console.error('Error retrieving template:', err);
      res.status(500).json({ message: 'Failed to retrieve template' });
    }
  }

  static async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const { title, description, theme, is_public } = req.body;
      const imageUrl = req.file ? req.file.filename : null;

      if (!id) {
        return res.status(400).json({ message: 'Template ID is required' });
      }

      if (!title || !description || !theme || is_public === undefined) {
        console.error('Validation failed:', { title, description, theme, is_public, imageUrl });
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const validThemes = ['data-science', 'front', 'back', 'devops', 'database'];
      if (!validThemes.includes(theme)) {
        console.error('Invalid theme value:', theme);
        return res.status(400).json({ message: 'Invalid theme value' });
      }

      const templateData = { title, description, theme, is_public, image_url: imageUrl };
      await Template.update(id, templateData);

      res.status(200).json({
        message: 'Template updated successfully',
        template_id: id,
      });
    } catch (err) {
      console.error('Error updating template:', err);
      res.status(500).json({ message: 'Failed to update template' });
    }
  }

  static async deleteTemplate(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Template ID is required' });
      }

      const template = await Template.getById(id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      await Template.delete(id);

      res.status(200).json({
        message: 'Template deleted successfully',
        template_id: id,
      });
    } catch (err) {
      console.error('Error deleting template:', err);
      res.status(500).json({ message: 'Failed to delete template' });
    }
  }
}

module.exports = TemplateController;
