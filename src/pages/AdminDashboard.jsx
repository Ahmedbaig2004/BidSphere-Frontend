import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

// Product Detail Modal Component
const ProductDetailModal = ({ isOpen, onClose, listingId }) => {
  const [listingData, setListingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-black text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : listingData ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">{listingData.product.name}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
                    <h4 className="text-lg font-medium text-white">Price Information</h4>
                    <p className="text-blue-200">Starting Price: ${listingData.startingPrice}</p>
                    {listingData.latestBid && (
                      <p className="text-green-400">Latest Bid: ${listingData.latestBid.bidPrice}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-white">Category Information</h4>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-200 rounded-full text-sm">
                        {listingData.product.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-200 rounded-full text-sm">
                        {listingData.product.subCategory}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-white">Auction Dates</h4>
                    <p className="text-blue-200">Start Date: {new Date(listingData.startDate).toLocaleString()}</p>
                    <p className="text-blue-200">End Date: {new Date(listingData.endDate).toLocaleString()}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-white">Description</h4>
                    <p className="text-blue-200">{listingData.product.description}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowCancelConfirmation(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Auction
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-white">Failed to load product details</p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setShowCancelConfirmation(false)}></div>
            <div className="relative bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-white mb-4">Confirm Auction Cancellation</h3>
              <p className="text-blue-200 mb-6">Are you sure you want to cancel this auction? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCancelConfirmation(false)}
                  className="px-4 py-2 text-white hover:text-blue-200"
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
    </div>
  );
};

const AdminDashboard = () => {
  const [listings, setListings] = useState({
    newListings: [],
    popularListings: []
  });
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [timeFilter, setTimeFilter] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchListings();
    fetchAllListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/homepage`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      setListings({
        newListings: data.newListings,
        popularListings: data.popularListings
      });
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllListings = async () => {
    try {
      const requestBody = {
        pageSize: 1000, // Fetch a large number to get all listings
        pageNumber: 1,
        sortBy: "startDate",
        sortDirection: "desc"
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all listings');
      }

      const data = await response.json();
      setAllListings(data.listings);
    } catch (error) {
      console.error('Error fetching all listings:', error);
      toast.error('Failed to load all listings');
    }
  };

  // Calculate listing statistics
  const listingStats = {
    active: allListings.filter(l => l.status === 2).length,
    completed: allListings.filter(l => l.status === 3).length,
    terminated: allListings.filter(l => l.status === 5).length,
  };

  // Calculate user statistics
  const userStats = {
    totalUsers: new Set(allListings.map(l => l.sellerId)).size,
    activeSellers: new Set(allListings.filter(l => l.status === 2).map(l => l.sellerId)).size,
    activeBidders: new Set(allListings.filter(l => l.latestBid).map(l => l.latestBid.userId)).size,
    newUsers: new Set(allListings.filter(l => {
      const listingDate = new Date(l.startDate);
      const now = new Date();
      const diffHours = (now - listingDate) / (1000 * 60 * 60);
      return diffHours <= 24;
    }).map(l => l.sellerId)).size
  };

  // Calculate category statistics
  const categoryStats = {
    popularCategories: Object.entries(
      allListings.reduce((acc, listing) => {
        const category = listing.product?.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 5),
    activeCategories: Object.entries(
      allListings.filter(l => l.status === 2).reduce((acc, listing) => {
        const category = listing.product?.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 5)
  };

  // Calculate time-based statistics
  const getTimeFilteredStats = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return {
      created: allListings.filter(l => new Date(l.startDate) >= filterDate).length,
      ending: allListings.filter(l => new Date(l.endDate) >= filterDate && new Date(l.endDate) <= now).length,
      bids: allListings.filter(l => l.latestBid && new Date(l.latestBid.bidDate) >= filterDate).length
    };
  };

  const timeStats = getTimeFilteredStats();

  const renderListingItem = (listing) => (
    <div
      key={listing.listingId}
      onClick={() => setSelectedListingId(listing.listingId)}
      className="p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-0"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium">{listing.product?.name || "Unnamed Product"}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/70 text-sm">
              Starting Price: ${listing.startingPrice || "N/A"}
            </span>
            <span className="text-white/70 text-sm">•</span>
            <span className="text-white/70 text-sm">
              Category: {listing.product?.category || "Uncategorized"}
            </span>
            {listing.latestBid && (
              <>
                <span className="text-white/70 text-sm">•</span>
                <span className="text-green-400 text-sm">
                  Current bid: ${listing.latestBid.bidPrice}
                </span>
              </>
            )}
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: listing.status === 2 ? '#22c55e' : '#64748b',
            color: 'white',
          }}
        >
          {LISTING_STATUS_MAP[listing.status] || 'UNKNOWN'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Listing Statistics */}
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-base font-medium text-white mb-3">Listing Statistics</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-blue-200 text-xs">Active Listings</p>
                  <p className="text-xl font-bold text-white">{listingStats.active}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Completed Listings</p>
                  <p className="text-xl font-bold text-white">{listingStats.completed}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Terminated Listings</p>
                  <p className="text-xl font-bold text-white">{listingStats.terminated}</p>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-base font-medium text-white mb-3">User Statistics</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-blue-200 text-xs">Total Users</p>
                  <p className="text-xl font-bold text-white">{userStats.totalUsers}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Active Sellers</p>
                  <p className="text-xl font-bold text-white">{userStats.activeSellers}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Active Bidders</p>
                  <p className="text-xl font-bold text-white">{userStats.activeBidders}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">New Users (24h)</p>
                  <p className="text-xl font-bold text-white">{userStats.newUsers}</p>
                </div>
              </div>
            </div>

            {/* Category Statistics */}
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-base font-medium text-white mb-3">Category Statistics</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-blue-200 text-xs mb-1">Most Popular Categories</p>
                  <div className="space-y-1">
                    {categoryStats.popularCategories.map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-white text-xs">{category}</span>
                        <span className="text-blue-200 text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-blue-200 text-xs mb-1">Most Active Categories</p>
                  <div className="space-y-1">
                    {categoryStats.activeCategories.map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-white text-xs">{category}</span>
                        <span className="text-blue-200 text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Time-based Statistics */}
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-white/10">
              <h3 className="text-base font-medium text-white mb-3">Time-based Statistics</h3>
              <div className="mb-3">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-gray-400 text-sm"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-blue-200 text-xs">Listings Created</p>
                  <p className="text-xl font-bold text-white">{timeStats.created}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Listings Ending</p>
                  <p className="text-xl font-bold text-white">{timeStats.ending}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Bids Placed</p>
                  <p className="text-xl font-bold text-white">{timeStats.bids}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Section */}
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p className="mt-2 text-white">Loading listings...</p>
              </div>
            ) : (
              <>
                {/* New Listings Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">New Listings</h2>
                  <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10">
                    {listings.newListings.map(renderListingItem)}
                  </div>
                </div>

                {/* Popular Listings Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Popular Listings</h2>
                  <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10">
                    {listings.popularListings.map(renderListingItem)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedListingId}
        onClose={() => setSelectedListingId(null)}
        listingId={selectedListingId}
      />
    </div>
  );
};

export default AdminDashboard; 