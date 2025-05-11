import { useContext, useState, useRef, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import ReactDOM from "react-dom"
import assets from "../assets/assets.js"
import { ShopContext } from "../context/ShopContext.jsx"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [username, setUsername] = useState("")
  const profileRef = useRef(null)
  const dropdownTimer = useRef(null)
  const { setshowsearch } = useContext(ShopContext)
  const { isLoggedIn, logout } = useContext(AuthContext)

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
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl p-3">
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
        </div>,
        document.body
      )
    : null

  return (
    <div className="backdrop-blur-lg bg-white/10 border-b border-white/20 py-4">
      <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Link to="/" className="flex items-center">
          <img src={assets.bidsphere || "/placeholder.svg"} className="w-36" alt="Logo" />
        </Link>

        {/* Desktop NavLinks */}
        <ul className="hidden sm:flex gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive ? "text-blue-400" : "text-white hover:text-blue-300"
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
                isActive ? "text-blue-400" : "text-white hover:text-blue-300"
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
                isActive ? "text-blue-400" : "text-white hover:text-blue-300"
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
                isActive ? "text-blue-400" : "text-white hover:text-blue-300"
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
            <img src={assets.search_icon || "/placeholder.svg"} className="w-5" alt="Search" />
          </button>

          {isLoggedIn ? (
            <div
              className="relative flex items-center"
              ref={profileRef}
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <div className="text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer p-1">
                <img src={assets.profile_icon || "/placeholder.svg"} className="w-5" alt="Profile" />
              </div>
              <span className="text-white mr-2 ps-2 hidden sm:inline-block max-w-[120px] truncate">{username}</span>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-blue-300 transition-colors duration-300">
              <img src={assets.profile_icon || "/placeholder.svg"} className="w-5" alt="Login" />
            </Link>
          )}

          {dropdownMenu}

          <button
            onClick={() => setVisible(true)}
            className="sm:hidden text-white hover:text-blue-300 transition-colors duration-300"
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
              className={`fixed top-0 right-0 bottom-0 w-72 z-50 backdrop-blur-lg bg-white/10 border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
                visible ? "translate-x-0" : "translate-x-full"
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
                        isActive ? "text-blue-400" : ""
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
                        isActive ? "text-blue-400" : ""
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
                        isActive ? "text-blue-400" : ""
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
                        isActive ? "text-blue-400" : ""
                      }`
                    }
                  >
                    CONTACT
                  </NavLink>
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
