const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorMiddleware');  // For centralized error handling
require('dotenv').config();

const app = express();
console.log("Server is starting...");
app.use(express.json());
app.use(cors());

// Log to confirm connection to MongoDB
console.log("Connecting to MongoDB...");

// Connect to MongoDB (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');  // Log when the DB is connected
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);  // Log any error in DB connection
  });

app.get('/', (req, res) => {
  console.log('GET request received at /');
  res.send("Fitness Tracker API is running");
});

// Start the server
const PORT = process.env.PORT || 5001;  // Change to 5001 or any available port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);

const workoutRoutes = require('./routes/workouts');
app.use('/api/workouts', workoutRoutes);

// Error Handling Middleware (catch all errors)
app.use(errorHandler);