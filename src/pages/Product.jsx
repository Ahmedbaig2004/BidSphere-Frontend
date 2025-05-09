import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const [productdata, setproductdata] = useState();
  const { products, currency, addtocart } = useContext(ShopContext);
  const [image, setimage] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchproductdata = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setproductdata(item);
        setimage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchproductdata();
  }, [products, productId]);

  const handleBidClick = () => {
    setIsDrawerOpen(true);
    addtocart(productdata._id);
  };

  return productdata ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-500">
          {/* Product Images and Details */}
          <div className="flex gap-12 flex-col sm:flex-row">
            {/* Product Images */}
            <div className="flex flex-1 flex-col-reverse gap-3 sm:flex-row">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%] space-x-3 sm:space-x-0">
                {productdata.image.map((item, index) => (
                  <img
                    onClick={() => setimage(item)}
                    src={item}
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-300"
                    alt=""
                  />
                ))}
              </div>
              <div className="w-full sm:w-[80%]">
                <img
                  src={image}
                  className="w-full h-auto rounded-lg border border-white/10"
                  alt=""
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl font-bold text-white">{productdata.name}</h1>
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={assets.star_icon}
                    alt=""
                    className="w-5 h-5"
                  />
                ))}
                <img src={assets.star_dull_icon} alt="" className="w-5 h-5" />
                <p className="pl-2 text-blue-200">(122)</p>
              </div>
              <p className="text-4xl font-bold text-white">{currency}{productdata.price}</p>
              <p className="text-blue-200 leading-relaxed">{productdata.description}</p>

              <button
                onClick={handleBidClick}
                className="w-full py-4 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                PLACE BID
              </button>

              <hr className="border-white/10" />

              <div className="space-y-3 text-sm text-blue-200">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  100% original
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Cash on delivery available
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Easy return and exchange policy within 7 days
                </p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12">
            <div className="flex">
              <button className="px-6 py-3 bg-blue-600/20 text-white rounded-t-lg border border-white/10 border-b-0">
                Description
              </button>
            </div>
            <div className="p-6 border border-white/10 rounded-b-lg rounded-tr-lg bg-white/5 text-blue-200 space-y-4">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nobis vero quam rem!</p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat magnam cupiditate
                exercitationem voluptas asperiores eveniet officiis ab optio omnis delectus, officia,
                eaque deserunt dicta magni aspernatur et perferendis consectetur numquam illo cum minus
                minima. Ut cumque doloremque hic facere perferendis. Quo temporibus rerum exercitationem
                corrupti!
              </p>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <RelatedProducts
              category={productdata.category}
              subcategory={productdata.subcategory}
            />
          </div>
        </div>
      </div>

      {/* Animated Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-white/20 shadow-2xl`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Bid Placed Successfully!</h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-white hover:text-blue-300 transition-colors duration-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-blue-200">Your bid has been placed for:</p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-white font-medium">{productdata.name}</p>
              <p className="text-blue-200 mt-2">Amount: {currency}{productdata.price}</p>
            </div>
            <p className="text-sm text-blue-200">
              You will be notified when the auction ends or if you're outbid.
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Product;
