@echo off
echo Setting up Git repository for React Reporting Dashboard...
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git is not installed on your system.
    echo.
    echo Please install Git first:
    echo 1. Go to https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart your command prompt/PowerShell
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with repository setup...
echo.

echo Initializing Git repository...
git init

echo Adding README.md...
git add README.md

echo Committing initial files...
git commit -m "first commit"

echo Setting main branch...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/itsabhijagtap28/reportapp.git

echo.
echo Repository setup complete!
echo.
echo To push to GitHub, run:
echo   git push -u origin main
echo.
echo Note: You may need to authenticate with GitHub first.
echo.
pause
