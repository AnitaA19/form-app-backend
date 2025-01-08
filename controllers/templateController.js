const Template = require('../models/templateModel');
const upload = require('../middleware/uploadMiddleware');
const { STATUS_CODES } = require('../constants');

class TemplateController {
  static async createTemplate(req, res) {
    try {
      console.log('Received body:', req.body); 
      console.log('Received file:', req.file);

      const { title, description, theme, is_public } = req.body;
      const imageUrl = req.file ? req.file.filename : null;

      if (!title || !description || !theme || is_public === undefined || !imageUrl) {
        console.error('Validation failed:', { title, description, theme, is_public, imageUrl });
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Missing required fields' });
      }

      const validThemes = ['data-science', 'front', 'back', 'devops', 'database'];
      if (!validThemes.includes(theme)) {
        console.error('Invalid theme value:', theme);
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid theme value' });
      }

      const user_id = req.user.userId;

      const newTemplate = new Template(user_id, title, description, theme, imageUrl, is_public);
      const result = await Template.create(newTemplate);

      res.status(STATUS_CODES.CREATED).json({
        message: 'Template created successfully',
        template_id: result.insertId,
      });
    } catch (err) {
      console.error('Error creating template:', err);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create template' });
    }
  }

  static async getTemplateById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Template ID is required' });
      }

      const template = await Template.getById(id);

      if (!template) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Template not found' });
      }

      res.status(STATUS_CODES.SUCCESS).json({
        message: 'Template retrieved successfully',
        template,
      });
    } catch (err) {
      console.error('Error retrieving template:', err);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Failed to retrieve template' });
    }
  }

  static async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const { title, description, theme, is_public } = req.body;
      const imageUrl = req.file ? req.file.filename : null;

      if (!id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Template ID is required' });
      }

      if (!title || !description || !theme || is_public === undefined) {
        console.error('Validation failed:', { title, description, theme, is_public, imageUrl });
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Missing required fields' });
      }

      const validThemes = ['data-science', 'front', 'back', 'devops', 'database'];
      if (!validThemes.includes(theme)) {
        console.error('Invalid theme value:', theme);
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Invalid theme value' });
      }

      const templateData = { title, description, theme, is_public, image_url: imageUrl };
      await Template.update(id, templateData);

      res.status(STATUS_CODES.SUCCESS).json({
        template_id: id,
      });
    } catch (err) {
      console.error('Error updating template:', err);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update template' });
    }
  }

  static async deleteTemplate(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Template ID is required' });
      }

      const template = await Template.getById(id);
      if (!template) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'Template not found' });
      }

      await Template.delete(id);

      res.status(STATUS_CODES.SUCCESS).json({
        message: 'Template deleted successfully',
        template_id: id,
      });
    } catch (err) {
      console.error('Error deleting template:', err);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete template' });
    }
  }
}

module.exports = TemplateController;
