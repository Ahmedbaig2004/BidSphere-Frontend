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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 max-w-xl mx-auto mt-10 p-8 border rounded-2xl shadow-lg bg-white dark:bg-gray-900 dark:text-white"
        >
            <h2 className="text-2xl font-bold mb-2 text-center">List a New Product</h2>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Product Name</label>
                <input
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Description</label>
                <textarea
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                    rows="3"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Starting Price</label>
                <input
                    type="number"
                    placeholder="e.g., 100"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Auction Start Date</label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Auction End Date</label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="px-3 py-2 border rounded-md dark:bg-gray-800"
                >
                    <option value="">Select Category</option>
                    {Object.keys(categoryMap).map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Subcategory</label>
                <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    required
                    disabled={!category}
                    className={`px-3 py-2 border rounded-md ${!category ? 'bg-gray-100 text-gray-500' : 'dark:bg-gray-800'
                        }`}
                >
                    <option value="">Select Subcategory</option>
                    {category &&
                        categoryMap[category].map((sub) => (
                            <option key={sub} value={sub}>
                                {sub}
                            </option>
                        ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="font-medium">Main Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    className="text-sm"
                />
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
            >
                Submit Product
            </button>
        </form>

    );
};

export default ProductListing;
