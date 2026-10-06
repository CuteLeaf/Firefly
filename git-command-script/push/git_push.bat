@echo off
setlocal EnableExtensions EnableDelayedExpansion
title GitHub One-Click Sync and Push Tool
chcp 65001 >nul 2>&1

:: 1. Resolve Default Path and Project Name (Two levels up from script)
for %%I in ("%~dp0..\..") do (
    set "DEFAULT_DIR=%%~fI"
    set "DEFAULT_PROJ=%%~nxI"
)

echo ======================================================
echo           GitHub Auto Sync and Push Tool
echo ======================================================
echo.

:: 2. Verify Git Installation
where git >nul 2>&1
if errorlevel 1 goto :ERR_NO_GIT

:: 3. Workspace Configuration
echo [1/6] Workspace Configuration
echo Default Directory : !DEFAULT_DIR!
set "TARGET_DIR="
set /p "TARGET_DIR=Enter base directory path [Press ENTER for default]: "
if "!TARGET_DIR!"=="" set "TARGET_DIR=!DEFAULT_DIR!"
set "TARGET_DIR=!TARGET_DIR:"=!"

echo Default Project   : !DEFAULT_PROJ!
set "TARGET_PROJ="
set /p "TARGET_PROJ=Enter project folder name [Press ENTER for default]: "
if "!TARGET_PROJ!"=="" set "TARGET_PROJ=!DEFAULT_PROJ!"
set "TARGET_PROJ=!TARGET_PROJ:"=!"

:: Smart Path Resolution (Avoid duplicate project folder nesting)
set "FULL_PATH=!TARGET_DIR!\!TARGET_PROJ!"
if exist "!FULL_PATH!" goto :PATH_OK

for %%P in ("!TARGET_DIR!") do set "CUR_FOLDER=%%~nxP"
if /i "!CUR_FOLDER!"=="!TARGET_PROJ!" set "FULL_PATH=!TARGET_DIR!"
if exist "!TARGET_DIR!\.git" set "FULL_PATH=!TARGET_DIR!"

:PATH_OK
if not exist "!FULL_PATH!" goto :ERR_NO_DIR

cd /d "!FULL_PATH!" 2>nul
if errorlevel 1 goto :ERR_ACCESS_DIR

:: Verify Git Workspace
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 goto :ERR_NOT_GIT

:: Verify Remote Origin
git remote get-url origin >nul 2>&1
if errorlevel 1 goto :ERR_NO_ORIGIN

git config core.quotepath false
echo.
echo Active Directory  : !FULL_PATH!
echo ======================================================
echo.

:: 4. Automatic Branch Detection (No manual prompt)
echo [2/6] Branch Detection
set "LOCAL_BRANCH="
for /f "delims=" %%B in ('git branch --show-current 2^>nul') do set "LOCAL_BRANCH=%%B"

if "!LOCAL_BRANCH!"=="" goto :ERR_DETACHED_HEAD

:: Auto bind target branch to match local branch
set "TARGET_BRANCH=!LOCAL_BRANCH!"

echo.
echo ======================================================
echo [BRANCH SYNC INFO]
echo   Current Local Branch : !LOCAL_BRANCH!
echo   Target Remote Branch : origin/!TARGET_BRANCH!
echo ======================================================
echo.

:: 5. Stage Working Tree
echo [3/6] Staging Project Changes...
git add -A :/

echo ------------------ STAGED FILES ------------------
git status --short
echo --------------------------------------------------

:: 6. Commit Changes
echo.
echo [4/6] Commit Changes...
set "HAS_CHANGES=0"
for /f "delims=" %%S in ('git status --porcelain 2^>nul') do set "HAS_CHANGES=1"

if "!HAS_CHANGES!"=="0" (
    echo [INFO] Working tree clean. No new changes to commit.
    goto :STEP_PULL
)

set "COMMIT_MSG="
set /p "COMMIT_MSG=Enter commit message [Press ENTER for 'Update files']: "
if "!COMMIT_MSG!"=="" set "COMMIT_MSG=Update files"
set "COMMIT_MSG=!COMMIT_MSG:"=!"

git commit -m "!COMMIT_MSG!"
if errorlevel 1 goto :ERR_COMMIT_FAIL
echo [OK] Changes successfully committed.

:STEP_PULL
:: 7. Pull Remote Updates
echo.
echo [5/6] Pulling Remote Updates from origin/!TARGET_BRANCH!...
git pull origin !TARGET_BRANCH! --no-rebase
if errorlevel 1 (
    echo.
    echo [WARNING] Failed to pull from remote origin/!TARGET_BRANCH!.
    echo Possible reasons: Remote branch does not exist yet or merge conflicts occurred.
    set "CONT_PUSH=Y"
    set /p "CONT_PUSH=Do you still want to proceed with push? [Y/N] [Default: Y]: "
    if /i "!CONT_PUSH!"=="N" goto :SCRIPT_FAIL
)

:: 8. Push to GitHub
echo.
echo [6/6] Pushing to origin/!TARGET_BRANCH!...
echo Pushing: !LOCAL_BRANCH! to origin/!TARGET_BRANCH!
git push -u origin !LOCAL_BRANCH!:!TARGET_BRANCH!
if errorlevel 1 goto :ERR_PUSH_FAIL

echo.
echo ======================================================
echo [SUCCESS] Repository synced to GitHub successfully!
echo Pushed: !LOCAL_BRANCH! to origin/!TARGET_BRANCH!
echo ======================================================
goto :FINISH

:: --- Error Handlers ---

:ERR_NO_GIT
echo [ERROR] Git is not installed or not added to system PATH.
goto :SCRIPT_FAIL

:ERR_NO_DIR
echo [ERROR] Target directory not found: !FULL_PATH!
goto :SCRIPT_FAIL

:ERR_ACCESS_DIR
echo [ERROR] Failed to access directory: !FULL_PATH!
goto :SCRIPT_FAIL

:ERR_NOT_GIT
echo [ERROR] The directory is not a valid Git repository: !FULL_PATH!
goto :SCRIPT_FAIL

:ERR_NO_ORIGIN
echo [ERROR] No remote 'origin' configured in this repository.
echo Please link a remote repository first: git remote add origin [URL]
goto :SCRIPT_FAIL

:ERR_DETACHED_HEAD
echo [ERROR] Detached HEAD state detected!
echo Please checkout a valid branch before running this script.
goto :SCRIPT_FAIL

:ERR_COMMIT_FAIL
echo [ERROR] Git commit failed!
goto :SCRIPT_FAIL

:ERR_PUSH_FAIL
echo.
echo ======================================================
echo [FAILED] Push failed! Troubleshooting checklist:
echo 1. Check your network or GitHub authentication credentials.
echo 2. Check if remote branch has conflicting commits.
echo 3. Verify write permissions to the repository.
echo ======================================================
goto :SCRIPT_FAIL

:SCRIPT_FAIL
echo.
echo Execution terminated with errors.

:FINISH
echo.
pause
endlocal