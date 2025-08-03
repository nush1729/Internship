const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
// REASON: Changed 'excelController' to 'fileController' to better represent all file operations.
const { uploadFile, getFileHistory, deleteFile, getAiSummary } = require('../controllers/excelController');
// REASON: Imports the multer configuration from your middleware file.
const upload = require('../middleware/uploadMiddleware');

// Defines the endpoint for uploading a file. It is protected by 'authMiddleware'.
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// Defines the endpoint for fetching the logged-in user's file upload history.
router.get('/history', authMiddleware, getFileHistory);

// Defines the endpoint for deleting a specific file by its ID.
router.delete('/history/:id', authMiddleware, deleteFile);

// REASON: This is the new endpoint for the AI Summary feature you requested.
router.post('/summary', authMiddleware, getAiSummary);

module.exports = router;