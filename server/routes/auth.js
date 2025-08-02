const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const QRCode = require('qrcode'); // ✅ Add QRCode module
const router = express.Router();

// REGISTER or GET QR
router.post('/register', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const qrToken = uuidv4();
      user = await User.create({ name, email, qrToken, role });
    }

    // ✅ Generate QR code from the user's qrToken
    const qrData = JSON.stringify({ qrToken: user.qrToken });
    QRCode.toDataURL(qrData, (err, qrUrl) => {
      if (err) return res.status(500).json({ message: 'QR generation failed' });
      res.status(200).json({ user, qrUrl });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
