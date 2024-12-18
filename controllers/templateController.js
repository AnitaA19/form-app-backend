const Template = require('../models/templateModel');
const upload = require('../middleware/uploadMiddleware');

class TemplateController {
  static createTemplate(req, res) {
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

    Template.create(newTemplate, (err, result) => {
      if (err) {
        console.error('Error creating template:', err);
        return res.status(500).json({ message: 'Failed to create template' });
      }

      const template_id = result.insertId;  

      res.status(201).json({ 
        message: 'Template created successfully', 
        template_id: template_id 
      });
    });
  }
}

module.exports = TemplateController;
