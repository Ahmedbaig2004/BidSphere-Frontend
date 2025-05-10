import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductListing from "./ProductListing";

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

const UserDashboard = () => {
  const storedProfile = localStorage.getItem("userProfile");
  const id = storedProfile ? JSON.parse(storedProfile).id : null;
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [inventoryPage, setInventoryPage] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [loading, setLoading] = useState({
    profile: false,
    inventory: false,
    history: false
  });

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
      const res = await fetch(`http://150.136.175.145:2278/api/user/${id}`, {
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
      const res = await fetch(`http://150.136.175.145:2278/api/user/inventory/${inventoryPage}`, {
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
      const res = await fetch(`http://150.136.175.145:2278/api/user/history/${historyPage}`, {
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
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
            <p className="text-blue-200 text-sm">Registered: {new Date(registrationDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-2">Location</h3>
            <p className="text-blue-200">{deliveryLocation}</p>
          </div>
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-2">Platform Access</h3>
            <p className="text-blue-200">{platformAccess}</p>
          </div>
          <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-2">Reputation</h3>
            <p className="text-blue-200">{reputation}</p>
          </div>
        </div>
      </>
    );
  };

  const renderInventoryContent = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Your Inventory</h2>
        
        {loading.inventory ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <p className="mt-2 text-white">Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white">No items found in your inventory.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {inventory.map((listing) => (
                <div key={listing.listingId || `inv-${Math.random()}`} className="backdrop-blur-lg bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4 mb-4">
                    {listing.listingImageIds && listing.listingImageIds.length > 0 && (
                      <img 
                        src={`http://150.136.175.145:2280/cdn/${listing.listingImageIds[0]}.png`} 
                        alt={(listing.product && listing.product.name) || "Product"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-white">{listing.product ? listing.product.name : "Unnamed Product"}</h3>
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
                    <p className="text-sm text-blue-200">Starting price: ${listing.startingPrice || "N/A"}</p>
                    <p className="text-sm text-blue-200">Category: {listing.product && listing.product.category ? listing.product.category : "Uncategorized"}</p>
                    {listing.latestBid && (
                      <p className="text-sm text-green-300">Current bid: ${listing.latestBid.bidPrice}</p>
                    )}
                    <div className="mt-4">
                      <Link to={`/product/${listing.listingId}`} className="text-blue-300 hover:text-blue-100 text-sm transition-colors">
                        View details →
                      </Link>
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
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Previous
              </button>
              <span className="text-white py-2">Page {inventoryPage + 1}</span>
              <button
                onClick={handleNextInventoryPage}
                disabled={inventory.length < 10}
                className={`px-4 py-2 rounded-lg ${
                  inventory.length < 10
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
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
        <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
        
        {loading.history ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <p className="mt-2 text-white">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white">No transaction history found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {history.map((listing) => (
                <div key={listing.listingId || `hist-${Math.random()}`} className="backdrop-blur-lg bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4 mb-4">
                    {listing.listingImageIds && listing.listingImageIds.length > 0 && (
                      <img 
                        src={`http://150.136.175.145:2280/cdn/${listing.listingImageIds[0]}.png`} 
                        alt={(listing.product && listing.product.name) || "Product"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-white">{listing.product ? listing.product.name : "Unnamed Product"}</h3>
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
                        <p className="text-sm text-blue-200">Sold for: ${listing.transaction.amount}</p>
                        <p className="text-sm text-blue-200">Date: {new Date(listing.transaction.transactionDate).toLocaleString()}</p>
                      </>
                    )}
                    <div className="mt-4">
                      <Link to={`/product/${listing.listingId}`} className="text-blue-300 hover:text-blue-100 text-sm transition-colors">
                        View details →
                      </Link>
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
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                Previous
              </button>
              <span className="text-white py-2">Page {historyPage + 1}</span>
              <button
                onClick={handleNextHistoryPage}
                disabled={history.length < 10}
                className={`px-4 py-2 rounded-lg ${
                  history.length < 10
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
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
    <div className="min-h-screen from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Tabs Navigation */}
          <div className="flex border-b border-white/20 mb-8">
            <button
              className={`py-2 px-4 mr-2 text-lg font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 mr-2 text-lg font-medium ${
                activeTab === 'inventory'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-300'
              }`}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </button>
            <button
              className={`py-2 px-4 text-lg font-medium ${
                activeTab === 'history'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-300'
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

          <ProductListing isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
