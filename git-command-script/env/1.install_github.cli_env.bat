@echo off
setlocal EnableExtensions EnableDelayedExpansion
title GitHub CLI Setup and Configuration
chcp 65001 >nul 2>&1

echo ======================================================
echo        GitHub CLI (gh) Installer and Configurator
echo ======================================================
echo.

:: 1. Check if gh is already installed and available in PATH
where gh >nul 2>&1
if not errorlevel 1 goto :GH_FOUND

:: Check standard install paths before attempting winget install
if exist "%ProgramFiles%\GitHub CLI\gh.exe" (
    set "PATH=%PATH%;%ProgramFiles%\GitHub CLI"
    goto :GH_FOUND
)
if exist "%LOCALAPPDATA%\Programs\GitHub CLI\gh.exe" (
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\GitHub CLI"
    goto :GH_FOUND
)

:: 2. Check for winget (Windows Package Manager)
where winget >nul 2>&1
if errorlevel 1 goto :ERR_NO_WINGET

:: 3. Install GitHub CLI via winget
echo [1/3] GitHub CLI not found. Installing via winget...
echo.
winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
if errorlevel 1 goto :ERR_INSTALL_FAIL

:: Refresh PATH in current session to locate gh immediately
if exist "%ProgramFiles%\GitHub CLI\gh.exe" (
    set "PATH=%PATH%;%ProgramFiles%\GitHub CLI"
)
if exist "%LOCALAPPDATA%\Programs\GitHub CLI\gh.exe" (
    set "PATH=%PATH%;%LOCALAPPDATA%\Programs\GitHub CLI"
)

where gh >nul 2>&1
if errorlevel 1 goto :ERR_PATH_NOT_UPDATED

:GH_FOUND
echo.
echo [OK] GitHub CLI is available:
gh --version | findstr /i "version"
echo.

:: 4. Verify Authentication
echo [2/3] Checking authentication status...
gh auth status >nul 2>&1
if not errorlevel 1 goto :ALREADY_AUTH

echo.
echo GitHub account is not authenticated.
echo Launching interactive login...
echo.
echo Recommended choices:
echo   - What account do you want to log into? -- GitHub.com
echo   - What is your preferred protocol for Git operations? -- HTTPS
echo   - Authenticate Git with your GitHub credentials? -- Yes
echo   - How would you like to authenticate? -- Login with a web browser
echo.
gh auth login
if errorlevel 1 goto :ERR_AUTH_FAIL

:ALREADY_AUTH
:: 5. Setup Git Credential Helper
echo.
echo [3/3] Configuring Git credential helper...
gh auth setup-git
if errorlevel 1 goto :ERR_SETUP_GIT

echo.
echo ======================================================
echo [SUCCESS] GitHub CLI is configured and ready!
echo ======================================================
echo Current authenticated account:
gh auth status
goto :FINISH

:: --- Error Handlers ---

:ERR_NO_WINGET
echo.
echo [ERROR] 'winget' command is not available on this system.
echo Please install GitHub CLI manually from: https://cli.github.com/
goto :SCRIPT_FAIL

:ERR_INSTALL_FAIL
echo.
echo [ERROR] Installation failed via winget.
echo Please download and run the installer manually from: https://cli.github.com/
goto :SCRIPT_FAIL

:ERR_PATH_NOT_UPDATED
echo.
echo [WARNING] Installation succeeded, but PATH could not be refreshed dynamically.
echo Please close this window and run the script again.
goto :SCRIPT_FAIL

:ERR_AUTH_FAIL
echo.
echo [ERROR] Authentication was aborted or failed.
echo You can run 'gh auth login' manually in a terminal at any time.
goto :SCRIPT_FAIL

:ERR_SETUP_GIT
echo.
echo [ERROR] Failed to configure Git credentials via 'gh auth setup-git'.
goto :SCRIPT_FAIL

:SCRIPT_FAIL
echo.
echo Setup terminated with errors.

:FINISH
echo.
echo Press any key to exit...
pause >nul
endlocal