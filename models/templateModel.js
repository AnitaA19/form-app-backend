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

  static create(templateData) {
    const query = `
      INSERT INTO templates (user_id, title, description, theme, image_url, is_public)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      templateData.userId,
      templateData.title,
      templateData.description,
      templateData.theme,
      templateData.image_url,
      templateData.is_public,
    ];

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          console.error('Error creating template:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getById(id) {
    const query = 'SELECT * FROM templates WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('Error retrieving template:', err);
          reject(err);
        } else if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null); // Если запись не найдена
        }
      });
    });
  }

  static update(id, templateData) {
    const query = `
      UPDATE templates
      SET title = ?, description = ?, theme = ?, is_public = ?, image_url = ?
      WHERE id = ?
    `;
    const params = [
      templateData.title,
      templateData.description,
      templateData.theme,
      templateData.is_public,
      templateData.image_url,
      id,
    ];

    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          console.error('Error updating template:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static delete(id) {
    const query = 'DELETE FROM templates WHERE id = ?';

    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('Error deleting template:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Template;
