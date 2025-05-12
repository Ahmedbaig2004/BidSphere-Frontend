import React, { useEffect, useState } from 'react'
import Title from '../components/Title.jsx'
import ProductItem from './ProductItem.jsx';

const RelatedProducts = ({category, subcategory}) => {
    const [relatedproducts, setrelatedproducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const requestBody = {
                    textQuery: "",
                    categories: [],
                    subCategories: [],
                    priceStart: 0,
                    priceEnd: 0,
                    page: 0
                };

                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/listing/catalog`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch catalog: ${response.status}`);
                }

                const data = await response.json();
                let filteredListings = data.listings || [];

                // Apply category and subcategory filters
                if (category) {
                    filteredListings = filteredListings.filter(listing => 
                        listing.product.category === category
                    );
                }

                if (subcategory) {
                    filteredListings = filteredListings.filter(listing => 
                        listing.product.subCategory === subcategory
                    );
                }

                setrelatedproducts(filteredListings.slice(0, 5));
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [category, subcategory]);

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'> 
                <Title text1={'Related'} text2={'Products'}/>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {relatedproducts.map((item) => (
                        <ProductItem 
                            key={item.listingId}
                            id={item.listingId}
                            name={item.product.name}
                            price={item.latestBid?.bidPrice || item.startingPrice}
                            image={`http://150.136.175.145:2280/cdn/${item.mainImageId}.png`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default RelatedProducts
