@echo off
title Install React Integration for Astro Firefly
cls

echo ============================================================
echo   Installing React Integration for Firefly Blog
echo ============================================================
echo.

:: Switch to the directory of this script
cd /d "%~dp0"

:: Check if pnpm is available
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not detected in your system PATH.
    echo Please make sure pnpm is installed and added to PATH.
    echo.
    pause
    exit /b 1
)

echo [1/3] Running official Astro integration wizard...
echo.

:: Use 'pnpm exec astro' directly to avoid script argument forwarding bugs
call pnpm exec astro add react --yes

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] React integration and astro.config.mjs configured successfully!
    goto :verify
)

echo.
echo [NOTICE] 'pnpm exec astro' exited with an error. Trying fallback via npx...
echo.

call npx --yes astro add react --yes

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] React integration configured via npx successfully!
    goto :verify
)

echo.
echo [NOTICE] Automated wizard failed. Falling back to direct package installation...
echo.

call pnpm add @astrojs/react react react-dom
call pnpm add -D @types/react @types/react-dom

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Package installation failed. Please check your network or registry.
    pause
    exit /b 1
)

echo.
echo [NOTICE] Packages installed manually.
echo Please ensure 'react()' is included in the integrations array in astro.config.mjs.

:verify
echo.
echo [2/3] Verifying installed React dependencies...
echo.
call pnpm list @astrojs/react react react-dom

echo.
echo ============================================================
echo [3/3] Setup process completed. Press any key to exit.
echo ============================================================
echo.
pause