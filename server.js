require('dotenv').config();

const express = require('express');
const logger = require('./middleware/logger'); // Предполагается, что логгер - это кастомный middleware
const parseJson = require('./middleware/parseJson'); // Предполагается, что parseJson - это кастомный middleware
const cors = require('cors');
const routes = require('./routes/authRoutes');

const app = express();

// Подключение middleware
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Встроенный middleware для парсинга JSON
app.use(parseJson); // Ваш кастомный middleware для парсинга (если нужно)
app.use(logger); // Логирование (если нужно)

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Логирование метода и URL запроса
    next();
});

// Основной маршрут
app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});

// Использование маршрутов для API
app.use('/api', routes);

// Обработчик для 404 ошибок
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.url}`); // Логирование несуществующих маршрутов
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
