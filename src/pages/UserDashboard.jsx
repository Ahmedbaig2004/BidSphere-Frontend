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
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <div className="flex items-center space-x-6">
        <img
          src={`http://150.136.175.145:2280/cdn/${avatarId}.png`}
          alt="Avatar"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">Wallet: {walletAddress}</p>
          <p className="text-sm text-gray-500">Registered: {new Date(registrationDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Location:</span> {deliveryLocation}
        </div>
        <div>
          <span className="font-semibold">Platform Access:</span> {platformAccess}
        </div>
        <div>
          <span className="font-semibold">Reputation:</span> {reputation}
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition"
      >
        Add Item
      </button>

      <ProductListing isOpen={showModal} onClose={() => setShowModal(false)} />

    </div>

  );
};

export default UserDashboard;
