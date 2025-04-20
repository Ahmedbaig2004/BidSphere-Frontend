import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarId, setAvatarId] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result);
      setAvatarId(uuidv4());
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = uuidv4();
    const generatedAvatarId = avatarId || uuidv4(); // fallback in case it's not set

    try {
      // 1. Upload image first
      if (avatarBase64) {
        const mediaRes = await fetch('http://150.136.175.145:227/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: avatarBase64 }),
        });

        if (!mediaRes.ok) throw new Error('Image upload failed');
      }

      // 2. Prepare and send registration data
      const payload = {
        profile: {
          user: {
            id: userId,
            name,
            avatarId: generatedAvatarId,
            registrationDate: new Date().toISOString(),
            platformAccess: 0,
          },
          customer: role === 'customer' ? { userID: userId } : {},
          seller: role === 'seller'
            ? {
              id: userId,
              reputation: 0,
              pickupLocation,
            }
            : {},
        },
        username,
        password,
        email,
      };

      const registerRes = await fetch('http://150.136.175.145:2278/api/registration/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log(JSON.stringify(payload, null, 2));
      if (!registerRes.ok) throw new Error('Registration failed');
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Error during registration');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Register</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Register as:</label>
          <div className="flex gap-4">
            <label className="flex items-center dark:text-white">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === 'customer'}
                onChange={() => setRole('customer')}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center dark:text-white">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === 'seller'}
                onChange={() => setRole('seller')}
                className="mr-2"
              />
              Seller
            </label>
          </div>
        </div>

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
          <label className="block mb-1 font-medium dark:text-white">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium dark:text-white">Upload Avatar</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="dark:text-white" />
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
