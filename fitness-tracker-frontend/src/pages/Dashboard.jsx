import { useEffect, useState } from 'react';
import api from '../api/api'; // your axios instance
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ type: '', duration: '' });

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

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Welcome to Your Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <h3>Your Workouts</h3>
      <ul>
        {workouts.map(w => (
          <li key={w._id}>
            <strong>{w.type}</strong> - {w.duration} min
          </li>
        ))}
      </ul>

      <h3>Add Workout</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="type"
          placeholder="Type (e.g. Running)"
          value={form.type}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button type="submit" style={{ width: '100%' }}>
          Add Workout
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
