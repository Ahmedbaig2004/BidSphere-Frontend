import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext'

const SearchBar = () => {
    const {search, setsearch, showsearch, setshowsearch} = useContext(ShopContext)
    const { isLightTheme } = useContext(ThemeContext)
    const location = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (showsearch) {
            setVisible(true);
            // Fetch products when search is shown
            fetchProducts();
        } else {
            setVisible(false);
        }
    }, [showsearch]);

    const fetchProducts = async () => {
        try {
            const requestBody = {
                pageSize: 100,
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
            
            const data = await response.json();
            setProducts(data.listings);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        // Filter products based on search input
        const filtered = products.filter(product => 
            product.product.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [search, products]);

    const handleProductClick = (listingId) => {
        navigate(`/product/${listingId}`);
        setshowsearch(false);
    };

    if (!visible) return null;

    return (
        <div className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg ${isLightTheme ? 'bg-blue-50/70 border-blue-200' : 'bg-black/50 border-white/20'} border-b`}>
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="relative flex items-center">
                    <div className={`flex-1 flex items-center ${isLightTheme ? 'bg-white/70 text-gray-800' : 'bg-white/10 text-white'} rounded-full px-6 py-3`}>
                        <input
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            className={`flex-1 bg-transparent outline-none ${isLightTheme ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-white/50'} text-sm`}
                            type="text"
                            placeholder="Search for products..."
                            autoFocus
                        />
                        <img className="w-5 h-5 opacity-50" src={assets.search_icon} alt="search" />
                    </div>
                    <button
                        onClick={() => setshowsearch(false)}
                        className={`ml-4 p-2 hover:${isLightTheme ? 'bg-blue-200/30' : 'bg-white/10'} rounded-full transition-colors duration-200`}
                    >
                        <img className="w-4 h-4" src={assets.cross_icon} alt="close" />
                    </button>
                </div>
                {/* Search Results */}
                {search && (
                    <div className={`mt-4 max-h-96 overflow-y-auto ${isLightTheme ? 'bg-white/90' : 'bg-black/80'} rounded-lg`}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.listingId}
                                    onClick={() => handleProductClick(product.listingId)}
                                    className={`p-4 hover:${isLightTheme ? 'bg-blue-100/50' : 'bg-white/10'} cursor-pointer border-b ${isLightTheme ? 'border-blue-200/30' : 'border-white/10'} last:border-0`}
                                >
                                    <h3 className={`${isLightTheme ? 'text-gray-800' : 'text-white'} font-medium`}>{product.product.name}</h3>
                                    <p className={`${isLightTheme ? 'text-gray-600' : 'text-white/70'} text-sm mt-1`}>
                                        Starting Price: ${product.startingPrice}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className={`p-4 ${isLightTheme ? 'text-gray-600' : 'text-white/70'} text-center`}>
                                No products found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar
