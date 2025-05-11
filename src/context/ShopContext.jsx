import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const deliveryfee = 10;
  
  const [search, setsearch] = useState('');
  const [showsearch, setshowsearch] = useState(false);
  
  // Cart-related state and functions removed

  const value = {
    currency,
    deliveryfee,
    products,
    search,
    setsearch,
    showsearch,
    setshowsearch,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
