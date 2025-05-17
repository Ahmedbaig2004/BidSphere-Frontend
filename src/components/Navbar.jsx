import { useContext, useState, useRef, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import ReactDOM from "react-dom"
import assets from "../assets/assets.js"
import { ShopContext } from "../context/ShopContext.jsx"
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [username, setUsername] = useState("")
  const profileRef = useRef(null)
  const dropdownTimer = useRef(null)
  const { setshowsearch } = useContext(ShopContext)
  const { isLoggedIn, logout } = useContext(AuthContext)
  const { isLightTheme, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    if (showDropdown && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.right - 160, // align right edge, dropdown min-width 160px
        width: rect.width
      })
    }
  }, [showDropdown])

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    const storedUser = storedProfile ? JSON.parse(storedProfile).name : null;
    if (storedUser) setUsername(storedUser)
  }, [isLoggedIn])

  const handleProfileEnter = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setShowDropdown(true)
  }
  const handleProfileLeave = () => {
    dropdownTimer.current = setTimeout(() => setShowDropdown(false), 120)
  }
  const handleDropdownEnter = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setShowDropdown(true)
  }
  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => setShowDropdown(false), 120)
  }

  const dropdownMenu = showDropdown
    ? ReactDOM.createPortal(
        <div
          style={{
            position: "absolute",
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: 160,
            zIndex: 9999
          }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/80 border-blue-200' : 'bg-white/10 border-white/20'} border rounded-lg shadow-xl p-3`}>
            <Link
              to="/dashboard"
              className={`block px-4 py-2 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
            >
              Dashboard
            </Link>
            
            <button
              onClick={logout}
              className={`w-full text-left px-4 py-2 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
            >
              Logout
            </button>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <div className={`backdrop-blur-lg ${isLightTheme ? 'bg-white/50 border-blue-200' : 'bg-white/10 border-white/20'} mb-10  border-b py-3 fixed top-0 z-50 left-0 right-0`}>
      <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] overflow-hidden">
        <Link to="/" className="flex items-center">
          <img 
          src={isLightTheme ? assets.bidsphereblack : assets.bidsphere}
          className={`h-8 sm:h-10 md:h-10`}

            alt="Logo" 
          />
        </Link>

        {/* Desktop NavLinks */}
        <ul className="hidden sm:flex gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive 
                  ? (isLightTheme ? "text-gray-900" : "text-blue-400") 
                  : (isLightTheme ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-blue-300")
              }`
            }
          >
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive 
                  ? (isLightTheme ? "text-gray-900" : "text-blue-400") 
                  : (isLightTheme ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-blue-300")
              }`
            }
          >
            <p>AUCTIONS</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-blue-400" />
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive 
                  ? (isLightTheme ? "text-gray-900" : "text-blue-400") 
                  : (isLightTheme ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-blue-300")
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
                isActive 
                  ? (isLightTheme ? "text-gray-900" : "text-blue-400") 
                  : (isLightTheme ? "text-gray-800 hover:text-gray-600" : "text-white hover:text-blue-300")
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
            onClick={toggleTheme}
            className={`${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 flex items-center`}
            aria-label="Toggle Theme"
          >
            {isLightTheme ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 pb-2 h-7">
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 pb-2 h-7">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => setshowsearch(true)}
            className={`${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
          >
<ion-icon name="search-outline" style={{ fontSize: '1.2rem' }}></ion-icon>
</button>

          {isLoggedIn ? (
            <div
              className="relative flex items-center"
              ref={profileRef}
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <div className={`${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 cursor-pointer p-1`}>
              <ion-icon name="person-outline" style={{ fontSize: '1.2rem' }}></ion-icon>
              </div>
              <span className={`${isLightTheme ? 'text-gray-800' : 'text-white'} mr-2 pl-3 pb-1 hidden sm:inline-block max-w-[120px] truncate`}>{username}</span>
            </div>
          ) : (
            <Link to="/login" className={`${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}>
              <img src={assets.profile_icon || "/placeholder.svg"} className="w-5" alt="Login" />
            </Link>
          )}

          {dropdownMenu}

          <button
            onClick={() => setVisible(true)}
            className={`sm:hidden ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
          >
            <img src={assets.menu_icon || "/placeholder.svg"} className="w-5" alt="Menu" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar & Overlay */}
      {/* Only render sidebar and overlay on mobile screens */}
      <div className="block sm:hidden">
        {visible && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setVisible(false)} />
            {/* Sidebar */}
            <div
              className={`fixed top-0 right-0 bottom-0 w-72 z-50 backdrop-blur-lg ${isLightTheme ? 'bg-white/80 border-blue-200' : 'bg-white/10 border-white/20'} border-l transform transition-transform duration-300 ease-in-out ${
                visible ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`flex items-center justify-between p-4 border-b ${isLightTheme ? 'border-blue-200' : 'border-white/20'}`}>
                  <h2 className={`text-xl font-bold ${isLightTheme ? 'text-gray-800' : 'text-white'}`}>Menu</h2>
                  <button
                    onClick={() => setVisible(false)}
                    className={`${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
                  >
                    ✕
                  </button>
                </div>
                <nav className="flex-1 p-4">
                  <NavLink
                    onClick={() => setVisible(false)}
                    to="/"
                    className={({ isActive }) =>
                      `block py-3 px-4 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 ${
                        isActive ? (isLightTheme ? "text-gray-900" : "text-blue-400") : ""
                      }`
                    }
                  >
                    HOME
                  </NavLink>
                  <NavLink
                    onClick={() => setVisible(false)}
                    to="/collection"
                    className={({ isActive }) =>
                      `block py-3 px-4 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 ${
                        isActive ? (isLightTheme ? "text-gray-900" : "text-blue-400") : ""
                      }`
                    }
                  >
                    COLLECTION
                  </NavLink>
                  <NavLink
                    onClick={() => setVisible(false)}
                    to="/about"
                    className={({ isActive }) =>
                      `block py-3 px-4 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 ${
                        isActive ? (isLightTheme ? "text-gray-900" : "text-blue-400") : ""
                      }`
                    }
                  >
                    ABOUT
                  </NavLink>
                  <NavLink
                    onClick={() => setVisible(false)}
                    to="/contact"
                    className={({ isActive }) =>
                      `block py-3 px-4 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300 ${
                        isActive ? (isLightTheme ? "text-gray-900" : "text-blue-400") : ""
                      }`
                    }
                  >
                    CONTACT
                  </NavLink>
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-2 w-full py-3 px-4 ${isLightTheme ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-blue-300'} transition-colors duration-300`}
                  >
                    {isLightTheme ? 'DARK MODE' : 'LIGHT MODE'}
                    {isLightTheme ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                      </svg>
                    )}
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
