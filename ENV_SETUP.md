# Environment Setup Guide

## Creating the .env File

Create a file named `.env` in the root of the frontend directory with the following content:

```
# BidNex Environment Variables

# Backend API URL
REACT_APP_API_URL=http://150.136.175.145:2278

# Blockchain Configuration
REACT_APP_CONTRACT_ADDRESS=0xbbb852126b0a6C42CD57Fa6A5d7F2D44B986A950

# Admin Credentials
REACT_APP_ADMIN_USERNAME=Bidsphere Admin
REACT_APP_ADMIN_PASSWORD=badmin_123
```

## Environment Variables Explanation

### REACT_APP_API_URL
This variable defines the base URL for all API requests. The default value points to the production backend server.

For local development, you may want to change this to your local backend server:
```
REACT_APP_API_URL=http://localhost:2278
```

### REACT_APP_CONTRACT_ADDRESS
This is the Ethereum contract address used for blockchain integration in the application. 

### REACT_APP_ADMIN_USERNAME and REACT_APP_ADMIN_PASSWORD
These credentials are used for accessing the admin dashboard. 

## Using Environment Variables in the Code

In the React codebase, you can access these variables using `process.env.VARIABLE_NAME`, for example:

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
```

## Important Notes

1. The `.env` file should never be committed to the repository for security reasons.
2. After changing environment variables, you may need to restart the development server.
3. All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application.
4. For production deployment, these environment variables should be set on the server or in the deployment platform. 