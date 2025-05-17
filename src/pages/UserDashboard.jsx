import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ProductListing from "./ProductListing";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { ThemeContext } from '../context/ThemeContext';

// Status code mapping
const LISTING_STATUS_MAP = {
  0: 'UNLISTED',
  1: 'WAITING',
  2: 'ACTIVE',
  3: 'COMPLETED',
  4: 'CLOSED',
  5: 'TERMINATED',
  6: 'ERRORED',
  7: 'MODERATED',
};

// Edit Profile Modal Component
const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
  const { isLightTheme } = useContext(ThemeContext);
  const [activeSection, setActiveSection] = useState('general');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [avatarId, setAvatarId] = useState(profile?.avatarId || '');
  const [deliveryLocation, setDeliveryLocation] = useState(profile?.deliveryLocation || '');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem("token");

  // Reset form state when modal opens or section changes
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // Reset fields only when section changes
    if (activeSection === 'general') {
      setDeliveryLocation(profile?.deliveryLocation || '');
    } else if (activeSection === 'email') {
      setEmail('');
      setCurrentPassword('');
    } else if (activeSection === 'password') {
      setCurrentPassword('');
      setNewPassword('');
    }
  }, [activeSection, isOpen, profile]);

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
      setAvatarBase64(base64String);
      setAvatarId(uuidv4());
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!avatarBase64) return avatarId;

    try {
      const formattedImage = avatarBase64.includes(',')
        ? avatarBase64.split(',')[1]
        : avatarBase64;

      const payload = {
        image: formattedImage
      };

      // Use the working endpoint from Register.jsx
      const mediaRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000), // 15-second timeout
      });

      // Get the response text
      const responseText = await mediaRes.text();
      console.log('Upload response:', responseText);
      
      if (!mediaRes.ok) {
        throw new Error(`Upload failed with status: ${mediaRes.status}`);
      }
      
      // Return the response text which contains the new image ID
      return responseText;
    } catch (err) {
      console.error('Error uploading image:', err);
      setErrorMessage('Failed to upload avatar. Please try again.');
      return null;
    }
  };

  const handleSubmitAvatar = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Current password is required to make changes');
      return;
    }
    
    if (!avatarBase64) {
      setErrorMessage('No avatar selected');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Upload avatar
      const newAvatarId = await uploadImage();
      if (!newAvatarId) {
        setIsLoading(false);
        return;
      }
      
      console.log('New avatar ID from server:', newAvatarId);
      
      // Update profile with new avatar ID
      const updatePayload = {
        avatarId: newAvatarId,
        currentPassword: currentPassword
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Incorrect password. Please try again.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to update profile picture');
        }
      }

      // Set the new avatar ID locally for immediate display
      setAvatarId(newAvatarId);
      setSuccessMessage('Profile picture updated successfully');
      onProfileUpdate(); // Refresh the profile data
      
      // Reset fields
      setAvatarBase64('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setErrorMessage(error.message || 'Failed to update profile picture. Please check your password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Current password is required to make changes');
      return;
    }
    
    if (!deliveryLocation || deliveryLocation === profile.deliveryLocation) {
      setErrorMessage('No changes detected in delivery location');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatePayload = {
        deliveryLocation: deliveryLocation,
        currentPassword: currentPassword
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Incorrect password. Please try again.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to update delivery location');
        }
      }

      setSuccessMessage('Delivery location updated successfully');
      onProfileUpdate();
      
      // Reset password field
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating delivery location:', error);
      setErrorMessage(error.message || 'Failed to update delivery location. Please check your password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Current password is required to make changes');
      return;
    }
    
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatePayload = {
        email: email,
        currentPassword: currentPassword
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Incorrect password. Please try again.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to update email');
        }
      }

      setSuccessMessage('Email updated successfully');
      onProfileUpdate();
      
      // Reset fields
      setEmail('');
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating email:', error);
      setErrorMessage(error.message || 'Failed to update email. Please check your password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage('Current password is required');
      return;
    }
    
    if (!newPassword) {
      setErrorMessage('New password is required');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatePayload = {
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Incorrect password. Please try again.');
        } else {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to update password');
        }
      }

      setSuccessMessage('Password updated successfully');
      
      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage(error.message || 'Failed to update password. Please check your current password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div className={`relative inline-block transform overflow-hidden rounded-lg ${isLightTheme ? 'bg-white' : 'bg-gradient-to-b from-gray-900 to-black'} text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className={`text-2xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Profile Settings</h3>
              <button onClick={onClose} className={`${isLightTheme ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className={`flex border-b ${isLightTheme ? 'border-gray-200' : 'border-white/10'} mb-6`}>
              <button
                onClick={() => setActiveSection('general')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeSection === 'general' 
                    ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400' 
                    : isLightTheme ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSection('avatar')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeSection === 'avatar' 
                    ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400' 
                    : isLightTheme ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                Avatar
              </button>
              <button
                onClick={() => setActiveSection('email')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeSection === 'email' 
                    ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400' 
                    : isLightTheme ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeSection === 'password' 
                    ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400' 
                    : isLightTheme ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                Password
              </button>
            </div>

            {errorMessage && (
              <div className={`mb-4 p-3 ${isLightTheme ? 'bg-red-100 border-red-300 text-red-700' : 'bg-red-500/20 border-red-500/30 text-red-300'} rounded-lg border`}>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className={`mb-4 p-3 ${isLightTheme ? 'bg-green-100 border-green-300 text-green-700' : 'bg-green-500/20 border-green-500/30 text-green-300'} rounded-lg border`}>
                {successMessage}
              </div>
            )}

            {/* General Profile Settings */}
            {activeSection === 'general' && (
              <form onSubmit={handleSubmitLocation}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="deliveryLocation" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Delivery Location
                    </label>
                    <input
                      type="text"
                      id="deliveryLocation"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentPasswordLocation" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Current Password (required)
                    </label>
                    <input
                      type="password"
                      id="currentPasswordLocation"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 ${isLightTheme ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-white hover:bg-gray-700'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Location'}
                  </button>
                </div>
              </form>
            )}

            {/* Avatar Settings */}
            {activeSection === 'avatar' && (
              <form onSubmit={handleSubmitAvatar}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Profile Picture
                    </label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-center">
                        <img
                          src={avatarBase64 || `http://150.136.175.145:2280/cdn/${profile.avatarId}.png`}
                          alt="Avatar"
                          className={`w-32 h-32 rounded-full object-cover border ${isLightTheme ? 'border-gray-300' : 'border-white/20'}`}
                        />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={`w-full text-sm ${isLightTheme ? 'text-gray-700 file:bg-blue-100 file:text-blue-700' : 'text-blue-200 file:bg-blue-500/20 file:text-blue-200'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-blue-500/30`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="currentPasswordAvatar" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Current Password (required)
                    </label>
                    <input
                      type="password"
                      id="currentPasswordAvatar"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 ${isLightTheme ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-white hover:bg-gray-700'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Avatar'}
                  </button>
                </div>
              </form>
            )}

            {/* Email Settings */}
            {activeSection === 'email' && (
              <form onSubmit={handleSubmitEmail}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      New Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your new email address"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="currentPasswordEmail" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Current Password (required)
                    </label>
                    <input
                      type="password"
                      id="currentPasswordEmail"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 ${isLightTheme ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-white hover:bg-gray-700'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Email'}
                  </button>
                </div>
              </form>
            )}

            {/* Password Settings */}
            {activeSection === 'password' && (
              <form onSubmit={handleSubmitPassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPasswordChange" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPasswordChange"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' : 'bg-blue-900/30 border-blue-800/50 text-white placeholder-blue-300/50'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 ${isLightTheme ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-800 text-white hover:bg-gray-700'} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ isOpen, onClose, listingId }) => {
  const { isLightTheme } = useContext(ThemeContext);
  const [listingData, setListingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showListAuctionDialog, setShowListAuctionDialog] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({
    startingPrice: '',
    startDate: '',
    endDate: ''
  });
  const [buyerInfo, setBuyerInfo] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && listingId) {
      fetchListingData();
    }
  }, [isOpen, listingId]);

  const fetchListingData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/${listingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listing data');
      }
      const data = await response.json();
      setListingData(data);

      // If there's a transaction, fetch buyer info
      if (data.latestTransaction) {
        const buyerResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/${data.latestTransaction.nextOwnerId}`);
        if (buyerResponse.ok) {
          const buyerData = await buyerResponse.json();
          setBuyerInfo(buyerData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateAuction = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/terminate/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to terminate auction');
      }

      toast.success('Auction terminated successfully');
      setShowCancelConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Error terminating auction:', error);
      toast.error('Failed to terminate auction');
    }
  };

  const handleListAuction = async () => {
    try {
      // First create the product
      const productResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: listingData.product.name,
          description: listingData.product.description,
          category: listingData.product.category,
          subCategory: listingData.product.subCategory
        })
      });

      if (!productResponse.ok) {
        throw new Error('Failed to create product');
      }

      const productData = await productResponse.json();

      // Then publish the auction
      const auctionResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productData.productId,
          startingPrice: parseFloat(auctionDetails.startingPrice),
          startDate: new Date(auctionDetails.startDate).toISOString(),
          endDate: new Date(auctionDetails.endDate).toISOString(),
          mainImageId: listingData.mainImageId,
          displayImageIds: listingData.displayImageIds
        })
      });

      if (!auctionResponse.ok) {
        throw new Error('Failed to publish auction');
      }

      toast.success('Auction listed successfully');
      setShowListAuctionDialog(false);
      onClose();
    } catch (error) {
      console.error('Error listing auction:', error);
      toast.error('Failed to list auction');
    }
  };

  if (!isOpen) return null;

  // Check if auction has started yet
  const isAuctionStarted = listingData && new Date() >= new Date(listingData.startDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div className={`relative inline-block transform overflow-hidden rounded-lg ${isLightTheme ? 'bg-white' : 'bg-gradient-to-b from-gray-900 to-black'} text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle`}>
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isLightTheme ? 'border-blue-600' : 'border-blue-500'}`}></div>
            </div>
          ) : listingData ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-2xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>{listingData.product.name}</h3>
                <button onClick={onClose} className={`${isLightTheme ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'}`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6 flex items-center gap-3">
                <span className="px-4 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: listingData.status === 2 ? '#22c55e' : '#64748b',
                    color: 'white',
                  }}
                >
                  {LISTING_STATUS_MAP[listingData.status] || 'UNKNOWN'}
                </span>
                {listingData.status !== 2 && (
                  <span className={`text-sm ${isLightTheme ? 'text-red-600' : 'text-red-400'}`}>This bid is not active.</span>
                )}
                {listingData.status === 2 && !isAuctionStarted && (
                  <span className={`text-sm ${isLightTheme ? 'text-yellow-600' : 'text-yellow-400'}`}>Auction scheduled but not yet started.</span>
                )}
                {listingData.status === 2 && isAuctionStarted && (
                  <span className={`text-sm ${isLightTheme ? 'text-green-600' : 'text-green-400'}`}>Bidding is active!</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Images */}
                <div className="space-y-4">
                  <img
                    src={`http://150.136.175.145:2280/cdn/${listingData.mainImageId}.png`}
                    alt={listingData.product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex gap-2 overflow-x-auto">
                    {listingData.displayImageIds.map((imageId, index) => (
                      <img
                        key={index}
                        src={`http://150.136.175.145:2280/cdn/${imageId}.png`}
                        alt={`Display ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Price Information</h4>
                    <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Starting Price: ${listingData.startingPrice}</p>
                    {listingData.latestBid && (
                      <p className={isLightTheme ? 'text-green-600' : 'text-green-400'}>
                        {listingData.status === 2 ? "Latest Bid: " : "Winning Bid: "}
                        ${listingData.latestBid.bidPrice}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Category Information</h4>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 ${isLightTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-600/20 text-blue-200'} rounded-full text-sm`}>
                        {listingData.product.category}
                      </span>
                      <span className={`px-3 py-1 ${isLightTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-600/20 text-blue-200'} rounded-full text-sm`}>
                        {listingData.product.subCategory}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Auction Dates</h4>
                    <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Start Date: {new Date(listingData.startDate).toLocaleString()}</p>
                    <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>End Date: {new Date(listingData.endDate).toLocaleString()}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Description</h4>
                    <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>{listingData.product.description}</p>
                  </div>

                  {/* Transaction Details */}
                  {listingData.latestTransaction && buyerInfo && (
                    <div className="space-y-2">
                      <h4 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Transaction Details</h4>
                      <div className={`${isLightTheme ? 'bg-gray-100' : 'bg-white/5'} p-4 rounded-lg space-y-2`}>
                        <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Final Price: ${listingData.latestBid.bidPrice}</p>
                        <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Buyer: {buyerInfo.name}</p>
                        <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Wallet Address: {buyerInfo.walletAddress}</p>
                        <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>Transaction Date: {new Date(listingData.latestBid.bidDate).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                {listingData.status === 2 && isAuctionStarted ? (
                  <button
                    onClick={() => setShowCancelConfirmation(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Auction
                  </button>
                ) : (
                  <button
                    onClick={() => setShowListAuctionDialog(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    List Auction
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className={isLightTheme ? 'text-gray-800' : 'text-white'}>Failed to load product details</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setShowCancelConfirmation(false)}></div>
            <div className={`relative rounded-lg p-6 max-w-md w-full ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
              <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-4`}>Confirm Auction Cancellation</h3>
              <p className={`mb-6 ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Are you sure you want to cancel this auction? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCancelConfirmation(false)}
                  className={`px-4 py-2 ${isLightTheme ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-blue-200'}`}
                >
                  No, Keep Auction
                </button>
                <button
                  onClick={handleTerminateAuction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, Cancel Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Auction Dialog */}
      {showListAuctionDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setShowListAuctionDialog(false)}></div>
            <div className={`relative rounded-lg p-6 max-w-md w-full ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
              <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-4`}>List New Auction</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                    Starting Price
                  </label>
                  <input
                    type="number"
                    value={auctionDetails.startingPrice}
                    onChange={(e) => setAuctionDetails(prev => ({ ...prev, startingPrice: e.target.value }))}
                    className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'} border rounded-lg`}
                    placeholder="Enter starting price"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={auctionDetails.startDate}
                    onChange={(e) => setAuctionDetails(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'} border rounded-lg`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-1`}>
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={auctionDetails.endDate}
                    onChange={(e) => setAuctionDetails(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`w-full px-4 py-2 ${isLightTheme ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-white'} border rounded-lg`}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowListAuctionDialog(false)}
                  className={`px-4 py-2 ${isLightTheme ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-blue-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleListAuction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  List Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { isLightTheme } = useContext(ThemeContext);
  const storedProfile = localStorage.getItem("userProfile");
  const id = storedProfile ? JSON.parse(storedProfile).id : null;
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [inventoryPage, setInventoryPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [loading, setLoading] = useState({
    profile: false,
    inventory: false,
    history: false
  });
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "inventory" && inventory.length === 0) {
      fetchInventory();
    }
  }, [activeTab, inventoryPage]);

  useEffect(() => {
    if (activeTab === "history" && history.length === 0) {
      fetchHistory();
    }
  }, [activeTab, historyPage]);

  const fetchUserData = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchInventory = async () => {
    setLoading(prev => ({ ...prev, inventory: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/inventory/${inventoryPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(prev => ({ ...prev, inventory: false }));
    }
  };

  const fetchHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/history/${historyPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Pagination handlers
  const handleNextInventoryPage = () => {
    setInventoryPage(prev => prev + 1);
    setInventory([]);
  };

  const handlePrevInventoryPage = () => {
    if (inventoryPage > 0) {
      setInventoryPage(prev => prev - 1);
      setInventory([]);
    }
  };

  const handleNextHistoryPage = () => {
    setHistoryPage(prev => prev + 1);
    setHistory([]);
  };

  const handlePrevHistoryPage = () => {
    if (historyPage > 0) {
      setHistoryPage(prev => prev - 1);
      setHistory([]);
    }
  };

  if (loading.profile && !profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  const renderProfileContent = () => {
    if (!profile) return null;

    const {
      name,
      avatarId,
      walletAddress,
      registrationDate,
      deliveryLocation,
      platformAccess,
      reputation,
    } = profile;

    return (
      <>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
          <div className="relative">
            <img
              src={`http://150.136.175.145:2280/cdn/${avatarId}.png`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-white/20"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white/20"></div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className={`text-3xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>{name}</h2>
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit Profile
              </button>
            </div>
            <p className={`${isLightTheme ? 'text-gray-600' : 'text-blue-200'} text-sm`}>Registered: {new Date(registrationDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/70 border-gray-300' : 'bg-white/5 border-white/10'} p-6 rounded-xl border`}>
            <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>Location</h3>
            <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>{deliveryLocation}</p>
          </div>
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/70 border-gray-300' : 'bg-white/5 border-white/10'} p-6 rounded-xl border`}>
            <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>Platform Access</h3>
            <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>{platformAccess}</p>
          </div>
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/70 border-gray-300' : 'bg-white/5 border-white/10'} p-6 rounded-xl border`}>
            <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-2`}>Reputation</h3>
            <p className={isLightTheme ? 'text-gray-700' : 'text-blue-200'}>{reputation}</p>
          </div>
        </div>
      </>
    );
  };

  const renderInventoryContent = () => {
    return (
      <div>
        <h2 className={`text-2xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-6`}>Your Inventory</h2>
        
        {loading.inventory ? (
          <div className="text-center py-10">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isLightTheme ? 'border-blue-600' : 'border-white'}`}></div>
            <p className={`mt-2 ${isLightTheme ? 'text-gray-700' : 'text-white'}`}>Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-10">
            <p className={isLightTheme ? 'text-gray-700' : 'text-white'}>No items found in your inventory.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {inventory.map((listing) => (
                <div key={listing.listingId || `inv-${Math.random()}`} className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/70 border-gray-300 hover:bg-white/90' : 'bg-white/5 border-white/10 hover:bg-white/10'} p-6 rounded-xl border transition-colors`}>
                  <div className="flex items-center space-x-4 mb-4">
                    {listing.listingImageIds && listing.listingImageIds.length > 0 && (
                      <img 
                        src={`http://150.136.175.145:2280/cdn/${listing.listingImageIds[0]}.png`} 
                        alt={(listing.product && listing.product.name) || "Product"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>{listing.product ? listing.product.name : "Unnamed Product"}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: listing.status === 2 ? '#22c55e' : '#64748b',
                            color: 'white',
                          }}
                        >
                          {LISTING_STATUS_MAP[listing.status] || 'UNKNOWN'}
                        </span>
                        {listing.status !== 2 && (
                          <span className="text-red-400 text-xs">Inactive</span>
                        )}
                        {listing.status === 2 && (
                          <span className="text-green-400 text-xs">Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Starting price: ${listing.startingPrice || "N/A"}</p>
                    <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Category: {listing.product && listing.product.category ? listing.product.category : "Uncategorized"}</p>
                    {listing.latestBid && (
                      <p className="text-sm text-green-600">Current bid: ${listing.latestBid.bidPrice}</p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setSelectedListingId(listing.listingId)}
                        className={`${isLightTheme ? 'text-blue-600 hover:text-blue-800' : 'text-blue-300 hover:text-blue-100'} text-sm transition-colors`}
                      >
                        View details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevInventoryPage}
                disabled={inventoryPage === 0}
                className={`px-4 py-2 rounded-lg ${
                  inventoryPage === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Previous
              </button>
              <span className={isLightTheme ? 'text-gray-800 py-2' : 'text-white py-2'}>Page {inventoryPage + 1}</span>
              <button
                onClick={handleNextInventoryPage}
                disabled={inventory.length < 10}
                className={`px-4 py-2 rounded-lg ${
                  inventory.length < 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderHistoryContent = () => {
    return (
      <div>
        <h2 className={`text-2xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'} mb-6`}>Transaction History</h2>
        
        {loading.history ? (
          <div className="text-center py-10">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isLightTheme ? 'border-blue-600' : 'border-white'}`}></div>
            <p className={`mt-2 ${isLightTheme ? 'text-gray-700' : 'text-white'}`}>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">
            <p className={isLightTheme ? 'text-gray-700' : 'text-white'}>No transaction history found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {history.map((listing) => (
                <div key={listing.listingId || `hist-${Math.random()}`} className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/70 border-gray-300 hover:bg-white/90' : 'bg-white/5 border-white/10 hover:bg-white/10'} p-6 rounded-xl border transition-colors`}>
                  <div className="flex items-center space-x-4 mb-4">
                    {listing.listingImageIds && listing.listingImageIds.length > 0 && (
                      <img 
                        src={`http://150.136.175.145:2280/cdn/${listing.listingImageIds[0]}.png`} 
                        alt={(listing.product && listing.product.name) || "Product"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className={`text-lg font-medium ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>{listing.product ? listing.product.name : "Unnamed Product"}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: listing.status === 2 ? '#22c55e' : '#64748b',
                            color: 'white',
                          }}
                        >
                          {LISTING_STATUS_MAP[listing.status] || 'UNKNOWN'}
                        </span>
                        {listing.status !== 2 && (
                          <span className="text-red-400 text-xs">Inactive</span>
                        )}
                        {listing.status === 2 && (
                          <span className="text-green-400 text-xs">Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {listing.transaction && (
                      <>
                        <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Sold for: ${listing.transaction.amount}</p>
                        <p className={`text-sm ${isLightTheme ? 'text-gray-700' : 'text-blue-200'}`}>Date: {new Date(listing.transaction.transactionDate).toLocaleString()}</p>
                      </>
                    )}
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedListingId(listing.listingId)}
                        className={`${isLightTheme ? 'text-blue-600 hover:text-blue-800' : 'text-blue-300 hover:text-blue-100'} text-sm transition-colors`}
                      >
                        View details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevHistoryPage}
                disabled={historyPage === 0}
                className={`px-4 py-2 rounded-lg ${
                  historyPage === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Previous
              </button>
              <span className={isLightTheme ? 'text-gray-800 py-2' : 'text-white py-2'}>Page {historyPage + 1}</span>
              <button
                onClick={handleNextHistoryPage}
                disabled={history.length < 10}
                className={`px-4 py-2 rounded-lg ${
                  history.length < 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isLightTheme ? 'bg-blue-50' : 'from-blue-900 via-black to-blue-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} p-8 rounded-2xl shadow-2xl border`}>
          {/* Tabs Navigation */}
          <div className={`flex border-b ${isLightTheme ? 'border-gray-200' : 'border-white/20'} mb-8`}>
            <button
              className={`py-2 px-4 mr-2 text-lg font-medium ${
                activeTab === 'profile'
                  ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400'
                  : isLightTheme ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 mr-2 text-lg font-medium ${
                activeTab === 'inventory'
                  ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400'
                  : isLightTheme ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button
              className={`py-2 px-4 text-lg font-medium ${
                activeTab === 'history'
                  ? isLightTheme ? 'text-blue-600 border-b-2 border-blue-600' : 'text-blue-400 border-b-2 border-blue-400'
                  : isLightTheme ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'profile' && renderProfileContent()}
            {activeTab === 'inventory' && renderInventoryContent()}
            {activeTab === 'history' && renderHistoryContent()}
          </div>

          {/* Add New Product Button */}
          {activeTab === 'inventory' && (
            <div className="mt-8">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Add New Product
              </button>
            </div>
          )}

          <ProductListing 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
              setInventory([]);
              fetchInventory();
            }}
          />
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedListingId}
        onClose={() => setSelectedListingId(null)}
        listingId={selectedListingId}
      />

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          profile={profile}
          onProfileUpdate={fetchUserData}
        />
      )}
    </div>
  );
};

export default UserDashboard;