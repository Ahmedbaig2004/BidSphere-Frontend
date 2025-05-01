import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
  const [walletAddress, setwalletaddress] = useState("")
  const [deliveryLocation, setDeliveryLocation] = useState("")
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
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Register</h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>

        {role === 'seller' && (
          <div className="mb-4">
            <label className="block mb-1 font-medium dark:text-white">Pickup Location</label>
            <input type="text" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} required={role === 'seller'} className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Wallet Address</label>
          <button
            type="button"
            onClick={connectWallet}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet?'}
          </button>
        </div>
       


        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Delivery Location</label>
          <input type="text" value={deliveryLocation} onChange={e => setDeliveryLocation(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Upload Avatar (Max 2MB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="dark:text-white"
          />
          {avatarBase64 && (
            <div className="mt-2 flex items-center">
              <img src={avatarBase64} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
              {imageUploadStatus === 'uploading' && (
                <span className="ml-2 text-yellow-500">Uploading...</span>
              )}
              {imageUploadStatus === 'success' && (
                <span className="ml-2 text-green-500">Upload successful</span>
              )}
              {imageUploadStatus === 'error' && (
                <span className="ml-2 text-red-500">Upload failed, continuing with registration</span>
              )}
            </div>
          )}
        </div>



        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>

  );
};

export default Register;