const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json()); 

app.use('/api', authRoutes); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
