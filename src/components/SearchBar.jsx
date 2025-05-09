import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import assets from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
    const {search, setsearch, showsearch, setshowsearch} = useContext(ShopContext)
    const location = useLocation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (showsearch) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [showsearch]);

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
            </div>
        </div>
    );
}

export default SearchBar
