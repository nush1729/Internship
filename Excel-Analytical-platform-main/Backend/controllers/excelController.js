const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Optional: delete file after reading
    fs.unlinkSync(filePath);

    res.status(200).json({ data: jsonData });
  } catch (err) {
    res.status(500).json({ message: "Failed to read Excel file", error: err.message });
  }
};

const generateChartSummary = async (req, res) => {
  try {
    console.log("Received chart data for summary:", req.body);
    res.status(200).json({ message: "Chart data received successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error processing chart data.", error: error.message });
  }
};
module.exports = { uploadExcel, generateChartSummary };
