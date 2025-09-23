const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../multerConfig');

router.post('/upload', verifyToken, upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded or invalid format.');

    const email = req.user?.email;
    const userId = req.user?.id;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Invalid user token' });
    }

    console.log('File upload attempt:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      userId: userId
    });

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      return res.status(500).json({ 
        error: 'File upload failed - file not found',
        message: 'The uploaded file could not be located on the server'
      });
    }

    console.log('Reading file from:', filePath);
    const workbook = XLSX.readFile(filePath);
    
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      console.error('Invalid workbook or no sheets found');
      return res.status(400).json({
        error: 'Invalid Excel file',
        message: 'The file appears to be corrupted or contains no sheets'
      });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    if (!sheet) {
      console.error('Sheet not found:', sheetName);
      return res.status(400).json({
        error: 'Invalid Excel file',
        message: 'Could not read the first sheet of the Excel file'
      });
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // raw 2D array
    
    if (!data || data.length === 0) {
      console.error('No data found in Excel sheet');
      return res.status(400).json({
        error: 'Empty Excel file',
        message: 'The Excel file appears to be empty or contains no data'
      });
    }

    const rowCount = data.length;
    const columnCount = data[0]?.length || 0;

    const fileSizeKB = parseFloat((req.file.size / 1024).toFixed(2));

    console.log('Processing data:', {
      rowCount,
      columnCount,
      fileSizeKB
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyUploaded = user.excelRecords.some(
      (record) => record.filename === req.file.filename
    );


    if (alreadyUploaded) {
      return res.status(200).json({
        message: 'File already uploaded previously. Ignoring DB insertion.',
        filename: req.file.filename,
        fileSize: fileSizeKB + ' KB',
        uploaderEmail: email,
        rowCount,
        columnCount,
        data: data.slice(0, 5) // Return first 5 rows as preview
      });
    }

    // Generate a unique file ID for database storage
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Only add to DB if it's a new file
    user.excelRecords.push({
      fileId: fileId,
      uploaderEmail: email,
      filename: req.file.originalname || req.file.filename,
      storedFilename: req.file.filename, // Store the actual filename on disk
      filesize: fileSizeKB,
      data: data,
      rows: rowCount,
      columns: columnCount,
      uploadedBy: userId,
      uploadedAt: new Date(),
      filePath: `/uploads/${req.file.filename}` // Store relative path for serving
    });

    await user.save();
    
    console.log('File successfully processed and saved to database');

    res.status(200).json({
      message: 'File uploaded and saved to user document',
      fileId: fileId,
      filename: req.file.originalname || req.file.filename,
      fileSize: fileSizeKB + ' KB',
      data: data.slice(0, 10), // Return first 10 rows as preview
      uploaderEmail: email,
      rowCount,
      columnCount,
      filePath: `/uploads/${req.file.filename}`
    });

  } catch (error) {
    console.error('Error processing file:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up file if it exists and there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('Cleaned up file after error:', filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file after error:', cleanupError);
      }
    }
    
    res.status(500).json({
      error: 'Server error while processing file',
      message: error.message || 'An unexpected error occurred while processing your file',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete file endpoint
router.delete('/files/:fileId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.fileId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the file in user's excelRecords
    const fileIndex = user.excelRecords.findIndex(
      record => record._id.toString() === fileId
    );

    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileRecord = user.excelRecords[fileIndex];
    
    // Remove the file from filesystem if it exists
    const filePath = path.join(__dirname, '..', 'uploads', fileRecord.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (fsError) {
        console.error('Error deleting physical file:', fsError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Remove charts created from this file
    user.chartRecords = user.chartRecords.filter(
      chart => chart.fromExcelFile !== fileRecord.filename
    );

    // Remove the file record from user's excelRecords
    user.excelRecords.splice(fileIndex, 1);
    
    await user.save();

    res.status(200).json({
      message: 'File deleted successfully',
      deletedFile: fileRecord.filename
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      message: 'Error deleting file',
      error: error.message
    });
  }
});

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // token gives id as 'id', not '_id'
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User chartRecords:", user.chartRecords);

    res.status(200).json({
      message: 'Dashboard data fetched successfully',
      records: user.excelRecords.map(record => {
        const chartsLinked = user.chartRecords.filter(
          chart =>
            chart.fromExcelFile?.toLowerCase().trim() ===
            record.filename?.toLowerCase().trim()
        ).length;
        
        return {
          id: record._id,
          fileId: record.fileId,
          filename: record.filename,
          storedFilename: record.storedFilename,
          filesize: record.filesize + ' KB',
          uploadedAt: record.uploadedAt,
          rows: record.rows,
          columns: record.columns,
          charts: chartsLinked, 
          filePath: record.filePath || `/uploads/${record.storedFilename || record.filename}`,
          hasOriginalFile: true // Indicate that original file is available
        };
      })
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

// New endpoint to serve file data for chart creation
router.get('/file/:fileId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.fileId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the file record
    const fileRecord = user.excelRecords.find(record => 
      record._id.toString() === fileId || record.fileId === fileId
    );

    if (!fileRecord) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if we have the data stored in the database
    if (fileRecord.data && fileRecord.data.length > 0) {
      return res.status(200).json({
        success: true,
        filename: fileRecord.filename,
        data: fileRecord.data,
        rows: fileRecord.rows,
        columns: fileRecord.columns,
        source: 'database'
      });
    }

    // If no data in database, try to read from file system
    const storedFilename = fileRecord.storedFilename || fileRecord.filename;
    const filePath = path.join(__dirname, '..', 'uploads', storedFilename);
    
    if (fs.existsSync(filePath)) {
      try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        return res.status(200).json({
          success: true,
          filename: fileRecord.filename,
          data: data,
          rows: data.length,
          columns: data[0]?.length || 0,
          source: 'filesystem'
        });
      } catch (readError) {
        console.error('Error reading file from filesystem:', readError);
      }
    }

    return res.status(404).json({ 
      message: 'File data not available',
      error: 'Could not retrieve file data from database or filesystem'
    });

  } catch (error) {
    console.error('Error retrieving file data:', error);
    res.status(500).json({ 
      message: 'Error retrieving file data', 
      error: error.message 
    });
  }
});

module.exports = router;