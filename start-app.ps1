# Start CyberZen Application
Write-Host "🚀 Starting CyberZen Application..." -ForegroundColor Green

# Kill any existing Node.js processes
Write-Host "🔄 Stopping existing processes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Start the server
Write-Host "📡 Starting server..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "server" -WindowStyle Hidden

# Wait for server to start
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test server health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Server failed to start" -ForegroundColor Red
    exit 1
}

# Start the client
Write-Host "🌐 Starting React client..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "client" -WindowStyle Normal

Write-Host "🎉 Application started successfully!" -ForegroundColor Green
Write-Host "📱 Client: http://localhost:3000" -ForegroundColor White
Write-Host "📡 Server: http://localhost:3001" -ForegroundColor White
Write-Host "🔍 Health: http://localhost:3001/health" -ForegroundColor White
