import { useState } from 'react';
import { Link } from 'react-router-dom';

const EmailVerificationPending = () => {
  const [resendStatus, setResendStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get email from local storage (saved during registration)
  const email = localStorage.getItem('pendingVerificationEmail') || '';
  const userId = localStorage.getItem('pendingVerificationUserId') || '';
  
  const handleResendVerification = async () => {
    if (!userId || !email) {
      setErrorMessage('User information is missing. Please try registering again.');
      return;
    }
    
    setResendStatus('sending');
    setErrorMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/verification/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });
      
      if (response.ok) {
        setResendStatus('success');
      } else {
        const errorData = await response.text();
        setResendStatus('error');
        setErrorMessage(errorData || 'Failed to resend verification email. Please try again later.');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setResendStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Verify Your Email</h2>
          
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <p className="text-blue-200 mb-2">Thanks for signing up!</p>
          <p className="text-blue-200 mb-6">
            We've sent a verification email to <span className="font-semibold text-white">{email}</span>.
            Please check your inbox and click the verification link to activate your account.
          </p>
          
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          {resendStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg">
              Verification email has been resent. Please check your inbox.
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={resendStatus === 'sending'}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendStatus === 'sending' ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                  <span>Sending...</span>
                </div>
              ) : 'Resend Verification Email'}
            </button>
            
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none"
            >
              Back to Login
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            <p>Didn't receive the email? Check your spam folder or try resending the verification email.</p>
            <p className="mt-2">
              Having trouble? <Link to="/resend-verification" className="text-white underline">Request a new verification email</Link> 
              if you don't have your user information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending; 