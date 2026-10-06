@echo off
setlocal enabledelayedexpansion

:: Switch to the current directory
cd /d "%~dp0"

echo ===================================================
echo   Building Raymond Blog Project...
echo ===================================================

:: Run the build command defined in package.json
call pnpm run build

:: Check if the build command succeeded
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed. Please review the error log above.
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   Build completed successfully!
echo   Launching local preview server...
echo ===================================================
echo Preview server is starting. Press Ctrl+C to terminate.
echo.

:: Launch local production preview
call pnpm run preview

pause