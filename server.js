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

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
  res.json({ message: 'Backend работает' });
});

app.get('/test-db', (req, res) => {
  db.query('SELECT NOW()', (err, results) => {
    if (err) {
      console.error('Ошибка БД:', err);
      return res.status(500).json({ message: 'Ошибка запроса', error: err });
    }
    res.json({ message: 'Подключение успешно', data: results });
  });
});

app.use('/api', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Внутренняя ошибка сервера', 
    error: err.message 
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
});