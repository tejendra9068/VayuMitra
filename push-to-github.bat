@echo off
setlocal
cd /d "%~dp0"
title Push VayuMitra to GitHub

echo ======================================================================
echo    VayuMitra – Push Project to GitHub
echo ======================================================================
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo Adding remote origin: %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Pushing main branch to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  SUCCESS! Project pushed to GitHub successfully.
    echo ======================================================================
) else (
    echo.
    echo [NOTE] If authentication is required, make sure you are logged in to GitHub
    echo or use a Personal Access Token (PAT).
)

echo.
pause
