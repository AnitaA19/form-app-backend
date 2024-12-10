const express = require('express');
const logger = require('./middleware/logger'); 
const parseJson = require('./middleware/parseJson'); 

const app = express();

app.use(parseJson);

app.use(logger);

const PORT = process.env.PORT || 3000;

app.post('/data', (req, res) => {
    res.json({
        message: 'Data received!',
        receivedData: req.body, 
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
