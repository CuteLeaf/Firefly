@echo off
setlocal enabledelayedexpansion

REM Switch to the script directory
cd /d "%~dp0"

echo ===================================================
echo   Launching Raymond Blog Dev Server...
echo ===================================================
echo.

REM 1. Cleanly terminate any lingering process occupying port 4321
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4321 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Starting Dev Server and opening browser...
echo Press Ctrl+C in this terminal to stop the server.
echo.

REM 2. Wait 2 seconds in the background and pop up default browser
start "" /b cmd /c "ping 127.0.0.1 -n 3 >nul & start http://localhost:4321"

REM 3. Launch Astro dev server cleanly without invalid flags
call pnpm dev

pause