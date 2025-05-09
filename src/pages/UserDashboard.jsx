import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductListing from "./ProductListing";

const UserDashboard = () => {
  const storedProfile = localStorage.getItem("userProfile");
  const id = storedProfile ? JSON.parse(storedProfile).id : null;

  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://150.136.175.145:2278/api/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setProfile(data);
        console.log("Fetched user data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (!profile) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
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
              <p className="text-blue-200 text-sm mb-1">Wallet: {walletAddress}</p>
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

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Add New Product
          </button>

          <ProductListing isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
