import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const categoryMap = {
    "Electronics": ["Smartphones", "Laptops", "Cameras", "Tablets", "Wearable Devices"],
    "Collectibles And Antiques": ["Coins", "Stamps", "Paintings", "Music", "Home Decor"],
    "Home and Living": ["Furniture", "Decor", "Bedding", "Kitchenware"],
    "Sports And Fitness": ["Exercise Equipment", "Sportswear", "Accessories"],
    "Vehicle Accessories": ["Car Parts", "Motorbike Accessories", "Tools"],
    "Fashion And Lifestyle": ["Clothing", "Footwear", "Watches", "Jewelry", "Accessories"]
};

const ProductListing = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [mainImageBase64, setMainImageBase64] = useState('');
    const [mainImageId, setMainImageId] = useState('');
    const [imageUploadStatus, setImageUploadStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [debugInfo, setDebugInfo] = useState({});
    const navigate = useNavigate();

    const sellerId = JSON.parse(localStorage.getItem('userProfile'))?.user?.id;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024 * 2) {
            setErrorMessage('Image is too large (max 2MB). Please select a smaller image.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setMainImageBase64(base64String);
            setMainImageId(uuidv4());
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async () => {
        if (!mainImageBase64) return null;

        setImageUploadStatus('uploading');
        try {
            const formattedImage = mainImageBase64.includes(',')
                ? mainImageBase64.split(',')[1]
                : mainImageBase64;

            const payload = { image: formattedImage };

            console.log("Media upload payload:", {
                ...payload,
                image: payload.image.substring(0, 100) + '...'
            });

            const mediaRes = await fetch('http://150.136.175.145:2278/api/media/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(15000),
            });

            const responseText = await mediaRes.text();
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                responseData = { rawText: responseText };
                console.log(e);
            }

            setDebugInfo({ endpoint: '2278', status: mediaRes.status, response: responseData });

            if (mediaRes.ok) {
                setImageUploadStatus('success');
                return mainImageId;
            } else {
                throw new Error(`Upload failed with status: ${mediaRes.status}`);
            }
        } catch (err) {
            setImageUploadStatus('error');
            console.warn('Image upload failed:', err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!sellerId) return toast.error("No seller profile found.");
      
        const uploadedImageId = await uploadImage();
        if (!uploadedImageId) return toast.error("Image upload failed");
      
        const productPayload = {
          id: uuidv4(),
          sellerId,
          name,
          description,
          startingPrice: parseFloat(startingPrice),
          mainImageId: uploadedImageId,
          displayImageIds: [uploadedImageId],
          category,
          subCategory,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          bestseller: false,
          status: "0",
          authenticity: 0,
          latestBid: {}
        };
      
        console.log("Product Payload:", productPayload);
      
        try {
          const res = await fetch("http://150.136.175.145:2278/api/listing/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(productPayload),
          });
      
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to create product:", errorText);
            return toast.error("Failed to create product listing");
          }
      
          toast.success("Product listed successfully");
      
          // Optional: reset form or redirect user
          // resetForm();
          navigate("/collection");
      
        } catch (error) {
          console.error("Error submitting product:", error);
          toast.error("Something went wrong");
        }
      };
      

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500">
                    <h2 className="text-3xl font-bold mb-8 text-center text-white animate-fade-in">List a New Product</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">Product Name</label>
                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">Description</label>
                            <textarea
                                placeholder="Enter product description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="3"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">Starting Price</label>
                            <input
                                type="number"
                                placeholder="e.g., 100"
                                value={startingPrice}
                                onChange={(e) => setStartingPrice(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-blue-200">Auction Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-blue-200">Auction End Date</label>
                                <input
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-blue-200">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                >
                                    <option value="">Select Category</option>
                                    {Object.keys(categoryMap).map((cat) => (
                                        <option key={cat} value={cat} className="bg-gray-900">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-blue-200">Subcategory</label>
                                <select
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    required
                                    disabled={!category}
                                    className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                        !category ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <option value="">Select Subcategory</option>
                                    {category &&
                                        categoryMap[category].map((sub) => (
                                            <option key={sub} value={sub} className="bg-gray-900">
                                                {sub}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-200 hover:file:bg-blue-600/30"
                            />
                            {mainImageBase64 && (
                                <div className="mt-2 flex items-center space-x-4">
                                    <img
                                        src={mainImageBase64}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border border-white/10"
                                    />
                                    {imageUploadStatus === 'uploading' && (
                                        <span className="text-blue-200">Uploading...</span>
                                    )}
                                    {imageUploadStatus === 'success' && (
                                        <span className="text-green-200">Upload successful</span>
                                    )}
                                    {imageUploadStatus === 'error' && (
                                        <span className="text-red-200">Upload failed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            List Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
