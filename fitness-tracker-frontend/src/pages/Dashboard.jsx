import { useEffect, useState } from 'react';
import api from '../api/api'; // your axios instance
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ type: '', duration: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', duration: '' });
  const [error, setError] = useState('');

  // Fetch workouts on load
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/api/workouts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkouts(res.data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
      }
    };

    if (token) fetchWorkouts();
  }, [token]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new workout
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/workouts', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkouts(prev => [...prev, res.data]);
      setForm({ type: '', duration: '' });
    } catch (err) {
      console.error('Error adding workout:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkouts(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  const startEditing = (workout) => {
  setEditingId(workout._id);
  setEditForm({ type: workout.type, duration: workout.duration });
};

const cancelEditing = () => {
  setEditingId(null);
  setEditForm({ type: '', duration: '' });
};

const handleEditChange = (e) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const submitEdit = async (id) => {
  try {
    const res = await api.put(`/api/workouts/${id}`, editForm, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update workout in list
    setWorkouts(prev =>
      prev.map(w => (w._id === id ? res.data : w))
    );

    cancelEditing();
  } catch (err) {
    console.error('Error updating workout:', err);
  }
};


  return (
    <div className="min-h-screen w-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">Your Workouts</h2>

        {/* Workout Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            value={form.type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Workout Type (e.g. Running)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="number"
            value={form.duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Add Workout
          </button>
        </form>

        {/* Workout List */}
        <ul className="space-y-4">
          {workouts.map((w) => (
            <li
              key={w._id}
              className="flex justify-between items-center border rounded-md px-4 py-2 shadow-sm"
            >
              <span>
                <strong>{w.type}</strong> - {w.duration} min
              </span>
              <button
                onClick={() => handleDelete(w._id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
