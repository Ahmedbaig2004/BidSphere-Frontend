import React, { useEffect, useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
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

  const { products, search, showsearch } = useContext(ShopContext);
  const [showfilter, setshowfilter] = useState(false);
  const [filterProduct, Setfilterproduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [sortType, setsorttype] = useState('relevant');

  const toggleCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(""); // Deselect category
      setSelectedSubcategories([]); // Reset subcategories
    } else {
      setSelectedCategory(category);
      setSelectedSubcategories([]); // Reset subcategories when category changes
    }
  };

  const toggleSubcategory = (subcategory) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(selectedSubcategories.filter((item) => item !== subcategory));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  const applyfilter = () => {
    let productcopy = products.slice();
  
    // Apply search filter if search is active
    if (search && showsearch) {
      productcopy = productcopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // Apply category filter
    if (selectedCategory) {
      productcopy = productcopy.filter((item) => item.category === selectedCategory);
    }
  
    // Apply subcategory filter if subcategories are selected
    if (selectedCategory && selectedSubcategories.length > 0) {
      productcopy = productcopy.filter((item) =>
        selectedSubcategories.includes(item.subCategory)
      );
    }
  
    // Update filtered products
    Setfilterproduct(productcopy);
  };
  
  useEffect(() => {
    applyfilter();
  }, [showsearch, search, selectedCategory, selectedSubcategories, products]);
  
  const sortProduct = () => {
    let fpCopy = [...filterProduct];
    switch (sortType) {
      case 'low-high':
        Setfilterproduct(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        Setfilterproduct(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyfilter();
        break;
    }
  };
  
  useEffect(() => {
    sortProduct();
  }, [sortType]);
  
  const subcategoriesToShow = selectedCategory ? categorySubcategoriesMap[selectedCategory] || [] : [];
  
  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 border-t-1 pt-10 dark:text-white dark:bg-gray-900'>
      <div className='min-w-60'>
        <p onClick={() => setshowfilter(!showfilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 ${showfilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt='' />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 my-4 ${showfilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light'>
            {Object.keys(categorySubcategoriesMap).map((category) => (
              <p className='flex gap-2' key={category}>
                <input 
                  className='w-3' 
                  type='checkbox' 
                  checked={selectedCategory === category} 
                  onChange={() => toggleCategory(category)} 
                />
                {category}
              </p>
            ))}
          </div>
        </div>
  
        {/* Animate the Subcategory Drawer */}
        <AnimatePresence initial={false}>
          {selectedCategory && (
            <motion.div
              key="subcategories-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`border border-gray-300 pl-5 py-3 my-4 ${showfilter ? '' : 'hidden'} sm:block overflow-hidden`}
            >
              <p className='mb-3 text-sm font-medium'>SUBCATEGORIES</p>
              <div className='flex flex-col gap-2 text-sm font-light'>
                {subcategoriesToShow.map((subcategory) => (
                  <p className='flex gap-2' key={subcategory}>
                    <input 
                      className='w-3' 
                      type='checkbox' 
                      checked={selectedSubcategories.includes(subcategory)} 
                      onChange={() => toggleSubcategory(subcategory)} 
                    />
                    {subcategory}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
      </div>
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1='ALL' text2='COLLECTIONS' />
          <select onChange={(e) => setsorttype(e.target.value)} className='border-2 border-gray-300 text-sm px-2 dark:text-white dark:bg-gray-900'>
            <option value='relevant'>Sort By: Relevant</option>
            <option value='low-high'>Sort By: Low-high</option>
            <option value='high-low'>Sort By: High-low</option>
          </select>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProduct.length > 0 ? (
            filterProduct.map((item, index) => (
              <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
