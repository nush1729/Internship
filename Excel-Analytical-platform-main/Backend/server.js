require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// --- Middleware ---
// REASON FOR CHANGE: Using cors() without any options is the most open configuration and will
// definitively rule out any CORS errors during development.
app.use(cors());
// REASON: This is crucial. It allows your server to correctly parse JSON data sent from the frontend forms.
app.use(express.json());

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));