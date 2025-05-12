import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const userId = queryParams.get('userId');

        if (!token || !userId) {
          setVerificationStatus('error');
          setErrorMessage('Invalid verification link. Please check your email or request a new verification link.');
          return;
        }

        // Call API to verify email
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/verification/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, userId }),
        });

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          const errorData = await response.text();
          setVerificationStatus('error');
          setErrorMessage(errorData || 'Email verification failed. Please try again or contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Verifying Email</h2>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-blue-200">Please wait while we verify your email address...</p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Email Verified!</h2>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-blue-200 mb-6">Your email has been successfully verified. Your account is now active.</p>
            <Link 
              to="/login" 
              className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
            >
              Login to Your Account
            </Link>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Verification Failed</h2>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-300 mb-6">{errorMessage}</p>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/register" 
                className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
              >
                Back to Registration
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="block w-full py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 