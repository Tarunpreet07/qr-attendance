const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, sessionId: 1 }, { unique: true }); // 👈 Enforces unique per session

module.exports = mongoose.model('Attendance', attendanceSchema);
