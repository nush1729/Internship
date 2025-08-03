const multer = require("multer");
const path = require("path");

// REASON: This configures how and where files are stored on the server.
const storage = multer.diskStorage({
  // REASON: This specifies that all uploaded files should be saved in the 'uploads' folder.
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // REASON: This defines the filename for the saved file. Appending a timestamp ensures every filename is unique, preventing files from being overwritten.
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// REASON: This creates the multer upload instance with the storage configuration.
const upload = multer({ storage: storage });

module.exports = upload;