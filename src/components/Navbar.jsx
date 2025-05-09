import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import assets from '../assets/assets.js';
import { ShopContext } from '../context/ShopContext.jsx';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setshowsearch, getcartsize } = useContext(ShopContext);
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <div className="backdrop-blur-lg bg-white/10 border-b border-white/20 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={assets.bidsphere} className="w-36" alt="Logo" />
        </Link>

        {/* Desktop NavLinks */}
        <ul className="hidden sm:flex gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive ? 'text-blue-400' : 'text-white hover:text-blue-300'
              }`
            }
          >
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
          <NavLink
            to="/collection"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive ? 'text-blue-400' : 'text-white hover:text-blue-300'
              }`
            }
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive ? 'text-blue-400' : 'text-white hover:text-blue-300'
              }`
            }
          >
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive ? 'text-blue-400' : 'text-white hover:text-blue-300'
              }`
            }
          >
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setshowsearch(true)}
            className="text-white hover:text-blue-300 transition-colors duration-300"
          >
            <img src={assets.search_icon} className="w-5" alt="Search" />
          </button>

          {isLoggedIn ? (
            <>
              <div className="group relative">
                <button className="text-white hover:text-blue-300 transition-colors duration-300">
                  <img src={assets.profile_icon} className="w-5" alt="Profile" />
                </button>
                <div className="absolute right-0 pt-1 hidden group-hover:block">
                  <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl p-3 min-w-[200px]">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-white hover:text-blue-300 transition-colors duration-300"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-white hover:text-blue-300 transition-colors duration-300"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-white hover:text-blue-300 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-white hover:text-blue-300 transition-colors duration-300"
              >
                <img src={assets.profile_icon} className="w-5" alt="Login" />
              </Link>
              <Link to="/register">
                <button className="hidden sm:block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Register
                </button>
              </Link>
            </div>
          )}

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart" />
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
              {getcartsize()}
            </span>
          </Link>

          <button
            onClick={() => setVisible(true)}
            className="sm:hidden text-white hover:text-blue-300 transition-colors duration-300"
          >
            <img src={assets.menu_icon} className="w-5" alt="Menu" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full backdrop-blur-lg bg-white/10 border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setVisible(false)}
              className="text-white hover:text-blue-300 transition-colors duration-300"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 p-4">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className={({ isActive }) =>
                `block py-3 px-4 text-white hover:text-blue-300 transition-colors duration-300 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className={({ isActive }) =>
                `block py-3 px-4 text-white hover:text-blue-300 transition-colors duration-300 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className={({ isActive }) =>
                `block py-3 px-4 text-white hover:text-blue-300 transition-colors duration-300 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/contact"
              className={({ isActive }) =>
                `block py-3 px-4 text-white hover:text-blue-300 transition-colors duration-300 ${
                  isActive ? 'text-blue-400' : ''
                }`
              }
            >
              CONTACT
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;