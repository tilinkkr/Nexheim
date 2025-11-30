# NexGuard Demo Launcher
# Safe script to start backend in minimal or full mode

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NexGuard Backend Demo Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connections = netstat -ano | Select-String ":$Port"
    return $connections.Count -gt 0
}

# Function to get process using port
function Get-PortProcess {
    param([int]$Port)
    $connection = netstat -ano | Select-String ":$Port" | Select-Object -First 1
    if ($connection) {
        $pid = ($connection -split '\s+')[-1]
        return $pid
    }
    return $null
}

# Check if backend directory exists
if (-not (Test-Path "src/index.js")) {
    Write-Host "ERROR: Must run from packages/backend directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run:" -ForegroundColor Yellow
    Write-Host "  cd packages/backend" -ForegroundColor White
    Write-Host "  .\run_demo.ps1" -ForegroundColor White
    exit 1
}

# Check for existing processes on port 5001
Write-Host "Checking for existing backend processes..." -ForegroundColor Yellow

if (Test-PortInUse -Port 5001) {
    $pid = Get-PortProcess -Port 5001
    Write-Host "Found process using port 5001 (PID: $pid)" -ForegroundColor Yellow
    
    $response = Read-Host "Kill existing process? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Process killed successfully" -ForegroundColor Green
            Start-Sleep -Seconds 1
        } catch {
            Write-Host "Failed to kill process: $_" -ForegroundColor Red
            Write-Host "Please manually kill PID $pid and try again" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "Exiting. Please stop the existing process manually." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Select Demo Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Minimal Server" -ForegroundColor White
Write-Host "   - Hype-to-Price Ratio endpoint only" -ForegroundColor Gray
Write-Host "   - Fast startup, minimal dependencies" -ForegroundColor Gray
Write-Host "   - File: src/index_minimal.js" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Full Backend" -ForegroundColor White
Write-Host "   - All features (Hype Ratio + Rug Meter)" -ForegroundColor Gray
Write-Host "   - Complete API, database, blockchain" -ForegroundColor Gray
Write-Host "   - File: src/index.js" -ForegroundColor Gray
Write-Host ""

$mode = Read-Host "Enter choice (1 or 2)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($mode -eq "1") {
    Write-Host "Starting Minimal Server..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Server will start on: http://localhost:5001" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available endpoints:" -ForegroundColor Yellow
    Write-Host "  GET /__health" -ForegroundColor White
    Write-Host "  GET /api/tokens/:policyId/hype-ratio" -ForegroundColor White
    Write-Host ""
    Write-Host "Test with:" -ForegroundColor Yellow
    Write-Host '  curl http://localhost:5001/__health' -ForegroundColor White
    Write-Host '  curl "http://localhost:5001/api/tokens/test123/hype-ratio?name=TestToken"' -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host ""
    
    # Start minimal server
    node src/index_minimal.js
    
} elseif ($mode -eq "2") {
    Write-Host "Starting Full Backend..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Server will start on: http://localhost:5001" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available endpoints:" -ForegroundColor Yellow
    Write-Host "  GET /__health" -ForegroundColor White
    Write-Host "  GET /api/tokens/:policyId/hype-ratio" -ForegroundColor White
    Write-Host "  GET /api/memecoins/:policyId/rug-probability" -ForegroundColor White
    Write-Host ""
    Write-Host "Test with:" -ForegroundColor Yellow
    Write-Host '  curl http://localhost:5001/__health' -ForegroundColor White
    Write-Host '  curl "http://localhost:5001/api/tokens/test123/hype-ratio?name=TestToken"' -ForegroundColor White
    Write-Host '  curl "http://localhost:5001/api/memecoins/test123/rug-probability"' -ForegroundColor White
    Write-Host ""
    Write-Host "Watch for these log messages:" -ForegroundColor Yellow
    Write-Host "  [BOOT] Mounted healthAndSafety" -ForegroundColor Gray
    Write-Host "  [BOOT] Mounted /api hypeRoutes" -ForegroundColor Gray
    Write-Host "  [BOOT] Mounted riskRoutes at /api" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host ""
    
    # Start full backend
    node src/index.js
    
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

# This will only execute if the server is stopped (Ctrl+C)
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server stopped" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
