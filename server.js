require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/config'); // Импортируем db

const app = express();
const port = process.env.PORT || 8080; // Порт, предоставляемый окружением или 8080 по умолчанию

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
