// server/src/app.js

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Sample route for test
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

module.exports = app;
