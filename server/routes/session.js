const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const QRCode = require('qrcode');

// Admin creates session
router.post('/create', async (req, res) => {
  const sessionCode = require('uuid').v4();
  const session = await Session.create({ title: req.body.title, sessionCode });
  const qrData = JSON.stringify({ sessionCode });
  QRCode.toDataURL(qrData, (err, qr) => res.json({ session, qr }));
});

// Public get all sessions
router.get('/', async (req, res) => {
  const sessions = await Session.find();
  res.json(sessions);
});

module.exports = router;
