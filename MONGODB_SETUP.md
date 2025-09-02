# MongoDB Setup Guide

## Problem
User data isn't being stored in MongoDB database because the test server is running instead of the main server with database connection.

## Solution Options

### Option 1: MongoDB Atlas (Cloud - Recommended)

**Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free"
3. Create an account or sign in

**Step 2: Create a Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

**Step 3: Set Up Database Access**
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

**Step 4: Set Up Network Access**
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

**Step 5: Get Connection String**
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Step 6: Update Your Application**
Create a `.env` file in the server directory:
```
MONGO_URL=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/cyberzens?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

### Option 2: Local MongoDB Installation

**Step 1: Download MongoDB Community Server**
1. Go to https://www.mongodb.com/try/download/community
2. Download the Windows MSI installer
3. Run the installer as Administrator

**Step 2: Install MongoDB**
1. Follow the installation wizard
2. Choose "Complete" installation
3. Install MongoDB Compass (optional but recommended)
4. Complete the installation

**Step 3: Start MongoDB Service**
```powershell
# Start MongoDB service
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Step 4: Create .env File**
Create a `.env` file in the server directory:
```
MONGO_URL=mongodb://localhost:27017/cyberzens
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

## Start the Main Server with Database

Once MongoDB is set up:

1. **Stop the test server**:
   ```powershell
   taskkill /f /im node.exe
   ```

2. **Start the main server**:
   ```powershell
   cd server
   node server.js
   ```

3. **Verify database connection**:
   - You should see "✅ MongoDB Connected" in the console
   - Test the health endpoint: http://localhost:3001/health

## Test Database Storage

1. **Sign up a new user** through the web interface
2. **Check MongoDB** to see if the user was stored:
   - If using Atlas: Go to your cluster → Browse Collections
   - If using local: Use MongoDB Compass or mongo shell

## Troubleshooting

### If MongoDB Atlas connection fails:
1. Check your connection string
2. Verify your IP is whitelisted
3. Check your database user credentials

### If local MongoDB won't start:
1. Check if the service is installed: `sc query MongoDB`
2. Check if the data directory exists: `C:\data\db`
3. Run as Administrator if needed

### If server still shows "Database not connected":
1. Check your `.env` file exists and has correct values
2. Verify MongoDB is running
3. Check the connection string format

## Quick Test Commands

```powershell
# Test MongoDB connection
$env:MONGO_URL="your-connection-string"; node -e "import('mongoose').then(m => m.connect(process.env.MONGO_URL).then(() => console.log('Connected!')).catch(e => console.log('Error:', e.message)))"

# Start server with environment variables
$env:MONGO_URL="your-connection-string"; $env:JWT_SECRET="your-secret"; node server.js
```

