const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const path = require('path'); // If not already present

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Increase payload limits for file uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Serve /uploads folder statically
app.use('/uploads', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or specify your frontend origin
  next();
}, express.static(path.join(__dirname, 'uploads')));

const uploadRoute = require('./routes/upload');
const chartRoute = require('./routes/chartRoute');
const adminRoutes = require("./routes/adminRoute")
const userRoutes = require("./routes/user")
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', uploadRoute);
app.use('/api/chart', chartRoute);
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});