const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/User');

// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  const { qrToken, sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ message: 'Missing sessionId in request.' });

  try {
    const student = await Student.findOne({ qrToken });
    if (!student) {
      return res.status(404).json({ message: 'Invalid QR token' });
    }

    const existing = await Attendance.findOne({
      studentId: student._id,
      sessionId,
    });

    if (existing) {
      return res.status(200).json({ message: '✅ Attendance already marked' });
    }

    const attendance = await Attendance.create({
      studentId: student._id,
      sessionId,
    });

    res.status(200).json({
      message: `✅ Attendance marked for ${student.name}`,
      attendance,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(200).json({ message: '✅ Attendance already marked (duplicate)' });
    }
    res.status(500).json({ message: '❌ Server error' });
  }
});

module.exports = router;
