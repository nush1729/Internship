const mongoose = require('mongoose');

const HistoryFileSchema = new mongoose.Schema({
  // REASON: Stores the original name of the file (e.g., 'sales_report.xlsx').
  originalName: { type: String, required: true },
  // REASON: Stores the unique filename on the server (e.g., '1678886400000-sales_report.xlsx').
  filename: { type: String, required: true },
  // REASON: Stores the server path, needed for deleting the physical file.
  path: { type: String, required: true },
  // REASON: Stores the file size in bytes.
  size: { type: Number, required: true },
  // REASON: A secure reference linking this file record to the User who uploaded it.
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); // REASON: 'createdAt' will serve as the upload date.

module.exports = mongoose.model('HistoryFile', HistoryFileSchema);