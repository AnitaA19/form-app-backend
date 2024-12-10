// app.js
const express = require('express');
const routes = require('./authRoutes');
const logger = require('./middleware/logger');
const parseJson = require('./middleware/parseJson');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(parseJson);
app.use(logger);

app.use('/', routes);

app.post('/data', (req, res) => {
    res.json({
        message: 'Data received!',
        receivedData: req.body,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
