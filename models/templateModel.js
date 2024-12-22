const db = require('../config/config'); 

class Template {
  constructor(userId, title, description = null, theme, image_url = null, is_public = 0) {
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.theme = theme;
    this.image_url = image_url;
    this.is_public = is_public;
  }

  static create(templateData, callback) {
    const query = `
      INSERT INTO templates (user_id, title, description, theme, image_url, is_public)
      VALUES ( ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      templateData.userId,
      templateData.title,
      templateData.description,
      templateData.theme,
      templateData.image_url,
      templateData.is_public,
    ];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error creating template:', err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  
}


module.exports = Template;
