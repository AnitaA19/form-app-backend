const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/uploadMiddleware'); // Импортируйте middleware для загрузки файлов

// Маршрут для создания шаблона с аутентификацией и загрузкой файла
router.post('/create', authenticate, upload, TemplateController.createTemplate);

module.exports = router;
