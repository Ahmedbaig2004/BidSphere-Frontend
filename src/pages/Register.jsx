import { useState, useEffect, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../context/ThemeContext';

const Register = () => {
  const { isLightTheme } = useContext(ThemeContext);
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [walletAddress, setwalletaddress] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  
  // Validation states
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [walletAddressError, setWalletAddressError] = useState('');
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasMinLength = pass.length >= 8;
    
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasMinLength) {
      return 'Password must be at least 8 characters long';
    }
    
    return '';
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    
    // Check confirm password match if it's already filled
    if (confirmPassword) {
      setConfirmPasswordError(newPassword === confirmPassword ? '' : 'Passwords do not match');
    }
  };
  
  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    const confirmPass = e.target.value;
    setConfirmPassword(confirmPass);
    setConfirmPasswordError(password === confirmPass ? '' : 'Passwords do not match');
  };
  
  // Validation functions using useCallback for stability
  const validateUsername = useCallback(async () => {
    if (!username || username.length < 3) return;
    
    setIsCheckingUsername(true);
    setUsernameError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/registration/verify/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: username,
      });
      
      console.log("Username validation response:", response.status);
      
      if (response.ok) {
        const isUnique = await response.json();
        console.log("Username is unique:", isUnique);
        
        if (!isUnique) {
          setUsernameError('This username is already taken');
        }
      } else {
        console.error('Failed to verify username:', response.status);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  }, [username]);
  
  const validateEmail = useCallback(async () => {
    if (!email || !email.includes('@')) return;
    
    setIsCheckingEmail(true);
    setEmailError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/registration/verify/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: email,
      });
      
      console.log("Email validation response:", response.status);
      
      if (response.ok) {
        const isUnique = await response.json();
        console.log("Email is unique:", isUnique);
        
        if (!isUnique) {
          setEmailError('This email is already registered');
        }
      } else {
        console.error('Failed to verify email:', response.status);
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  }, [email]);
  
  // Generate a random wallet address for users who don't provide one
  const generateRandomWalletAddress = () => {
    // Create a random hex string that looks like a wallet address
    const randomHex = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return randomHex;
  };

  const validateWallet = useCallback(async (address) => {
    // Skip validation for empty wallet addresses
    if (!address || address.trim() === '') return;
    
    setIsCheckingWallet(true);
    setWalletAddressError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/registration/verify/walletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: address,
      });
      
      console.log("Wallet validation response:", response.status);
      
      if (response.ok) {
        const isUnique = await response.json();
        console.log("Wallet is unique:", isUnique);
        
        if (!isUnique) {
          setWalletAddressError('This wallet address is already registered');
        }
      } else {
        console.error('Failed to verify wallet address:', response.status);
      }
    } catch (error) {
      console.error('Error checking wallet address:', error);
    } finally {
      setIsCheckingWallet(false);
    }
  }, []);
  
  // Handle field changes
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Clear error when typing again
    if (usernameError) setUsernameError('');
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when typing again
    if (emailError) setEmailError('');
  };
  
  // Handle field blur events
  const handleUsernameBlur = () => {
    console.log("Username blur event fired");
    validateUsername();
  };
  
  const handleEmailBlur = () => {
    console.log("Email blur event fired");
    validateEmail();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Checking file size before processing
    if (file.size > 1024 * 1024 * 2) { // 2MB limit
      setErrorMessage('Image is too large (max 2MB). Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      // Making sure the base64 string is properly formatted
      setAvatarBase64(base64String);
      setAvatarId(uuidv4());
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!avatarBase64) return null;

    setImageUploadStatus('uploading');

    try {
      // Formating the base64 string correctly
      // Keeping only the base64 part after the comma if it's a data URL
      const formattedImage = avatarBase64.includes(',')
        ? avatarBase64.split(',')[1]
        : avatarBase64;

      const payload = {
        image: formattedImage
      };

      // Logging the payload for debugging
      console.log("Media upload payload format:", {
        ...payload,
        image: payload.image.substring(0, 100) + '...' // Truncate for logging
      });

      // Trying the direct API endpoint (port 2278)
      try {
        const mediaRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/media/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(15000), // 15-second timeout
        });

        // Get the full response for debugging
        const responseText = await mediaRes.text();
        let responseData;
        try {
          responseData = responseText;
        } catch (e) {
          responseData = { rawText: responseText };
          console.log(e);
        }

        setDebugInfo({
          endpoint: '2278',
          status: mediaRes.status,
          response: responseData
        });

        if (mediaRes.ok) {
          setImageUploadStatus('success');
          return responseData;
        } else {
          throw new Error(`Upload failed with status: ${mediaRes.status}`);
        }
      } catch (e) {
        console.warn(`Media server on port 2278 failed: ${e.message}`);
        console.log(debugInfo)
      }


      // If both attempts fail, continue with registration without image
      setImageUploadStatus('error');
      console.warn('Image upload failed with all approaches, continuing with registration without avatar');
      return null;
    } catch (err) {
      setImageUploadStatus('error');
      console.error('Error uploading image:', err);
      return null;
    }
  };
  
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setErrorMessage('MetaMask is not installed. Please install it to continue.');
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const address = accounts[0];
        setwalletaddress(address);
        setWalletAddressError(''); // Clear any previous errors
        setErrorMessage('');
        
        // Validate wallet address immediately after connection
        validateWallet(address);
      }
    } catch (err) {
      console.error('MetaMask connection error:', err);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };
  
  const disconnectWallet = () => {
    setwalletaddress('');
    setWalletAddressError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validate password complexity first
    const passError = validatePassword(password);
    if (passError) {
      setPasswordError(passError);
      setErrorMessage(passError);
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setErrorMessage('Passwords do not match');
      return;
    }
    
    // Check for wallet address
    if (!walletAddress || walletAddress.trim() === '') {
      setErrorMessage('Wallet address is required. Please connect your wallet.');
      return;
    }
    
    // Manually trigger validation for email and username to ensure fresh data
    console.log("Triggering validations before submit");
    await validateEmail();
    await validateUsername();
    await validateWallet(walletAddress);
    
    // We need setTimeout to ensure state updates have completed
    setTimeout(async () => {
      // Check for field validation errors after validation
      if (usernameError || emailError || walletAddressError) {
        setErrorMessage('Please fix all validation errors before submitting.');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Upload the image if one was selected
        let finalAvatarId = '';  // Default to generated ID
        if (avatarBase64) {
          const uploadedId = await uploadImage();
          if (uploadedId) {
            finalAvatarId = uploadedId;
          }
        }
  
        // Send registration data
        const payload = {
          userDetails: {
            name,
            avatarId: finalAvatarId,
            walletAddress: walletAddress,
            deliveryLocation,
          },
          username,
          password,
          email,
        };
      
        console.log("Sending registration payload:", JSON.stringify(payload, null, 2));
  
        const registerRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/registration/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(15000), // 15-second timeout
        });
  
        console.log("Registration response status:", registerRes.status);
  
        if (!registerRes.ok) {
          let errorText = `Registration failed with status: ${registerRes.status}`;
  
          try {
            // Get error response text if available
            const responseText = await registerRes.text();
            console.log("Registration error response:", responseText);
            
            // Handle specific status codes
            if (registerRes.status === 409) {
              if (responseText.includes("Username already exists")) {
                setUsernameError('This username is already taken');
                errorText = 'Username already exists. Please choose a different one.';
              } else if (responseText.includes("Email already exists")) {
                setEmailError('This email is already registered');
                errorText = 'Email already exists. Please use a different email.';
              } else if (responseText.includes("Wallet address already exists")) {
                setWalletAddressError('This wallet address is already registered');
                errorText = 'Wallet address already registered. Please use a different wallet.';
              } else {
                // General conflict error if we can't determine the specific cause
                errorText = responseText || 'A conflict occurred. One of your details may already be registered.';
              }
            } else {
              // For non-409 errors, use the response text if available
              errorText = responseText || errorText;
            }
          } catch (e) {
            console.error("Error processing response:", e);
          }
  
          setErrorMessage(errorText);
          throw new Error('Registration failed');
        }
  
        // Show success toast and navigate to login
        toast.success('Registration successful! Please log in with your new account.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        // Navigate to login page after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (err) {
        console.error(err);
        if (!errorMessage) {
          setErrorMessage('Error during registration. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };
  
  // Debug validation states
  useEffect(() => {
    // Debug logs to help troubleshoot validation issues
    console.log("Validation states:", {
      usernameError,
      emailError,
      walletAddressError,
      passwordError,
      confirmPasswordError
    });
  }, [usernameError, emailError, walletAddressError, passwordError, confirmPasswordError]);

  return (
    <div className={`min-h-screen flex ${isLightTheme ? 'bg-blue-50' : 'bg-gradient-to-br from-blue-900 via-black to-blue-900'}`}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Left side - Register Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} p-8 rounded-2xl shadow-2xl border transform transition-all duration-500 hover:scale-[1.02]`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Create Account</h2>

            {errorMessage && (
              <div className={`mb-6 p-4 ${isLightTheme ? 'bg-red-100 border-red-300 text-red-700' : 'bg-red-500/20 border-red-500/50 text-red-200'} rounded-lg border`}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>

              {role === 'seller' && (
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    required={role === 'seller'}
                    className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter pickup location"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    required
                    className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border ${emailError ? (isLightTheme ? 'border-red-500' : 'border-red-500') : isLightTheme ? 'border-gray-300' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                  {isCheckingEmail && (
                    <div className="absolute right-3 top-3 animate-spin w-5 h-5 border-t-2 border-blue-500 rounded-full"></div>
                  )}
                </div>
                {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameBlur}
                    required
                    className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border ${usernameError ? 'border-red-500' : isLightTheme ? 'border-gray-300' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3 top-3 animate-spin w-5 h-5 border-t-2 border-blue-500 rounded-full"></div>
                  )}
                </div>
                {usernameError && <p className="text-xs text-red-400 mt-1">{usernameError}</p>}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border ${passwordError ? 'border-red-500' : isLightTheme ? 'border-gray-300' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
                <div className="mt-1">
                  <ul className={`text-xs ${isLightTheme ? 'text-gray-600' : 'text-blue-300'} space-y-1`}>
                    <li className={password.length >= 8 ? 'text-green-400' : ''}>• At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>• At least one uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-400' : ''}>• At least one lowercase letter</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>• At least one number</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-white/5 border-white/10 text-white placeholder-blue-200/50'} border ${confirmPasswordError ? 'border-red-500' : isLightTheme ? 'border-gray-300' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {confirmPasswordError && <p className="text-xs text-red-400 mt-1">{confirmPasswordError}</p>}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>
                  Wallet Address <span className="text-red-400">*</span> <span className="text-xs">(required)</span>
                </label>
                <div className="relative">
                  {walletAddress ? (
                    <div className="flex flex-col space-y-2">
                      <div className={`w-full px-4 py-3 ${isLightTheme ? 'bg-blue-100 border-blue-300 text-gray-800' : 'bg-blue-600/20 border-blue-500/50 text-white'} border rounded-lg ${walletAddressError ? 'border-red-500' : ''}`}>
                        Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <button
                        type="button"
                        onClick={disconnectWallet}
                        className={`w-full px-4 py-2 ${isLightTheme ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' : 'bg-red-600/20 border-red-500/50 text-white hover:bg-red-600/30'} border rounded-lg transition-all duration-300 focus:outline-none`}
                        disabled={isLoading}
                      >
                        Disconnect Wallet
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={connectWallet}
                      className={`w-full px-4 py-3 ${isLightTheme ? 'bg-blue-100 border-blue-300 text-gray-800 hover:bg-blue-200' : 'bg-blue-600/20 border-blue-500/50 text-white hover:bg-blue-600/30'} border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLightTheme ? 'focus:ring-offset-white' : 'focus:ring-offset-gray-900'}`}
                      disabled={isLoading}
                    >
                      Connect Wallet (Required)
                    </button>
                  )}
                  {isCheckingWallet && (
                    <div className="absolute right-3 top-3 animate-spin w-5 h-5 border-t-2 border-blue-500 rounded-full"></div>
                  )}
                </div>
                {!walletAddress && (
                  <p className={`text-xs ${isLightTheme ? 'text-red-600' : 'text-red-400'} mt-1`}>
                    A wallet address is required to register. Please connect your wallet.
                  </p>
                )}
                {walletAddressError && (
                  <p className={`text-xs ${isLightTheme ? 'text-red-600' : 'text-red-400'} mt-1`}>
                    {walletAddressError} Please disconnect and try a different wallet.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-4 py-3 ${isLightTheme ? 'bg-white/70 border-gray-300 text-gray-800' : 'bg-white/5 border-white/10 text-white'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || passwordError || confirmPasswordError || emailError || usernameError || walletAddressError}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>
                Already have an account?{' '}
                <Link to="/login" className={`${isLightTheme ? 'text-blue-600 hover:text-blue-800' : 'text-white hover:text-blue-300'} font-medium transition-colors duration-300`}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Splash Text */}
      <div className={`w-1/2 flex items-center justify-center p-8 ${isLightTheme ? 'bg-blue-100/50' : 'bg-gradient-to-br from-blue-900/50 to-black/50'}`}>
        <div className="max-w-lg text-center">
          <h1 className={`text-5xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-6 animate-fade-in`}>
            Join BidSphere Today
          </h1>
          <p className={`text-xl ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} leading-relaxed animate-fade-in-delay`}>
            Experience the future of digital commerce. Create your account and start your journey with BidSphere - where innovation meets opportunity.
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

export default Register;