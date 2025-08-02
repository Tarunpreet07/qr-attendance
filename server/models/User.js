const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  qrToken: { type: String, default: uuidv4 },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' }
});

module.exports = mongoose.model('User', userSchema);
