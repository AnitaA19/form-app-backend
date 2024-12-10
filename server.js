require('dotenv').config(); 

const express = require('express');
const logger = require('./middleware/logger'); 
const parseJson = require('./middleware/parseJson');
const routes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(parseJson); 
app.use(logger);

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
