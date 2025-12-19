# Start CyberZen Application with Database
Write-Host "🚀 Starting CyberZen Application with Database..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "🔄 Stopping existing processes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Check if .env file exists
if (-not (Test-Path "server\.env")) {
    Write-Host "❌ .env file not found in server directory!" -ForegroundColor Red
    Write-Host "📝 Please create a .env file with your MongoDB connection string:" -ForegroundColor Yellow
    Write-Host "   MONGO_URL=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/cyberzens" -ForegroundColor White
    Write-Host "   JWT_SECRET=your-super-secret-jwt-key" -ForegroundColor White
    Write-Host "   PORT=3001" -ForegroundColor White
    Write-Host "📖 See MONGODB_SETUP.md for detailed instructions" -ForegroundColor Cyan
    exit 1
}

# Start the main server (not test server)
Write-Host "📡 Starting main server with database..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "server" -WindowStyle Normal

# Wait for server to start
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test server health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Server is running!" -ForegroundColor Green
    
    # Check if database is connected by looking at server logs
    Write-Host "🔍 Check the server console for database connection status:" -ForegroundColor Cyan
    Write-Host "   ✅ MongoDB Connected - Database is working" -ForegroundColor Green
    Write-Host "   ❌ MongoDB Connection Failed - Check your .env file" -ForegroundColor Red
    
} catch {
    Write-Host "❌ Server failed to start" -ForegroundColor Red
    Write-Host "💡 Make sure:" -ForegroundColor Yellow
    Write-Host "   1. MongoDB is installed and running" -ForegroundColor White
    Write-Host "   2. .env file has correct connection string" -ForegroundColor White
    Write-Host "   3. Port 3001 is available" -ForegroundColor White
    exit 1
}

Write-Host "🎉 Application started with database!" -ForegroundColor Green
Write-Host "📱 Client: http://localhost:3000" -ForegroundColor White
Write-Host "📡 Server: http://localhost:3001" -ForegroundColor White
Write-Host "🔍 Health: http://localhost:3001/health" -ForegroundColor White
Write-Host "💾 User data will now be stored in MongoDB!" -ForegroundColor Green

