import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { currency } = useContext(ShopContext);
  const [listingData, setListingData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidConfirmation, setBidConfirmation] = useState(null);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

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

  useEffect(() => {
    fetchListingData();
  }, [productId]);

  useEffect(() => {
    if (listingData) {
      setBidAmount(listingData.latestBid?.bidPrice || listingData.startingPrice);
    }
  }, [listingData]);

  const handleBidClick = () => {
    setIsDrawerOpen(true);
  };

  const handlePlaceBid = async () => {
    setIsPlacingBid(true);
    try {
      const storedProfile = localStorage.getItem("userProfile");
      const userId = storedProfile ? JSON.parse(storedProfile).id : null;
      const token = localStorage.getItem("token");
      if (!userId) {
        toast.error('User not logged in.');
        setIsPlacingBid(false);
        return;
      }
      const response = await fetch('http://150.136.175.145:2278/api/bid/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          listingId: listingData.listingId,
          userId,
          amount: Number(bidAmount)
        })
      });
      if (!response.ok) {
        throw new Error('Failed to place bid');
      }
      const data = await response.json();
      setBidConfirmation({ bidPrice: data.bidPrice, bidDate: data.bidDate });
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error('Failed to place bid.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
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

              <p className="text-blue-200 leading-relaxed">{listingData.product.description}</p>

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

      {/* Animated Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-white/20 shadow-2xl`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Place Your Bid</h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-white hover:text-blue-300 transition-colors duration-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-blue-200">Current highest bid: {currency}{listingData.latestBid?.bidPrice || listingData.startingPrice}</p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-white font-medium">{listingData.product.name}</p>
              <p className="text-blue-200 mt-2">Starting Price: {currency}{listingData.startingPrice}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-blue-200 text-sm">Your Bid Amount</label>
              <input
                type="number"
                min={listingData.latestBid?.bidPrice || listingData.startingPrice}
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                className="px-3 py-2 rounded border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
              </button>
            </div>
            <p className="text-sm text-blue-200">
              Auction ends on {new Date(listingData.endDate).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Product;
