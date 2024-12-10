require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/config');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/test-db', (req, res) => {
  db.query('SELECT NOW()', (err, results) => {
    if (err) {
      console.error('DB Connection Error:', err);
      return res.status(500).json({ message: 'Error executing query', error: err });
    }
    res.json({ message: 'Connection successful', data: results });
  });
});

app.use('/api', authRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});