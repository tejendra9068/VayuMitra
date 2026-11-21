@echo off
setlocal
cd /d "%~dp0"
title VayuMitra – Localhost Dev Server

echo ======================================================================
echo    VayuMitra – GenAI Urban Air Quality & Anti-Smog Assistant
echo ======================================================================
echo.
echo [1/2] Launching browser to http://localhost:5173 ...
start http://localhost:5173

echo [2/2] Starting local Vite server on port 5173...
echo Press Ctrl+C in this window to stop the server anytime.
echo.

node ./node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173 --open

pause
