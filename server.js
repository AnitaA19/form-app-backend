require('dotenv').config();
const express = require('express');
const path = require('path'); // Import the path module
const logger = require('./middleware/logger'); 
const parseJson = require('./middleware/parseJson'); 
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 
const templateRoutes = require('./routes/templateRoute');
const questionRoutes = require('./routes/questionRoutes'); 
const userRoutes = require('./routes/userRoute'); 

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(parseJson); 
app.use(logger); 

app.get('/', (req, res) => {
  res.send('Welcome to the API server!');
});

app.use('/api', authRoutes); 
app.use('/api/templates', templateRoutes);
app.use('/api', questionRoutes); 
app.use('/api', userRoutes);

app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' }); 
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});