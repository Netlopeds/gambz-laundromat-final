const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/staff', require('./routes/staff'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/editlogs', require('./routes/editlogs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
