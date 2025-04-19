import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const deliveryfee = 10;
  
  const [search, setsearch] = useState('');
  const [showsearch, setshowsearch] = useState(false);
  
  // Now cartItems is a mapping from product _id to a simple quantity (number)
  const [cartItems, setCartItems] = useState({});

  // Add to cart: simply increments the quantity for a given item
  const addtocart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  // Update the quantity of a given item in the cart
  const updatequantity = (itemId, quantity) => {
    const cartdata = structuredClone(cartItems);
    cartdata[itemId] = quantity;
    setCartItems(cartdata);
  };

  // Get total number of items in the cart
  const getcartsize = () => {
    let TotalCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        TotalCount += cartItems[item];
      }
    }
    return TotalCount;
  };

  // Calculate the total cost of the cart
  const getcarttotal = () => {
    let total_price = 0;
    for (const itemId in cartItems) {
      const product = products.find((product) => product._id === itemId);
      if (product) {
        total_price += product.price * cartItems[itemId];
      }
    }
    return total_price;
  };

  const value = {
    currency,
    deliveryfee,
    products,
    search,
    setsearch,
    showsearch,
    setshowsearch,
    cartItems,
    addtocart,
    getcartsize,
    updatequantity,
    getcarttotal,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
