const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorMiddleware');  // For centralized error handling
require('dotenv').config();

const app = express();
console.log("Server is starting...");

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to handle CORS
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

// Import and use auth routes
// This will handle user authentication routes
app.use('/api/auth', authRoutes);

const workoutRoutes = require('./routes/workouts');
// Import and use workout routes
// This will handle workout-related routes
// Ensure that the workout routes are defined after the auth route
app.use('/api/workouts', workoutRoutes);

// Error Handling Middleware (catch all errors)
app.use(errorHandler);// Add this as the last middleware to catch all errors