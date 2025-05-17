import { useEffect, useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const Auctions = () => {
  // Define categories with proper formatting for API compatibility
  const categoryMap = {
    "Electronics": "ELECTRONICS",
    "Collectibles And Antiques": "COLLECTIBLES_AND_ANTIQUES",
    "Home and Living": "HOME_AND_LIVING",
    "Sports And Fitness": "SPORTS_AND_FITNESS",
    "Vehicle Accessories": "VEHICLE_ACCESSORIES",
    "Fashion And Lifestyle": "FASHION_AND_LIFESTYLE"
  };

  const categorySubcategoriesMap = {
    "Electronics": ["Smartphones", "Laptops", "Cameras", "Tablets", "Wearable Devices"],
    "Collectibles And Antiques": ["Coins", "Stamps", "Paintings", "Music", "Home Decor"],
    "Home and Living": ["Furniture", "Decor", "Bedding", "Kitchenware"],
    "Sports And Fitness": ["Exercise Equipment", "Sportswear", "Accessories"],
    "Vehicle Accessories": ["Car Parts", "Motorbike Accessories", "Tools"],
    "Fashion And Lifestyle": ["Clothing", "Footwear", "Watches", "Jewelry", "Accessories"]
  };

  const { search, showsearch } = useContext(ShopContext);
  const { isLightTheme } = useContext(ThemeContext);
  const [showfilter, setshowfilter] = useState(false);
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortType, setsorttype] = useState('relevant');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [priceRange, setPriceRange] = useState({ start: 0, end: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        textQuery: search || "",
        categories: [],
        subCategories: [],
        priceStart: priceRange.start || 0,
        priceEnd: priceRange.end || 0,
        page: page
      };
      
      console.log("Sending catalog request:", requestBody);
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/catalog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch catalog: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received catalog data:", data);
      
      let filteredListings = data.listings || [];
      
      if (selectedCategory && filteredListings.length > 0) {
        filteredListings = filteredListings.filter(listing => 
          listing.product.category === selectedCategory
        );
      }
      
      if (selectedSubcategories.length > 0 && filteredListings.length > 0) {
        filteredListings = filteredListings.filter(listing => 
          selectedSubcategories.includes(listing.product.subCategory)
        );
      }
      
      setListings(filteredListings);
      // Assuming the API returns total count, calculate total pages
      // If not provided, you might need to adjust this logic
      setTotalPages(Math.ceil((data.totalCount || 0) / 12)); // Assuming 12 items per page
    } catch (error) {
      console.error('Error fetching catalog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setSelectedSubcategories([]);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategories([]);
    }
  };

  const toggleSubcategory = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [search, selectedCategory, selectedSubcategories, page, priceRange]);

  const sortListings = () => {
    if (sortType === 'relevant') {
      fetchCatalog();
      return;
    }
    
    let sortedListings = [...listings];
    
    // Apply the sort
    switch (sortType) {
      case 'low-high':
        sortedListings.sort((a, b) => {
          const priceA = a.latestBid?.bidPrice || a.startingPrice;
          const priceB = b.latestBid?.bidPrice || b.startingPrice;
          return priceA - priceB;
        });
        break;
      case 'high-low':
        sortedListings.sort((a, b) => {
          const priceA = a.latestBid?.bidPrice || a.startingPrice;
          const priceB = b.latestBid?.bidPrice || b.startingPrice;
          return priceB - priceA;
        });
        break;
      default:
        break;
    }
    
    setListings(sortedListings);
  };

  useEffect(() => {
    sortListings();
  }, [sortType]);

  const subcategoriesToShow = selectedCategory ? categorySubcategoriesMap[selectedCategory] || [] : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} rounded-2xl border p-6`}>
                <button
                  onClick={() => setshowfilter(!showfilter)}
                  className={`w-full flex items-center justify-between ${isLightTheme ? 'text-gray-800' : 'text-white'} text-lg font-medium mb-4 hover:${isLightTheme ? 'text-gray-600' : 'text-blue-300'} transition-colors duration-300`}
                >
                  <span>FILTERS</span>
                  <img
                    className={`h-3 transition-transform duration-300 ${showfilter ? 'rotate-90' : ''}`}
                    src={assets.dropdown_icon}
                    alt=""
                  />
                </button>

                <div className={`space-y-6 ${showfilter ? '' : 'hidden'} lg:block`}>
                  {/* Categories */}
                  <div>
                    <h3 className={`text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-3`}>CATEGORIES</h3>
                    <div className="space-y-2">
                      {Object.keys(categorySubcategoriesMap).map((category) => (
                        <label
                          key={category}
                          className={`flex items-center gap-2 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 cursor-pointer`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategory === category}
                            onChange={() => toggleCategory(category)}
                            className={`w-4 h-4 rounded ${isLightTheme ? 'border-gray-300 bg-white/50' : 'border-white/20 bg-white/5'} checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500`}
                          />
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories */}
                  <AnimatePresence initial={false}>
                    {selectedCategory && (
                      <motion.div
                        key="subcategories-drawer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <h3 className={`text-sm font-medium ${isLightTheme ? 'text-gray-700' : 'text-blue-200'} mb-3`}>SUBCATEGORIES</h3>
                        <div className="space-y-2">
                          {subcategoriesToShow.map((subcategory) => (
                            <label
                              key={subcategory}
                              className={`flex items-center gap-2 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 cursor-pointer`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubcategories.includes(subcategory)}
                                onChange={() => toggleSubcategory(subcategory)}
                                className={`w-4 h-4 rounded ${isLightTheme ? 'border-gray-300 bg-white/50' : 'border-white/20 bg-white/5'} checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500`}
                              />
                              <span>{subcategory}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-gray-300' : 'bg-white/10 border-white/20'} rounded-2xl border p-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <Title text1="ALL" text2="AUCTIONS" />
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                 
                  <select
                    onChange={(e) => setsorttype(e.target.value)}
                    className={`px-4 py-2 ${isLightTheme ? 'bg-white/70 text-gray-800 border-gray-300' : 'bg-white/5 text-white border-white/20'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option className={isLightTheme ? 'text-gray-800' : 'text-black'} value="relevant">Sort By: Relevant</option>
                    <option className={isLightTheme ? 'text-gray-800' : 'text-black'} value="low-high">Sort By: Low to High</option>
                    <option className={isLightTheme ? 'text-gray-800' : 'text-black'} value="high-low">Sort By: High to Low</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isLightTheme ? 'border-blue-700' : 'border-blue-500'}`}></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.length > 0 ? (
                      listings.map((listing) => (
                        <ProductItem
                          key={listing.listingId}
                          id={listing.listingId}
                          name={listing.product.name}
                          image={`http://150.136.175.145:2280/cdn/${listing.mainImageId}.png`}
                          price={listing.latestBid?.bidPrice || listing.startingPrice}
                          category={selectedCategory}
                          subCategory={selectedSubcategories.length > 0 ? selectedSubcategories.join(',') : ''}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className={isLightTheme ? 'text-gray-800 text-lg' : 'text-white text-lg'}>No products found.</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className={`px-4 py-2 rounded-lg ${
                          page === 0
                            ? isLightTheme ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/10 text-white/50 cursor-not-allowed'
                            : isLightTheme ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setPage(index)}
                            className={`w-8 h-8 rounded-lg ${
                              page === index
                                ? 'bg-blue-600 text-white'
                                : isLightTheme ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={page === totalPages - 1}
                        className={`px-4 py-2 rounded-lg ${
                          page === totalPages - 1
                            ? isLightTheme ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white/10 text-white/50 cursor-not-allowed'
                            : isLightTheme ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auctions
