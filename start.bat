@echo off
echo Starting React Reporting Dashboard...
echo.

echo Starting development server...
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to start development server.
    echo Make sure dependencies are installed by running install.bat first.
    pause
    exit /b 1
)
