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

app.get('/', (req, res) => {
    res.send('Welcome to the API server!');
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
