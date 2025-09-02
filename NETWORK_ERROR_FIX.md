# Network Error Fix Guide

## Problem
When users fill out the signup form and click "Create Account", they get a network error. After fixing the network error, the signup shows "Account created for undefined" instead of the user's name. Additionally, the sign-in page shows "Request failed with status code 404".

## Root Causes Identified
1. **Server not running**: The Express server wasn't starting due to MongoDB connection issues
2. **Port mismatch**: Client was trying to connect to port 5000, but server wasn't running
3. **PowerShell syntax**: Using `&&` instead of `;` for command chaining in PowerShell
4. **Response structure mismatch**: Server was returning `{message: "...", user: {...}}` but client expected user data directly
5. **Missing login endpoint**: Test server only had signup endpoint, login endpoint was missing

## Solution

### Option 1: Quick Fix (Recommended)
Run the provided PowerShell script:
```powershell
.\start-app.ps1
```

### Option 2: Manual Steps

1. **Start the Server**:
   ```powershell
   cd server
   node server.js
   ```
   The server will start on port 3001 (even without MongoDB)

2. **Start the Client**:
   ```powershell
   cd client
   npm start
   ```

3. **Verify Both Are Running**:
   - Server: http://localhost:3001/health
   - Client: http://localhost:3000

### Option 3: Install MongoDB (For Full Functionality)

1. **Install MongoDB Community Edition**:
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Create .env file in server directory**:
   ```
   MONGO_URL=mongodb://localhost:27017/cyberzens
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   ```

3. **Start MongoDB service**:
   ```powershell
   net start MongoDB
   ```

## Changes Made

### Server Changes
- ✅ Updated server to start on port 3001
- ✅ Added graceful handling of MongoDB connection failures
- ✅ Server starts even without database connection
- ✅ Added better error messages for database issues
- ✅ Fixed response structure to return user data directly (not wrapped in message object)
- ✅ Added fallback response when database is not available
- ✅ Added missing login endpoint (`/api/User/login`)
- ✅ Added fallback login response when database is not available

### Client Changes
- ✅ Updated API base URL to use port 3001
- ✅ Improved error handling in signup form

### API Endpoints
- ✅ Health check: `GET /health`
- ✅ Signup: `POST /api/User`
- ✅ Login: `POST /api/User/login`

## Testing

1. **Test Server Health**:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
   ```

2. **Test Signup API**:
   ```powershell
   $body = @{
       firstName="Test"
       lastName="User"
       nid="123456"
       username="testuser"
       email="test@example.com"
       phone="1234567890"
       password="password123"
       confirmPassword="password123"
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "http://localhost:3001/api/User" -Method POST -Body $body -ContentType "application/json"
   ```

3. **Test Login API**:
   ```powershell
   $body = @{
       username="testuser"
       password="password123"
   } | ConvertTo-Json
   
   Invoke-WebRequest -Uri "http://localhost:3001/api/User/login" -Method POST -Body $body -ContentType "application/json"
   ```

## Troubleshooting

### If server won't start:
1. Check if port 3001 is available: `netstat -an | findstr :3001`
2. Kill existing processes: `taskkill /f /im node.exe`
3. Check Node.js installation: `node --version`

### If client can't connect:
1. Verify server is running on port 3001
2. Check browser console for CORS errors
3. Ensure API_BASE_URL in `client/src/services/api.js` is correct

### If signup still fails:
1. Check server console for error messages
2. Verify all required fields are being sent
3. Check network tab in browser developer tools

## Next Steps

For production deployment:
1. Install and configure MongoDB
2. Set up proper environment variables
3. Configure CORS for production domain
4. Add SSL/TLS certificates
5. Set up proper JWT secret
6. Add rate limiting and security headers
