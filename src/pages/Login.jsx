import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { isLightTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Get response text to analyze error messages
      const responseText = await res.text();
      let data;
      
      try {
        // Try to parse as JSON if possible
        data = JSON.parse(responseText);
      } catch (e) {
        // If not JSON, use as plain text
        data = { message: responseText };
      }

      if (!res.ok) {
        // Handle different error status codes
        if (res.status === 401) {
          toast.error('Invalid username or password', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          throw new Error('Invalid credentials');
        } else if (res.status === 403) {
          toast.error('Your account is not verified. Please verify your email first.', {
            position: "top-right",
            autoClose: 5000
          });
          navigate('/verify-email-pending');
          return;
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
      
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Navigate after a short delay to allow toast to be seen
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      // General error handling (if not already handled above)
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
    <div className={`min-h-screen ${isLightTheme ? 'bg-blue-50' : 'bg-gradient-to-br from-blue-900 via-black to-blue-900'} overflow-x-hidden flex flex-col md:flex-row`}>
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} p-8 rounded-2xl shadow-2xl border transform transition-all duration-500 hover:scale-[1.02]`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Welcome Back</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your password"
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
              <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>
                Don't have an account?{' '}
                <Link to="/register" className={`${isLightTheme ? 'text-blue-600 hover:text-blue-800' : 'text-white hover:text-blue-300'} font-medium transition-colors duration-300`}>
                  Register Now
                </Link>
              </p>
              
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Splash Text */}
      <div className={`w-full md:w-1/2 flex items-center justify-center p-8 ${isLightTheme ? 'bg-blue-100/50' : 'bg-gradient-to-br from-blue-900/50 to-black/50'}`}>
        <div className="max-w-lg text-center">
          <h1 className={`text-5xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-6 animate-fade-in`}>
            Welcome to BidSphere
          </h1>
          <p className={`text-xl ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} leading-relaxed animate-fade-in-delay`}>
            Your premier destination for seamless bidding and trading. Experience the future of digital commerce with our cutting-edge platform.
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

export default Login;
