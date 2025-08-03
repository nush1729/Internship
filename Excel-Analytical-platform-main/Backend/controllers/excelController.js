const HistoryFile = require('../models/HistoryFile');
const xlsx = require('xlsx');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// REASON: Initialize the Google AI client with your API key.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Logic to handle a file upload.
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file was uploaded.' });
        const { originalname, filename, path: filePath, size } = req.file;
        const newFile = new HistoryFile({
            originalName: originalname,
            filename: filename,
            path: filePath,
            size: size,
            user: req.user.id,
        });
        await newFile.save();
        // REASON: This block reads the uploaded Excel file and sends its data back to the frontend immediately for visualization.
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        res.status(201).json({ msg: 'File uploaded successfully!', file: newFile, data });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Logic to fetch the file history for the logged-in user.
exports.getFileHistory = async (req, res) => {
    try {
        const files = await HistoryFile.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Logic to delete a file.
exports.deleteFile = async (req, res) => {
    try {
        const file = await HistoryFile.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });
        if (file.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        fs.unlinkSync(file.path);
        await HistoryFile.findByIdAndDelete(req.params.id);
        res.json({ msg: 'File deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Logic for the new AI Summary feature.
exports.getAiSummary = async (req, res) => {
    try {
        const { data, chartType, xAxis, yAxis } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Provide a brief, insightful summary for a ${chartType} chart with X-axis "${xAxis}" and Y-axis "${yAxis}". The data (first 10 rows) is: ${JSON.stringify(data.slice(0, 10))}. Focus on key trends, outliers, and potential insights.`;
        const result = await model.generateContent(prompt);
        res.json({ summary: result.response.text() });
    } catch (err) {
        res.status(500).send('Failed to generate AI summary');
    }
};