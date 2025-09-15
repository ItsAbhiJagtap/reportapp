@echo off
echo Installing React Reporting Dashboard dependencies...
echo.

echo Installing npm packages...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo Error: npm install failed. Please check your Node.js installation.
    echo Make sure Node.js and npm are properly installed.
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Or use the start.bat file.
pause
