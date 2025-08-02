// Entry point for Express server
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
try {
  console.log('Loading auth route...');
  app.use('/api/auth', require('./routes/auth'));
} catch (e) {
  console.error('Error loading auth route', e);
}

try {
  console.log('Loading sessions route...');
  app.use('/api/sessions', require('./routes/session'));
} catch (e) {
  console.error('Error loading sessions route', e);
}

try {
  console.log('Loading attendance route...');
  app.use('/api/attendance', require('./routes/attendance'));
} catch (e) {
  console.error('Error loading attendance route', e);
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
