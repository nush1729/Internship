// backend/routes/fileRoutes.js
const express = require('express');
const multer = require('multer');

const HistoryFile = require('../models/HistoryFile');
const router = express.Router();
const { generateChartSummary } = require('../controllers/excelController');
// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // You can configure the destination here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Route to handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Upload route hit');
  const { userId } = req.body; // Assuming you are sending userId from frontend

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const file = req.file;
    const historyFile = new HistoryFile({
      filename: file.filename,
      userId: userId,
    });
 console.log('File received:', req.file);
 console.log('User ID received:', req.body.userId);
 await historyFile.save();
 res.status(200).json({ message: 'File uploaded successfully.', file: historyFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while uploading file.' });
  }
});

// Route to fetch file history
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userHistory = await HistoryFile.find({ userId }).sort({ uploadedAt: -1 });
    if (!userHistory) {
      return res.status(404).json({ message: 'No history found for this user.' });
    }
    res.status(200).json(userHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching file history.' });
  }
});

// Route to delete a file from history
router.delete('/delete/:userId/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    await HistoryFile.findByIdAndDelete(fileId);
    res.status(200).json({ message: 'File deleted successfully.' });
  }
 catch (err) {
 console.error(err);
    res.status(500).json({ message: 'Server error while deleting file.' });
  }
});

// Route to generate AI summary for chart data
router.post('/summarize-chart-data', generateChartSummary);
module.exports = router;
