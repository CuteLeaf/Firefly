@echo off
setlocal enabledelayedexpansion
title Git Remote Switcher Tool

:: ======================================================
:: CONFIGURATION (Set your default repository URLs below)
:: ======================================================
set "DEFAULT_GITHUB_URL=https://github.com/raymondkkxx/tailwind-nextjs-starter-blog.git"
set "DEFAULT_GITEE_URL=git@gitee.com:raymondkkxx/tailwind-nextjs-starter-blog.git"
:: ======================================================

:: Navigate two levels up to the project root
cd /d "%~dp0..\.."

:: Verify that the target directory is a Git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Not inside a valid Git repository.
    echo Current path: %CD%
    echo Please make sure this script is placed two directory levels below the repo root.
    echo.
    pause
    exit /b 1
)

:MENU
cls
echo ======================================================
echo               Git Remote Switcher Tool
echo ======================================================
echo Project Root : %CD%
echo Current Local Branch : 
git branch --show-current
echo.
echo Current Remote 'origin':
git remote get-url origin 2>nul || echo [None configured]
echo ======================================================
echo.
echo Select an option:
echo   [1] Switch 'origin' to GitHub
echo   [2] Switch 'origin' to Gitee
echo   [3] Set custom URL for 'origin'
echo   [4] Enable dual-push (Push to both GitHub and Gitee)
echo   [5] View detailed remote URLs (git remote -v)
echo   [0] Exit
echo.
set /p "CHOICE=Enter your choice [0-5]: "

if "%CHOICE%"=="1" goto SWITCH_GITHUB
if "%CHOICE%"=="2" goto SWITCH_GITEE
if "%CHOICE%"=="3" goto CUSTOM_URL
if "%CHOICE%"=="4" goto DUAL_PUSH
if "%CHOICE%"=="5" goto VIEW_REMOTES
if "%CHOICE%"=="0" exit /b 0

echo.
echo [ERROR] Invalid selection. Try again.
timeout /t 2 >nul
goto MENU

:SWITCH_GITHUB
cls
echo ======================================================
echo               Switch Remote to GitHub
echo ======================================================
echo Default GitHub URL: %DEFAULT_GITHUB_URL%
set /p "INPUT_URL=Enter GitHub URL [Press ENTER for default]: "
if "!INPUT_URL!"=="" set "INPUT_URL=%DEFAULT_GITHUB_URL%"

call :APPLY_REMOTE "!INPUT_URL!"
goto MENU

:SWITCH_GITEE
cls
echo ======================================================
echo               Switch Remote to Gitee
echo ======================================================
echo Default Gitee URL: %DEFAULT_GITEE_URL%
set /p "INPUT_URL=Enter Gitee URL [Press ENTER for default]: "
if "!INPUT_URL!"=="" set "INPUT_URL=%DEFAULT_GITEE_URL%"

call :APPLY_REMOTE "!INPUT_URL!"
goto MENU

:CUSTOM_URL
cls
echo ======================================================
echo               Set Custom Remote URL
echo ======================================================
set /p "INPUT_URL=Enter custom remote URL: "
if "!INPUT_URL!"=="" (
    echo [WARN] URL cannot be empty.
    pause
    goto MENU
)

call :APPLY_REMOTE "!INPUT_URL!"
goto MENU

:DUAL_PUSH
cls
echo ======================================================
echo          Enable Dual-Push (GitHub + Gitee)
echo ======================================================
echo This will configure 'origin' to push to BOTH remotes
echo on a single 'git push' command.
echo.
echo GitHub URL : %DEFAULT_GITHUB_URL%
echo Gitee URL  : %DEFAULT_GITEE_URL%
echo.
set /p "CONFIRM=Proceed? (Y/N): "
if /i not "!CONFIRM!"=="Y" goto MENU

:: Reset existing push URLs
git remote set-url origin "%DEFAULT_GITHUB_URL%" 2>nul || git remote add origin "%DEFAULT_GITHUB_URL%"
git remote set-url --push origin "%DEFAULT_GITHUB_URL%"
git remote set-url --add --push origin "%DEFAULT_GITEE_URL%"

echo.
echo [SUCCESS] Dual-push configured successfully!
echo.
git remote -v
echo.
pause
goto MENU

:VIEW_REMOTES
cls
echo ======================================================
echo               Configured Remotes
echo ======================================================
git remote -v
echo.
pause
goto MENU

:: Subroutine to update remote origin
:APPLY_REMOTE
set "TARGET_URL=%~1"
git remote set-url origin "%TARGET_URL%" 2>nul
if %errorlevel% neq 0 (
    git remote add origin "%TARGET_URL%"
)
echo.
echo [SUCCESS] 'origin' remote successfully pointed to:
echo %TARGET_URL%
echo.
pause
exit /b 0