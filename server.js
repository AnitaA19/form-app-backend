require('dotenv').config();

const express = require('express');
const logger = require('./middleware/logger'); 
const parseJson = require('./middleware/parseJson'); 
const cors = require('cors');
const routes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(parseJson);
app.use(logger);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); 
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});

app.use('/api', routes);


app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.url}`); 
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
