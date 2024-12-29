const connection = require('../config/config');  // Import the connection from the config file

// Controller function to get all users
const getUsers = (req, res) => {
  const query = 'SELECT * FROM authUser';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    return res.status(200).json(results);
  });
};

// Controller function to delete a user
const deleteUser = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = 'DELETE FROM authUser WHERE id = ?';
  
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  });
};

// Controller function to make a user admin
const makeAdmin = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = 'UPDATE authUser SET role = ? WHERE id = ?';
  
  connection.query(query, ['admin', userId], (err, result) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(500).json({ message: 'Error updating role' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User made admin successfully' });
  });
};

// Controller function to revoke a user's admin role
const revokeAdmin = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = 'UPDATE authUser SET role = ? WHERE id = ?';
  
  connection.query(query, ['user', userId], (err, result) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(500).json({ message: 'Error updating role' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Admin role revoked successfully' });
  });
};

module.exports = { getUsers, deleteUser, makeAdmin, revokeAdmin };
