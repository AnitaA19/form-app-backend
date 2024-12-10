require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/config'); 

const app = express();
const port = process.env.PORT || 8080;

console.log(process.env.MYSQL_URL); // Logs the MySQL connection string for debugging

app.use(cors());
app.use(bodyParser.json());

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
