import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(import.meta.env.VITE_ADMIN_USERNAME, import.meta.env.VITE_ADMIN_PASSWORD)
    try {
      // Verify against environment variables
      if (username === import.meta.env.VITE_ADMIN_USERNAME && 
          password === import.meta.env.VITE_ADMIN_PASSWORD) {
        // Store admin status in localStorage
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin-dashboard');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 overflow-x-hidden flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Admin Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Admin Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter admin username"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Admin Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                <Link to="/login" className="text-white hover:text-blue-300 font-medium transition-colors duration-300">
                  Back to User Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Splash Text */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-900/50 to-black/50">
        <div className="max-w-lg text-center">
          <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            BidSphere Admin Portal
          </h1>
          <p className="text-xl text-blue-200 leading-relaxed animate-fade-in-delay">
            Access the administrative dashboard to manage users, monitor activities, and control platform settings.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;