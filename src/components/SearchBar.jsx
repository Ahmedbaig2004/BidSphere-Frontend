import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const {search, setsearch, showsearch, setshowsearch} = useContext(ShopContext)
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

            const response = await fetch('http://150.136.175.145:2278/api/listing/catalog', {
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
        <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/50 border-b border-white/20">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="relative flex items-center">
                    <div className="flex-1 flex items-center bg-white/10 rounded-full px-6 py-3">
                        <input
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm"
                            type="text"
                            placeholder="Search for products..."
                            autoFocus
                        />
                        <img className="w-5 h-5 opacity-50" src={assets.search_icon} alt="search" />
                    </div>
                    <button
                        onClick={() => setshowsearch(false)}
                        className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                        <img className="w-4 h-4" src={assets.cross_icon} alt="close" />
                    </button>
                </div>
                {/* Search Results */}
                {search && (
                    <div className="mt-4 max-h-96 overflow-y-auto bg-black/80 rounded-lg">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.listingId}
                                    onClick={() => handleProductClick(product.listingId)}
                                    className="p-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-0"
                                >
                                    <h3 className="text-white font-medium">{product.product.name}</h3>
                                    <p className="text-white/70 text-sm mt-1">
                                        Starting Price: ${product.startingPrice}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-white/70 text-center">
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
