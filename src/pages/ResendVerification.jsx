import { useState } from 'react';
import { Link } from 'react-router-dom';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('sending');
    setErrorMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/verification/resend-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        const errorData = await response.text();
        setStatus('error');
        setErrorMessage(errorData || 'Failed to send verification email. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Resend Verification Email</h2>
          
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-blue-200 mb-6">
                If an account exists with this email, a verification link has been sent.
                Please check your inbox and follow the instructions.
              </p>
              <Link
                to="/login"
                className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-blue-200 mb-6">
                Enter your email address below and we'll send you a new verification link.
              </p>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-200">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                    disabled={status === 'sending'}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                      <span>Sending...</span>
                    </div>
                  ) : 'Send Verification Email'}
                </button>
                
                <div className="pt-4 border-t border-white/10">
                  <Link
                    to="/login"
                    className="block w-full py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none text-center"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerification; 