require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/config');  

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.status(204));  

app.get('/test-db', (req, res) => {
  db.query('SELECT NOW()', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error executing query', error: err });
    }
    res.json({ message: 'Connection successful', data: results });
  });
});

app.use('/api', authRoutes);  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
