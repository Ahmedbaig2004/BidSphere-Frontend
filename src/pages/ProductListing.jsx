import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const categoryMap = {
    "Electronics": ["Smartphones", "Laptops", "Cameras", "Tablets", "Wearable Devices"],
    "Collectibles And Antiques": ["Coins", "Stamps", "Paintings", "Music", "Home Decor"],
    "Home and Living": ["Furniture", "Decor", "Bedding", "Kitchenware"],
    "Sports And Fitness": ["Exercise Equipment", "Sportswear", "Accessories"],
    "Vehicle Accessories": ["Car Parts", "Motorbike Accessories", "Tools"],
    "Fashion And Lifestyle": ["Clothing", "Footwear", "Watches", "Jewelry", "Accessories"]
};

const ProductListing = ({ isOpen, onClose, onSuccess }) => {
    // First form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [productResponse, setProductResponse] = useState(null);

    // Second form states
    const [startingPrice, setStartingPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [mainImageBase64, setMainImageBase64] = useState('');
    const [mainImageId, setMainImageId] = useState('');
    const [displayImagesBase64, setDisplayImagesBase64] = useState([]);
    const [displayImageIds, setDisplayImageIds] = useState([]);
    const [imageUploadStatus, setImageUploadStatus] = useState('');

    const token = localStorage.getItem('token');

    const handleImageUpload = (e, isMain = false) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024 * 2) {
            toast.error('Image is too large (max 2MB). Please select a smaller image.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            if (isMain) {
                setMainImageBase64(base64String);
                setMainImageId(uuidv4());
            } else {
                setDisplayImagesBase64(prev => [...prev, base64String]);
                setDisplayImageIds(prev => [...prev, uuidv4()]);
            }
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (base64Image) => {
        if (!base64Image) return null;

        try {
            const formattedImage = base64Image.includes(',')
                ? base64Image.split(',')[1]
                : base64Image;

            const payload = {
                image: formattedImage
            };

            const mediaRes = await fetch(`${import.meta.env.VITE_BASE_URL}/api/media/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!mediaRes.ok) {
                throw new Error(`Upload failed with status: ${mediaRes.status}`);
            }

            const responseData = await mediaRes.text();
            return responseData;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    };

    const handleFirstStep = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productPayload = {
            name,
            description,
            category,
            subCategory
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(productPayload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Failed to create product:', errorText);
                return toast.error('Failed to create product');
            }

            const response = await res.json();
            setProductResponse(response);
            setCurrentStep(2);
            toast.success('Product created successfully');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSecondStep = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Upload main image
            const mainImageUploadId = await uploadImage(mainImageBase64);
            if (!mainImageUploadId) {
                throw new Error('Failed to upload main image');
            }

            // Upload display images
            const displayImageUploadIds = await Promise.all(
                displayImagesBase64.map(img => uploadImage(img))
            );

            const auctionPayload = {
                productId: productResponse.productId,
                startingPrice: parseFloat(startingPrice),
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                mainImageId: mainImageUploadId,
                displayImageIds: displayImageUploadIds
            };

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(auctionPayload)
            });

            if (!res.ok) {
                throw new Error('Failed to create auction');
            }

            toast.success('Auction created successfully');
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to create auction');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-xl mx-4 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {currentStep === 1 ? 'Create New Product' : 'Set Auction Details'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {currentStep === 1 ? (
                    <form onSubmit={handleFirstStep} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows="4"
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                                placeholder="Enter product description"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-gray-600"
                            >
                                <option value="">Select Category</option>
                                {Object.keys(categoryMap).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Subcategory
                            </label>
                            <select
                                value={subCategory}
                                onChange={e => setSubCategory(e.target.value)}
                                required
                                disabled={!category}
                                className={`w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-gray-600 ${
                                    !category ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <option value="">Select Subcategory</option>
                                {category && categoryMap[category].map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Next'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSecondStep} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Starting Price
                            </label>
                            <input
                                type="number"
                                value={startingPrice}
                                onChange={e => setStartingPrice(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white placeholder-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Main Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
                                required
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            {mainImageBase64 && (
                                <img src={mainImageBase64} alt="Main" className="mt-2 w-32 h-32 object-cover rounded-lg border border-white/20" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-200">
                                Display Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, false)}
                                multiple
                                className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {displayImagesBase64.map((img, index) => (
                                    <img key={index} src={img} alt={`Display ${index + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Auction'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
