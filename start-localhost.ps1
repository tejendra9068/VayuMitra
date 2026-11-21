# VayuMitra PowerShell Localhost Launcher
Set-Location -Path $PSScriptRoot

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "   VayuMitra - GenAI Urban Air Quality & Anti-Smog Assistant" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting local Vite server on http://localhost:5173..." -ForegroundColor Yellow

# Launch default browser
Start-Process "http://localhost:5173"

# Start Vite dev server
node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173 --open
