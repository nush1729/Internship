const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/save', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { chartType, fromExcelFile, chartConfig } = req.body;
    const safeFile = fromExcelFile || chartConfig?.fileName || "unknown";

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.chartRecords.push({ chartType, fromExcelFile: safeFile, chartConfig });
    await user.save();

    res.status(200).json({ message: 'Chart saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/count', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const count = user.chartRecords.length;

    res.status(200).json({ chartCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ charts: user.chartRecords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
