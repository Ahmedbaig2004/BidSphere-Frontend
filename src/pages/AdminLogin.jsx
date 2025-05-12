import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const responseText = await res.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText };
      }

      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Invalid admin credentials', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          throw new Error('Invalid credentials');
        } else {
          toast.error(`Login failed: ${data.message || 'Server error'}`, {
            position: "top-right",
            autoClose: 3000
          });
          throw new Error('Login failed');
        }
      }

      // Success case
      login(data.token);
      localStorage.setItem('userProfile', JSON.stringify(data.profile));
      
      toast.success('Admin login successful!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Navigate to admin dashboard
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.message !== 'Invalid credentials' && err.message !== 'Login failed') {
        toast.error('Connection error. Please try again later.', {
          position: "top-right",
          autoClose: 3000
        });
      }
    } finally {
      setIsLoading(false);
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
                <label className="block text-sm font-medium text-blue-200">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter admin username"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                    <span>Signing In...</span>
                  </div>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                <Link to="/" className="text-white hover:text-blue-300 font-medium transition-colors duration-300">
                  Back to Home
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
            Admin Portal
          </h1>
          <p className="text-xl text-blue-200 leading-relaxed animate-fade-in-delay">
            Access the administrative dashboard to manage auctions, users, and platform settings.
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