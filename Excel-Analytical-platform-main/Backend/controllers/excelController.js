const HistoryFile = require('../models/HistoryFile');
const xlsx = require('xlsx');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file was uploaded.' });
        }
        const { originalname, filename, path: filePath, size } = req.file;
        const newFile = new HistoryFile({
            originalName: originalname,
            filename: filename,
            path: filePath,
            size: size,
            user: req.user.id,
        });
        await newFile.save();

        // --- REASON FOR CHANGE: This is the corrected and more robust parsing logic ---
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // REASON: Using {header: 1} converts the sheet into an array of arrays. This is a more reliable way to read raw data.
        const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // REASON: This is a critical check. If the file is empty or unreadable, we stop here and send an error.
        if (!rows || rows.length === 0) {
            return res.status(400).json({ msg: 'Could not read any data from the Excel file. It might be empty or corrupted.' });
        }

        // REASON: This converts the array of arrays into an array of objects, using the first row as the keys (headers).
        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            let rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });
        // --- END OF CORRECTED LOGIC ---

        res.status(201).json({ msg: 'File uploaded successfully!', file: newFile, data });
    } catch (err) {
        console.error("UPLOAD ERROR:", err.message);
        res.status(500).json({ msg: 'A server error occurred during file processing.' });
    }
};

// --- The rest of the functions are correct and do not need to be changed ---
exports.getFileHistory = async (req, res) => {
    try {
        const files = await HistoryFile.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

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