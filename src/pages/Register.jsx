import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [walletAddress, setwalletaddress] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const navigate = useNavigate();

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
        const mediaRes = await fetch('http://150.136.175.145:2278/api/media/upload', {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);


    try {
      // Try to upload the image first if one was selected
      let finalAvatarId = '';  // Default to generated ID
      if (avatarBase64) {
        const uploadedId = await uploadImage();
        if (uploadedId) {
          finalAvatarId = uploadedId;
        }
      }

      // Prepare registration data - match the exact schema from the documentation
      const payload = {
          userDetails: {
            name,
            avatarId: finalAvatarId,

            walletAddress,
            deliveryLocation,
      
        },
        username,
        password,
        email,
      }
    

      console.log("Sending registration payload:", JSON.stringify(payload, null, 2));

      // Send registration data
      const registerRes = await fetch('http://150.136.175.145:2278/api/registration/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000), // 15-second timeout
      });

      if (!registerRes.ok) {
        let errorText = `Registration failed with status: ${registerRes.status}`;

        try {
          const errorData = await registerRes.json();
          errorText = errorData.message || errorText;
        } catch (e) {
          console.log(e);
        }

        if (registerRes.status === 500) {
          setErrorMessage(`Server error: ${errorText}`);
        } else if (registerRes.status === 409) {
          setErrorMessage('Username or email already exists. Please choose a different one.');
        } else {
          setErrorMessage(errorText);
        }
        throw new Error('Registration failed');
      }

      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (!errorMessage) {
        setErrorMessage('Error during registration. Please try again later.');
      }
    } finally {
      setIsLoading(false);
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
        setwalletaddress(accounts[0]);
        setErrorMessage('');
      }
    } catch (err) {
      console.error('MetaMask connection error:', err);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };  

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-black to-blue-900">
      {/* Left side - Register Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Create Account</h2>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              {role === 'seller' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-200">Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    required={role === 'seller'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter pickup location"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Choose a username"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Create a password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Wallet Address</label>
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full px-4 py-3 bg-blue-600/20 border border-blue-500/50 rounded-lg text-white hover:bg-blue-600/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-200">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:text-blue-300 font-medium transition-colors duration-300">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Splash Text */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-900/50 to-black/50">
        <div className="max-w-lg text-center">
          <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            Join BidNex Today
          </h1>
          <p className="text-xl text-blue-200 leading-relaxed animate-fade-in-delay">
            Experience the future of digital commerce. Create your account and start your journey with BidNex - where innovation meets opportunity.
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