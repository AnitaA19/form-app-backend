const express = require('express');
const cors = require('cors');
const routes = require('./routes/authRoutes');
const parseJson = require('./middleware/parseJson'); 

const app = express();

app.use(cors());
app.use(parseJson);  

app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
