import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ThemeProvider from './context/ThemeContext.jsx'

// Determine if we need to use the base path

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <AuthProvider>
      <ThemeProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
)
