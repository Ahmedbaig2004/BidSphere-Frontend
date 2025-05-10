import { useState, useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

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

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { currency } = useContext(ShopContext);
  const [listingData, setListingData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidConfirmation, setBidConfirmation] = useState(null);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState('');
  const [hasSufficientFunds, setHasSufficientFunds] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState({ eth: 0, usd: 0 });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  
  // Extract category and subcategory from location state if available
  const categoryFromNav = location.state?.category || '';
  const subCategoryFromNav = location.state?.subCategory || '';

  const fetchListingData = async () => {
    try {
      const response = await fetch(`http://150.136.175.145:2278/api/listing/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listing data');
      }
      const data = await response.json();
      setListingData(data);
      setSelectedImage(`http://150.136.175.145:2280/cdn/${data.mainImageId}.png`);
      
      // Fetch owner data
      const ownerResponse = await fetch(`http://150.136.175.145:2278/api/user/${data.product.ownerId}`);
      if (!ownerResponse.ok) {
        throw new Error('Failed to fetch owner data');
      }
      const ownerData = await ownerResponse.json();
      setOwnerData(ownerData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to check if the wallet is already connected via MetaMask
  const checkWalletConnection = async () => {
    // Don't show any errors during initial check
    let ethereum = null;
    
    try {
      if (window.ethereum) {
        ethereum = window.ethereum;
      } else if (window.web3) {
        ethereum = window.web3.currentProvider;
      } else if (window.ethereum && window.ethereum.providers) {
        const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
        if (metaMaskProvider) {
          ethereum = metaMaskProvider;
        }
      }

      if (ethereum) {
        try {
          // Get connected accounts without prompting
          const accounts = await ethereum.request({ 
            method: 'eth_accounts' // This doesn't prompt, just checks current state
          });
          
          if (accounts.length > 0) {
            // If MetaMask is connected but our localStorage doesn't have it, update localStorage
            const storedProfile = localStorage.getItem("userProfile");
            if (storedProfile) {
              const profile = JSON.parse(storedProfile);
              if (!profile.walletAddress && accounts[0]) {
                profile.walletAddress = accounts[0];
                localStorage.setItem("userProfile", JSON.stringify(profile));
                console.log("Updated local wallet address from MetaMask");
              }
            }
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
          // Silent fail - don't show errors during initial check
        }
      }
    } catch (err) {
      console.error("Error accessing wallet provider:", err);
      // Silent fail - don't show errors during initial check
    }
  };

  // Function to fetch wallet balance
  const fetchWalletBalance = async () => {
    const storedProfile = localStorage.getItem("userProfile");
    const walletAddress = storedProfile ? JSON.parse(storedProfile).walletAddress : null;
    
    if (!walletAddress) {
      setWalletBalance({ eth: 0, usd: 0 });
      return;
    }
    
    setIsLoadingBalance(true);
    try {
      // Use MetaMask provider to get real balance
      let ethereum = window.ethereum || 
                   (window.web3 && window.web3.currentProvider) || 
                   (window.ethereum && window.ethereum.providers && 
                    window.ethereum.providers.find(p => p.isMetaMask));
      
      if (!ethereum) {
        setWalletBalance({ eth: 0, usd: 0 });
        return;
      }
      
      // Get ETH balance in Wei
      const balanceInWei = await ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      
      // Convert Wei to ETH
      const balanceInEth = parseInt(balanceInWei, 16) / 1e18;
      
      // Get current ETH to USD conversion rate
      let ethPrice;
      try {
        // Try to fetch from Coingecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        ethPrice = data.ethereum.usd;
      } catch (error) {
        // Fallback to a reasonable value if API fails
        console.error('Error fetching ETH price:', error);
        ethPrice = 3000; // Fallback price
      }
      
      // Calculate wallet balance in USD
      const balanceUsd = balanceInEth * ethPrice;
      
      setWalletBalance({
        eth: balanceInEth,
        usd: balanceUsd
      });
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance({ eth: 0, usd: 0 });
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        await fetchListingData();
        if (isMounted) {
          await checkWalletConnection(); // Check wallet connection on page load
          await fetchWalletBalance(); // Fetch wallet balance
        }
      } catch (error) {
        console.error("Error in initial data loading:", error);
      }
    };
    
    fetchData();
    
    // Add MetaMask event listeners if available
    let ethereum = null;
    try {
      ethereum = window.ethereum || 
                (window.web3 && window.web3.currentProvider) || 
                (window.ethereum && window.ethereum.providers && 
                window.ethereum.providers.find(p => p.isMetaMask));
    } catch (err) {
      console.error("Error accessing Ethereum provider:", err);
    }
    
    // Only add listeners if we have a valid provider
    if (ethereum) {
      // Listen for account changes
      const handleAccountsChanged = (accounts) => {
        if (!isMounted) return; // Don't update state if component unmounted
        
        console.log("MetaMask accounts changed:", accounts);
        if (accounts.length > 0) {
          // Update stored wallet address
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            if (profile.walletAddress !== accounts[0]) {
              profile.walletAddress = accounts[0];
              localStorage.setItem("userProfile", JSON.stringify(profile));
              
              // Notify user
              toast.info("Wallet address updated");
            }
          }
        } else {
          // User disconnected their wallet in MetaMask
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            if (profile.walletAddress) {
              profile.walletAddress = null;
              localStorage.setItem("userProfile", JSON.stringify(profile));
              
              // Notify user
              toast.warning("Wallet disconnected");
            }
          }
        }
      };
      
      try {
        ethereum.on('accountsChanged', handleAccountsChanged);
      } catch (err) {
        console.error("Error adding accountsChanged listener:", err);
      }
      
      // Cleanup
      return () => {
        isMounted = false;
        if (ethereum) {
          try {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
          } catch (err) {
            console.error("Error removing accountsChanged listener:", err);
          }
        }
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (listingData) {
      setBidAmount(listingData.latestBid?.bidPrice || listingData.startingPrice);
    }
  }, [listingData]);

  const handleBidClick = () => {
    // Check if wallet is connected before opening bid drawer
    const storedProfile = localStorage.getItem("userProfile");
    const walletAddress = storedProfile ? JSON.parse(storedProfile).walletAddress : null;
    
    if (!storedProfile) {
      // User not logged in - redirect to login
      toast.error('Please log in to place a bid');
      window.location.href = '/login';
      return;
    }
    
    if (!walletAddress) {
      setShowConnectWallet(true);
    } else {
      fetchWalletBalance(); // Refresh balance when opening drawer
      setIsDrawerOpen(true);
    }
  };

  // Function to help users troubleshoot MetaMask connection issues
  const troubleshootMetaMask = () => {
    // Clear any existing toast notifications to prevent stacking
    toast.dismiss();
    
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    // Show a single unified message instead of multiple separate ones
    let message = 'MetaMask troubleshooting steps:\n\n';
    
    if (isChrome) {
      message += 
        '1. Click the puzzle icon in your Chrome toolbar\n' +
        '2. Find MetaMask and click the pin icon\n' +
        '3. Click the MetaMask icon to open it\n' +
        '4. Unlock your MetaMask if needed\n' +
        '5. Refresh this page';
    } else if (isFirefox) {
      message += 
        '1. Click the MetaMask icon in your toolbar\n' +
        '2. Unlock your MetaMask if needed\n' +
        '3. Refresh this page';
    } else {
      message += 'Please make sure MetaMask extension is installed, enabled, and unlocked. Then refresh this page.';
    }
    
    message += '\n\nIf MetaMask is not installed, you can download it from metamask.io';
    
    // Show just one notification
    toast.info(message, {
      autoClose: false,
      closeOnClick: true,
      position: "top-center",
      onClick: () => {
        window.open('https://metamask.io/download/', '_blank');
      }
    });
  };

  const handleConnectWallet = async () => {
    // Clear existing notifications first
    toast.dismiss();
    
    // Directly connect wallet instead of redirecting to register page
    setIsConnectingWallet(true);
    
    // Check for MetaMask or any other Ethereum provider
    // Providers can be in window.ethereum or in window.ethereum.providers array
    let ethereum = null;
    
    if (window.ethereum) {
      // Modern dapp browsers
      ethereum = window.ethereum;
    } else if (window.web3) {
      // Legacy dapp browsers
      ethereum = window.web3.currentProvider;
    } else {
      // Try to find MetaMask in the providers list (some browsers put it there)
      if (window.ethereum && window.ethereum.providers) {
        const metaMaskProvider = window.ethereum.providers.find(p => p.isMetaMask);
        if (metaMaskProvider) {
          ethereum = metaMaskProvider;
        }
      }
    }
    
    if (!ethereum) {
      // Just use troubleshootMetaMask directly instead of showing multiple errors
      troubleshootMetaMask();
      setIsConnectingWallet(false);
      return;
    }
  
    try {
      // Request accounts
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        
        // Update user profile in localStorage with the wallet address
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          profile.walletAddress = walletAddress;
          localStorage.setItem("userProfile", JSON.stringify(profile));
          
          toast.success('Wallet connected successfully!');
          setShowConnectWallet(false);
          
          // Fetch the updated wallet balance
          await fetchWalletBalance();
          
          setIsDrawerOpen(true); // Open bid drawer after wallet is connected
        }
      }
    } catch (err) {
      console.error('MetaMask connection error:', err);
      if (err.code === 4001) {
        // User rejected the request
        toast.error('Wallet connection rejected. Please approve the connection request in MetaMask.');
      } else {
        toast.error(`Failed to connect wallet: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Add a function to validate bid input
  const validateBidAmount = async (amount) => {
    const numAmount = Number(amount);
    const minBid = listingData.latestBid?.bidPrice || listingData.startingPrice;
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setBidError('Please enter a valid bid amount');
      return false;
    }
    
    if (numAmount <= minBid) {
      setBidError(`Bid must be higher than ${currency}${minBid}`);
      return false;
    }
    
    // Get wallet balance directly from MetaMask/web3 provider
    const storedProfile = localStorage.getItem("userProfile");
    const walletAddress = storedProfile ? JSON.parse(storedProfile).walletAddress : null;
    
    if (!walletAddress) {
      setBidError('Wallet not connected');
      setHasSufficientFunds(false);
      return false;
    }
    
    try {
      // Use MetaMask provider to get real balance
      let ethereum = window.ethereum || 
                    (window.web3 && window.web3.currentProvider) || 
                    (window.ethereum && window.ethereum.providers && 
                     window.ethereum.providers.find(p => p.isMetaMask));
      
      if (!ethereum) {
        setBidError('Cannot access wallet');
        setHasSufficientFunds(false);
        return false;
      }
      
      // Get ETH balance in Wei
      const balanceInWei = await ethereum.request({
        method: 'eth_getBalance',
        params: [walletAddress, 'latest']
      });
      
      // Convert Wei to ETH
      const balanceInEth = parseInt(balanceInWei, 16) / 1e18;
      
      // Get current ETH to USD conversion rate
      let ethPrice;
      try {
        // Try to fetch from Coingecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        ethPrice = data.ethereum.usd;
      } catch (error) {
        // Fallback to a reasonable value if API fails
        console.error('Error fetching ETH price:', error);
        ethPrice = 3000; // Fallback price
      }
      
      // Calculate wallet balance in USD
      const balanceUsd = balanceInEth * ethPrice;
      
      if (numAmount > balanceUsd) {
        setBidError(`Insufficient funds. Your wallet balance: ${currency}${balanceUsd.toFixed(2)} (${balanceInEth.toFixed(4)} ETH)`);
        setHasSufficientFunds(false);
        return false;
      }
      
      setBidError('');
      setHasSufficientFunds(true);
      return true;
    } catch (error) {
      console.error('Error checking wallet balance:', error);
      setBidError('Error checking wallet balance');
      setHasSufficientFunds(false);
      return false;
    }
  };

  // Handle bid amount change with validation
  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    setBidAmount(value);
    validateBidAmount(value); // This is now async but we don't need to await it here
  };

  const handlePlaceBid = async () => {
    // Validate before proceeding - now we need to await the validation
    if (!(await validateBidAmount(bidAmount))) {
      return;
    }
    
    setIsPlacingBid(true);
    try {
      const storedProfile = localStorage.getItem("userProfile");
      const userId = storedProfile ? JSON.parse(storedProfile).id : null;
      const token = localStorage.getItem("token");
      
      // Check if user is logged in
      if (!userId) {
        toast.error('You need to be logged in to place a bid.');
        setIsPlacingBid(false);
        return;
      }
      
      // Check if wallet is connected
      const walletAddress = storedProfile ? JSON.parse(storedProfile).walletAddress : null;
      
      // Check if MetaMask is available and wallet is not connected
      if (!walletAddress) {
        // First check if MetaMask is installed
        const hasMetaMask = window.ethereum || 
                          (window.web3 && window.web3.currentProvider) || 
                          (window.ethereum && window.ethereum.providers && 
                          window.ethereum.providers.find(p => p.isMetaMask));
        
        if (!hasMetaMask) {
          // Just use troubleshootMetaMask directly instead of showing multiple errors
          troubleshootMetaMask();
          setIsPlacingBid(false);
          return;
        }
        
        // Show wallet connection modal
        setIsPlacingBid(false);
        setIsDrawerOpen(false);
        setShowConnectWallet(true);
        return;
      }
      
      // Use category information from navigation state if present, otherwise use from listing data
      const categoryDisplay = categoryFromNav || listingData.product.category || '';
      const subCategory = subCategoryFromNav || listingData.product.subCategory || '';
      
      // Don't convert to enum format - backend may not handle it correctly
      // Just pass the display category as-is
      const category = categoryDisplay;
      
      console.log("Placing bid with category:", category, "subcategory:", subCategory);
      
      const response = await fetch('http://150.136.175.145:2278/api/bid/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          listingId: listingData.listingId,
          userId,
          amount: Number(bidAmount),
          category,
          subCategory
        })
      });
      
      // Handle different status codes with specific error messages
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText, 'Status:', response.status);
        
        switch (response.status) {
          case 401:
            toast.error('Unauthorized: You cannot bid on your own listing or you do not have permission to place this bid.');
            break;
          case 404:
            toast.error('Listing not found: This item may have been removed.');
            break;
          case 429:
            toast.error('Too many requests: Please wait before placing another bid.');
            break;
          case 208:
            toast.error('You already have the highest bid. Wait for someone else to bid before placing a new one.');
            break;
          case 400:
            toast.error('Invalid bid: Your bid must be higher than the current highest bid.');
            break;
          case 406:
            toast.error('Insufficient funds: Your bid amount exceeds your wallet balance.');
            break;
          default:
            toast.error(`Failed to place bid: ${response.status}`);
        }
        throw new Error(`${response.status}`);
      }
      
      const data = await response.json();
      setBidConfirmation({ bidPrice: data.bidPrice, bidDate: data.bidDate });
      setIsDrawerOpen(false);
      
      // Show category information in toast success
      if (categoryDisplay) {
        toast.success(`Bid placed in category: ${categoryDisplay}${subCategory ? ` (${subCategory})` : ''}`);
      } else {
        toast.success('Bid placed successfully!');
      }
    } catch (err) {
      // This will only show for errors not caught by the status code handlers
      if (!err.message.match(/^[0-9]+$/)) {
        toast.error('Failed to place bid: ' + err.message);
      }
    } finally {
      setIsPlacingBid(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!listingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center">
        <p className="text-white text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500">
          {/* Listing Status */}
          <div className="mb-4 flex items-center gap-3">
            <span className="px-4 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: listingData.status === 2 ? '#22c55e' : '#64748b', // green for ACTIVE, gray for others
                color: 'white',
              }}
            >
              {LISTING_STATUS_MAP[listingData.status] || 'UNKNOWN'}
            </span>
            {listingData.status !== 2 && (
              <span className="text-red-400 text-sm">This bid is not active.</span>
            )}
            {listingData.status === 2 && (
              <span className="text-green-400 text-sm">Bidding is active!</span>
            )}
          </div>

          {/* Product Images and Details */}
          <div className="flex gap-12 flex-col sm:flex-row">
            {/* Product Images */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="w-full">
                <img
                  src={selectedImage}
                  className="w-full h-auto rounded-lg border border-white/10"
                  alt={listingData.product.name}
                />
              </div>
              <div className="flex overflow-x-auto gap-3">
                <img
                  onClick={() => setSelectedImage(`http://150.136.175.145:2280/cdn/${listingData.mainImageId}.png`)}
                  src={`http://150.136.175.145:2280/cdn/${listingData.mainImageId}.png`}
                  className="w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 object-cover"
                  alt="Main"
                />
                {listingData.displayImageIds.map((imageId, index) => (
                  <img
                    key={index}
                    onClick={() => setSelectedImage(`http://150.136.175.145:2280/cdn/${imageId}.png`)}
                    src={`http://150.136.175.145:2280/cdn/${imageId}.png`}
                    className="w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300 object-cover"
                    alt={`Display ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl font-bold text-white">{listingData.product.name}</h1>
              
              {/* Owner Information */}
              <div className="flex items-center gap-3 text-blue-200">
                <img 
                  src={ownerData?.avatarId ? `http://150.136.175.145:2280/cdn/${ownerData.avatarId}.png` : assets.default_avatar} 
                  alt={ownerData?.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">Listed by {ownerData?.name}</p>
                  <p className="text-sm">Member since {new Date(ownerData?.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Price Information */}
              <div className="space-y-2">
                <p className="text-2xl text-blue-200">Starting Price: {currency}{listingData.startingPrice}</p>
                {listingData.latestBid && (
                  <p className="text-2xl text-green-400">Latest Bid: {currency}{listingData.latestBid.bidPrice}</p>
                )}
              </div>

              {/* Category Information */}
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-200 rounded-full text-sm">
                  {listingData.product.category}
                </span>
                <span className="px-3 py-1 bg-blue-600/20 text-blue-200 rounded-full text-sm">
                  {listingData.product.subCategory}
                </span>
              </div>

              {/* Auction Dates */}
              <div className="space-y-2 text-blue-200">
                <p>Start Date: {new Date(listingData.startDate).toLocaleString()}</p>
                <p>End Date: {new Date(listingData.endDate).toLocaleString()}</p>
              </div>

              <button
                onClick={handleBidClick}
                className="w-full py-4 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                PLACE BID
              </button>

              <hr className="border-white/10" />

              <div className="space-y-3 text-sm text-blue-200">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Seller Reputation: {ownerData?.reputation || 0}
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Delivery Location: {ownerData?.deliveryLocation || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12">
            <div className="flex">
              <button className="px-6 py-3 bg-blue-600/20 text-white rounded-t-lg border border-white/10 border-b-0">
                Description
              </button>
            </div>
            <div className="p-6 border border-white/10 rounded-b-lg rounded-tr-lg bg-white/5 text-blue-200 space-y-4">
              <p>{listingData.product.description}</p>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <RelatedProducts
              category={listingData.product.category}
              subcategory={listingData.product.subCategory}
            />
          </div>
        </div>
      </div>

      {/* Bid Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsDrawerOpen(false)}></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-black text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-2xl font-bold text-white mb-6">Place Your Bid</h3>

                <div className="space-y-4">
                  <p className="text-blue-200">Current highest bid: {currency}{listingData.latestBid?.bidPrice || listingData.startingPrice}</p>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-white font-medium">{listingData.product.name}</p>
                    <p className="text-blue-200 mt-2">Starting Price: {currency}{listingData.startingPrice}</p>
                  </div>
                  
                  {/* Wallet Balance Information */}
                  <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-200">Your Wallet Balance:</span>
                      {isLoadingBalance ? (
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-blue-200">
                          {walletBalance.eth.toFixed(4)} ETH
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-blue-200">Approx USD Value:</span>
                      <span className="text-sm font-medium text-blue-200">
                        {isLoadingBalance ? "Loading..." : `${currency}${walletBalance.usd.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={fetchWalletBalance} 
                        className="text-xs text-blue-300 hover:text-blue-200"
                        disabled={isLoadingBalance}
                      >
                        {isLoadingBalance ? 'Refreshing...' : 'Refresh Balance'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-200 text-sm">Your Bid Amount</label>
                    <input
                      type="number"
                      min={listingData.latestBid?.bidPrice || listingData.startingPrice}
                      value={bidAmount}
                      onChange={handleBidAmountChange}
                      className={`px-3 py-2 rounded border ${
                        bidError 
                          ? 'border-red-500 bg-red-900/20' 
                          : hasSufficientFunds 
                            ? 'border-white/20 bg-white/10 focus:border-blue-500' 
                            : 'border-orange-500/50 bg-orange-900/20'
                      } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {bidError && (
                      <p className="text-xs text-red-400 mt-1">{bidError}</p>
                    )}
                    <button
                      onClick={handlePlaceBid}
                      disabled={isPlacingBid || bidError !== ''}
                      className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                  </div>
                  <p className="text-sm text-blue-200">
                    Auction ends on {new Date(listingData.endDate).toLocaleString()}
                  </p>
                  
                  {/* Bidding Rules and Information */}
                  <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-200 mb-2">Bidding Rules:</h4>
                    <ul className="text-xs text-blue-300 space-y-1 list-disc pl-5">
                      <li>Your bid must be higher than the current highest bid</li>
                      <li>You must have sufficient funds in your wallet</li>
                      <li>You cannot bid on your own listings</li>
                      <li>You cannot place consecutive bids without another bidder in between</li>
                      <li>There is a cooldown period of 1 minute between bids</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-blue-500/20">
                      <p className="text-xs text-blue-300">Need help? If you encounter any issues, please check your wallet connection and balance, or contact support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid Confirmation Dialog */}
      {bidConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Bid Placed Successfully!</h2>
            <p className="text-lg text-gray-800 mb-2">Bid Amount: <span className="font-semibold">{currency}{bidConfirmation.bidPrice}</span></p>
            <p className="text-lg text-gray-800 mb-4">Bid Date: <span className="font-semibold">{new Date(bidConfirmation.bidDate).toLocaleString()}</span></p>
            <button
              onClick={() => setBidConfirmation(null)}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Wallet Connection Dialog */}
      {showConnectWallet && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="wallet-dialog" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowConnectWallet(false)}></div>
            <div className="relative inline-block transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-blue-900 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
              <div className="px-6 pt-5 pb-6">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  <h3 className="mt-4 text-2xl font-bold text-white">Connect Your Wallet</h3>
                  <p className="mt-2 text-sm text-blue-200">
                    You need to connect a cryptocurrency wallet to place bids on our platform.
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  <p className="text-xs text-blue-300">
                    Connecting your wallet will allow you to:
                  </p>
                  <ul className="text-xs text-blue-300 list-disc pl-5 space-y-1">
                    <li>Place bids on items</li>
                    <li>Create and sell your own items</li>
                    <li>Receive funds from sales</li>
                    <li>Track your transaction history</li>
                  </ul>
                  
                  {/* Troubleshooting guide */}
                  <div className="mt-4 p-3 bg-blue-900/40 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-200 mb-2">Having trouble?</h4>
                    <ol className="text-xs text-blue-300 list-decimal pl-5 space-y-1">
                      <li>Make sure MetaMask is installed in your browser</li>
                      <li>Check that the MetaMask extension is enabled</li>
                      <li>Unlock your MetaMask wallet if it's locked</li>
                      <li>Refresh this page and try again</li>
                    </ol>
                    <p className="text-xs text-blue-300 mt-2">
                      <button 
                        onClick={() => window.open('https://metamask.io/download/', '_blank')}
                        className="text-blue-400 underline">
                        Get MetaMask
                      </button> if you don't have it installed.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3 mt-8">
                    <button
                      onClick={handleConnectWallet}
                      disabled={isConnectingWallet}
                      className="w-full bg-blue-600 py-3 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                      {isConnectingWallet ? (
                        <>
                          <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          Connecting...
                        </>
                      ) : 'Connect Wallet'}
                    </button>
                    <button
                      onClick={() => setShowConnectWallet(false)}
                      className="w-full border border-white/20 py-3 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
