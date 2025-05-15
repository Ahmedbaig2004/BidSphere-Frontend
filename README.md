# BidNex Frontend

This is the frontend for the BidNex auction platform, built with React, Vite, and Tailwind CSS.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root of the frontend directory with these variables:
   ```
   REACT_APP_API_URL=http://150.136.175.145:2278
   REACT_APP_CONTRACT_ADDRESS=0xbbb852126b0a6C42CD57Fa6A5d7F2D44B986A950
   REACT_APP_ADMIN_USERNAME=Bidsphere Admin
   REACT_APP_ADMIN_PASSWORD=badmin_123
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   This will start the development server on [http://localhost:5173](http://localhost:5173)

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── assets/          # Static assets and resources
├── components/      # Reusable UI components
├── context/         # React context providers
│   ├── AuthContext.jsx    # Authentication state management
│   └── ShopContext.jsx    # Application state management
├── pages/           # Main page components
│   ├── AdminDashboard.jsx # Admin control panel
│   ├── Login.jsx          # User login page
│   ├── Product.jsx        # Product detail page
│   ├── ProductListing.jsx # Create new product listing
│   ├── Register.jsx       # User registration
│   ├── UserDashboard.jsx  # User dashboard
│   └── ...
└── main.jsx         # Application entry point
```

## Key Features

1. **User Authentication**
   - Login/Registration
   - Email verification
   - Profile management

2. **Product Management**
   - Create new listings
   - Upload product images
   - Set auction parameters

3. **Bidding System**
   - Real-time bid updates
   - Auction status tracking
   - Transaction history

4. **User Dashboard**
   - Inventory management
   - Transaction history
   - Profile settings

5. **Admin Dashboard**
   - User management
   - Listing oversight
   - System statistics

## Environment Variables

| Variable | Description |
|----------|-------------|
| REACT_APP_API_URL | Backend API URL (default: http://150.136.175.145:2278) |
| REACT_APP_CONTRACT_ADDRESS | Ethereum contract address for blockchain integration |
| REACT_APP_ADMIN_USERNAME | Admin username for admin panel access |
| REACT_APP_ADMIN_PASSWORD | Admin password for admin panel access |

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify the backend server is running
   - Check that REACT_APP_API_URL is correctly set in .env
   - Ensure network connectivity to the API server

2. **Image Loading Problems**
   - Images are served from the CDN endpoint on the backend
   - Default URL is http://150.136.175.145:2280/cdn/

3. **Login Issues**
   - Clear browser cookies and local storage
   - Verify the correct API endpoint for authentication

## Development Guidelines

- Use functional components with hooks
- Follow the existing styling patterns with Tailwind CSS
- Add new pages in the pages directory
- Place reusable components in the components directory
