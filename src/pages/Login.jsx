import { Link } from 'react-router-dom';

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://150.136.175.145:2278/api/session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();

      // Store token in localStorage
      login(data.token); // This sets it in localStorage and updates context

      // Optionally, store user profile or parts of it if needed
      localStorage.setItem('userProfile', JSON.stringify(data.profile));
      const profile = JSON.parse(localStorage.getItem('userProfile'));
console.log(profile);

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Invalid credentials or server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Login
        </button>
        <div className="mt-4 text-center">
  <p className="text-sm dark:text-gray-300">
    Not Registered Yet?{' '}
    <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">
      Register
    </Link>
  </p>
</div>
      </form>
    </div>
  );
};

export default Login;
