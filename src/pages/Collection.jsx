import { useEffect, useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Collection = () => {
  const categorySubcategoriesMap = {
    "Electronics": ["Smartphones", "Laptops", "Cameras", "Tablets", "Wearable Devices"],
    "Collectibles And Antiques": ["Coins", "Stamps", "Paintings", "Music", "Home Decor"],
    "Home and Living": ["Furniture", "Decor", "Bedding", "Kitchenware"],
    "Sports And Fitness": ["Exercise Equipment", "Sportswear", "Accessories"],
    "Vehicle Accessories": ["Car Parts", "Motorbike Accessories", "Tools"],
    "Fashion And Lifestyle": ["Clothing", "Footwear", "Watches", "Jewelry", "Accessories"]
  };

  const { search, showsearch } = useContext(ShopContext);
  const [showfilter, setshowfilter] = useState(false);
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortType, setsorttype] = useState('relevant');
  const [page, setPage] = useState(0);
  const [priceRange, setPriceRange] = useState({ start: 0, end: 0 });

  const fetchCatalog = async () => {
    try {
      const response = await fetch('http://150.136.175.145:2278/api/listing/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textQuery: search || "",
          categories: selectedCategory ? [selectedCategory] : [],
          priceStart: priceRange.start,
          priceEnd: priceRange.end,
          page: page
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch catalog');
      }

      const data = await response.json();
      setListings(data.listings);
    } catch (error) {
      console.error('Error fetching catalog:', error);
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
    let sortedListings = [...listings];
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
        fetchCatalog();
        return;
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
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
                <button
                  onClick={() => setshowfilter(!showfilter)}
                  className="w-full flex items-center justify-between text-white text-lg font-medium mb-4 hover:text-blue-300 transition-colors duration-300"
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
                    <h3 className="text-sm font-medium text-blue-200 mb-3">CATEGORIES</h3>
                    <div className="space-y-2">
                      {Object.keys(categorySubcategoriesMap).map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategory === category}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500"
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
                        <h3 className="text-sm font-medium text-blue-200 mb-3">SUBCATEGORIES</h3>
                        <div className="space-y-2">
                          {subcategoriesToShow.map((subcategory) => (
                            <label
                              key={subcategory}
                              className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubcategories.includes(subcategory)}
                                onChange={() => toggleSubcategory(subcategory)}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500"
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
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <Title text1="ALL" text2="COLLECTIONS" />
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link
                    to="/product-listing"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center"
                  >
                    Add Item
                  </Link>
                  <select
                    onChange={(e) => setsorttype(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevant">Sort By: Relevant</option>
                    <option value="low-high">Sort By: Low to High</option>
                    <option value="high-low">Sort By: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <ProductItem
                      key={listing.listingId}
                      id={listing.listingId}
                      name={listing.product.name}
                      image={`http://150.136.175.145:2280/cdn/${listing.mainImageId}.png`}
                      price={listing.latestBid?.bidPrice || listing.startingPrice}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-white text-lg">No products found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
