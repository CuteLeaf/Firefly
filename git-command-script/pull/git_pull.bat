@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo       Git Remote Branch & Version Switch Tool
echo ======================================================
echo.

:: 1. Configure repository path with defaults (Resolve two levels up)
for %%I in ("%~dp0..\..") do (
    set "DEFAULT_DIR=%%~fI"
    set "DEFAULT_PROJ=%%~nxI"
)

set /p "TARGET_DIR=Enter base directory path [Press ENTER for !DEFAULT_DIR!]: "
if "!TARGET_DIR!"=="" set "TARGET_DIR=!DEFAULT_DIR!"
set "TARGET_DIR=!TARGET_DIR:"=!"

set /p "TARGET_PROJ=Enter project folder name [Press ENTER for !DEFAULT_PROJ!]: "
if "!TARGET_PROJ!"=="" set "TARGET_PROJ=!DEFAULT_PROJ!"
set "TARGET_PROJ=!TARGET_PROJ:"=!"

:: Smart path resolution: Prevent duplicate nesting if TARGET_DIR is already the project root
set "FULL_PATH=!TARGET_DIR!\!TARGET_PROJ!"
if not exist "!FULL_PATH!" (
    for %%P in ("!TARGET_DIR!") do set "CUR_FOLDER=%%~nxP"
    if /i "!CUR_FOLDER!"=="!TARGET_PROJ!" (
        set "FULL_PATH=!TARGET_DIR!"
    ) else if exist "!TARGET_DIR!\.git" (
        set "FULL_PATH=!TARGET_DIR!"
    )
)

echo.
echo Target project path: !FULL_PATH!
echo.

:: Validate directory and Git workspace
if not exist "!FULL_PATH!" (
    echo [ERROR] Directory not found: !FULL_PATH!
    goto END
)

cd /d "!FULL_PATH!" || (
    echo [ERROR] Failed to access target directory.
    goto END
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] The directory is not a valid Git repository!
    goto END
)

:: 2. Fetch latest changes from remote
echo ------------------------------------------------------
echo [1/4] Fetching remote branches and commit metadata...
echo ------------------------------------------------------
git fetch --all --prune --tags
if errorlevel 1 (
    echo [WARNING] Failed to fetch from remote. Check your network or credentials.
    echo Proceeding with local cache...
)
echo.

:: 3. List and select remote branch
echo ------------------------------------------------------
echo [2/4] Select a remote branch:
echo ------------------------------------------------------
set b_count=0
for /f "tokens=*" %%i in ('git branch -r --no-color ^| findstr /v /c:"origin/HEAD"') do (
    set "raw_b=%%i"
    set "raw_b=!raw_b: =!"
    set /a b_count+=1
    set "branch_!b_count!=!raw_b!"
    echo   [!b_count!] !raw_b!
)

if %b_count% equ 0 (
    echo [ERROR] No remote branches found!
    goto END
)

:CHOOSE_BRANCH
set "b_choice="
set /p "b_choice=Enter branch index [1-%b_count%]: "
if not defined branch_%b_choice% (
    echo [INFO] Invalid input. Please enter a valid number.
    goto CHOOSE_BRANCH
)
set "SELECTED_BRANCH=!branch_%b_choice%!"
echo.
echo Selected branch: %SELECTED_BRANCH%
echo.

:: 4. List and select commit version
echo ------------------------------------------------------
echo [3/4] Select a commit version (showing latest 20):
echo ------------------------------------------------------
set c_count=0
for /f "tokens=1* delims= " %%a in ('git log %SELECTED_BRANCH% -n 20 --pretty^=format:"%%h %%ad [%%an] %%s" --date^=short') do (
    set /a c_count+=1
    set "commit_hash_!c_count!=%%a"
    set "commit_info_!c_count!=%%b"
    echo   [!c_count!] %%a - %%b
)

if %c_count% equ 0 (
    echo [ERROR] No commit history found on this branch!
    goto END
)

:CHOOSE_COMMIT
set "c_choice="
set /p "c_choice=Enter commit index [1-%c_count%]: "
if not defined commit_hash_%c_choice% (
    echo [INFO] Invalid input. Please enter a valid number.
    goto CHOOSE_COMMIT
)
set "SELECTED_HASH=!commit_hash_%c_choice%!"
set "SELECTED_INFO=!commit_info_%c_choice%!"
echo.
echo Selected commit: %SELECTED_HASH% (%SELECTED_INFO%)
echo.

:: 5. Force overwrite workspace (add, modify, delete sync)
echo ------------------------------------------------------
echo [4/4] Synchronizing workspace to target commit...
echo Warning: Untracked files and local uncommitted changes will be wiped.
echo ------------------------------------------------------

git checkout -f %SELECTED_HASH%
if errorlevel 1 (
    echo [ERROR] Checkout failed!
    goto END
)

git reset --hard %SELECTED_HASH%
git clean -fd

echo.
echo ======================================================
echo Success! Workspace fully synchronized to:
echo ======================================================
git log -1 --stat
echo ======================================================

:END
echo.
pause