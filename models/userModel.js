const crypto = require('crypto');
const connection = require('../config/config');  

class User {
  constructor(email, password, id = null) {
    this.email = email;
    this.password = password;
    this.id = id;
  }

  static hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static findByEmail(email, callback) {
    const query = 'SELECT * FROM authUser WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error while fetching user by email:', err);
        return callback(err);
      }
      return callback(null, results);
    });
  }

  static create(email, password, callback) {
    const hashedPassword = User.hashPassword(password);
    const query = 'INSERT INTO authUser (email, password) VALUES (?, ?)';
    connection.query(query, [email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error while inserting new user:', err);
        return callback(err);
      }
      return callback(null, { id: results.insertId });
    });
  }

  static comparePassword(password, hashedPassword, callback) {
    const hashedInputPassword = User.hashPassword(password);
    return callback(null, hashedInputPassword === hashedPassword);
  }

  static updatePassword(userId, newPassword, callback) {
    const hashedPassword = User.hashPassword(newPassword);
    const query = 'UPDATE authUser SET password = ? WHERE ID = ?';
    connection.query(query, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error('Error while updating password:', err);
        return callback(err);
      }
      return callback(null, results);
    });
  }
}

module.exports = User;
