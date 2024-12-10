require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/config'); 

const app = express();
console.log(process.env.MYSQL_URL);  
const port = process.env.PORT || 3001;  

app.use(cors());
app.use(bodyParser.json());

app.get('/test-db', (req, res) => {
  db.query('SELECT NOW()', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при выполнении запроса', error: err });
    }
    res.json({ message: 'Подключение успешно', data: results });
  });
});

app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
