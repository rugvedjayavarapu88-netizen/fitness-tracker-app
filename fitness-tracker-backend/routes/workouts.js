const express = require('express');
const Workout = require('../models/Workout');
const { protect } = require('../middleware/authMiddleware'); // Protect middleware to check for JWT token
const router = express.Router();

// Create a new workout (POST request)
router.post('/', protect, async (req, res) => {
  const { type, duration } = req.body;

  try {
    // Create a new workout
    const newWorkout = new Workout({
      user: req.user, // User ID from the JWT token
      type,
      duration,
    });

    // Save the workout to the database
    await newWorkout.save();

    // Respond with the created workout
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all workouts for the authenticated user (GET request)
router.get('/', protect, async (req, res) => {
  try {
    // Find all workouts for the logged-in user
    const workouts = await Workout.find({ user: req.user }).sort({ date: -1 }); // Sort by date (newest first)

    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a workout (PUT request)
router.put('/:id', protect, async (req, res) => {
  const { type, duration } = req.body;

  try {
    // Find the workout by its ID and make sure it belongs to the user
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update the workout details
    workout.type = type || workout.type;
    workout.duration = duration || workout.duration;

    // Save the updated workout
    await workout.save();

    res.status(200).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout (DELETE request)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find the workout by its ID and make sure it belongs to the user
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
