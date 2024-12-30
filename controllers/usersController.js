const connection = require('../config/config');  
const { STATUS_CODES } = require('../constants');

const getUsers = (req, res) => {
  const query = 'SELECT * FROM authUser';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
    }
    return res.status(STATUS_CODES.SUCCESS).json(results);
  });
};

const deleteUser = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'User ID is required' });
  }

  const query = 'DELETE FROM authUser WHERE id = ?';
  
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User deleted successfully' });
  });
};

const makeAdmin = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User ID is required' });
  }

  const query = 'UPDATE authUser SET role = ? WHERE id = ?';
  
  connection.query(query, ['admin', userId], (err, result) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error updating role' });
    }
    if (result.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User made admin successfully' });
  });
};

const revokeAdmin = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'User ID is required' });
  }

  const query = 'UPDATE authUser SET role = ? WHERE id = ?';
  
  connection.query(query, ['user', userId], (err, result) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Error updating role' });
    }
    if (result.affectedRows === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    }
    return res.status(STATUS_CODES.SUCCESS).json({ message: 'Admin role revoked successfully' });
  });
};

module.exports = { getUsers, deleteUser, makeAdmin, revokeAdmin };
