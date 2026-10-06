@echo off
setlocal enabledelayedexpansion
title Universal Git Auto-Recovery and Push Tool

echo ================================================================
echo           UNIVERSAL GIT AUTO-RECOVERY AND PUSH TOOL
echo ================================================================
echo.

:: 1. Navigate to the script's own folder first
cd /d "%~dp0"

:: 2. Verify Git installation
where git >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Git is not installed or not found in system PATH.
    goto :FAIL
)

:: 3. Discover repository root dynamically from any depth
echo [INFO] Resolving Git repository root...
for /f "delims=" %%i in ('git rev-parse --show-toplevel 2^>nul') do set "GIT_ROOT=%%i"

if "%GIT_ROOT%"=="" (
    echo [ERROR] No Git repository detected in current or parent directories.
    goto :FAIL
)

:: Normalize slash for Windows cmd and switch to Git root
set "GIT_ROOT=!GIT_ROOT:/=\!"
cd /d "!GIT_ROOT!"
echo [INFO] Working directory switched to: !GIT_ROOT!
echo.

:: 4. Check for uncommitted working tree changes and stash if dirty
set "STASHED=0"
for /f "tokens=*" %%s in ('git status --porcelain 2^>nul') do set "IS_DIRTY=1"
if defined IS_DIRTY (
    echo [INFO] Uncommitted changes detected. Creating temporary stash...
    git stash push -m "auto_stash_before_sync" >nul 2>&1
    set "STASHED=1"
)

:: 5. Determine target branch
set "TARGET_BRANCH=%~1"
if "%TARGET_BRANCH%"=="" (
    :: Try reading remote default branch (e.g., origin/main -> main)
    for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref origin/HEAD 2^>nul') do (
        set "RAW_REMOTE=%%b"
        set "TARGET_BRANCH=!RAW_REMOTE:origin/=!"
    )
)
if "%TARGET_BRANCH%"=="" (
    :: Fallback checks: main -> master -> fallback to main
    git show-ref --verify --quiet refs/heads/main 2>nul
    if !errorlevel! equ 0 (
        set "TARGET_BRANCH=main"
    ) else (
        git show-ref --verify --quiet refs/heads/master 2>nul
        if !errorlevel! equ 0 (
            set "TARGET_BRANCH=master"
        ) else (
            set "TARGET_BRANCH=main"
        )
    )
)

:: 6. Check detached HEAD status
set "CURRENT_BRANCH="
for /f "tokens=*" %%b in ('git branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%b"

if "%CURRENT_BRANCH%"=="" (
    set "IS_DETACHED=1"
    echo [STATUS] Current state: DETACHED HEAD
) else (
    set "IS_DETACHED=0"
    set "TARGET_BRANCH=%CURRENT_BRANCH%"
    echo [STATUS] Current branch: %CURRENT_BRANCH%
)
echo [STATUS] Target sync branch: %TARGET_BRANCH%
echo.

:: 7. Execute recovery and synchronization
if "%IS_DETACHED%"=="1" (
    echo ----------------------------------------------------------------
    echo Step 1/5: Capturing commit from detached HEAD...
    for /f "tokens=*" %%c in ('git rev-parse HEAD') do set "HEAD_COMMIT=%%c"
    for /f "tokens=*" %%s in ('git rev-parse --short HEAD') do set "SHORT_COMMIT=%%s"
    echo Detached commit hash: !HEAD_COMMIT!

    echo.
    echo Step 2/5: Creating recovery branch...
    set "TEMP_BRANCH=recovery_!SHORT_COMMIT!_!RANDOM!"
    git branch "!TEMP_BRANCH!" !HEAD_COMMIT!
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to create recovery branch.
        goto :FAIL
    )
    echo Created temporary branch: !TEMP_BRANCH!

    echo.
    echo Step 3/5: Switching to branch [%TARGET_BRANCH%]...
    git checkout %TARGET_BRANCH%
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to checkout branch %TARGET_BRANCH%.
        goto :FAIL
    )

    echo.
    echo Step 4/5: Pulling latest changes from remote...
    git pull origin %TARGET_BRANCH% --no-rebase
    if !errorlevel! neq 0 (
        echo [WARNING] Remote pull returned non-zero code. Attempting merge...
    )

    echo.
    echo Step 5/5: Merging detached commits into [%TARGET_BRANCH%]...
    git merge !TEMP_BRANCH! -m "Auto-merge: recover detached commit !SHORT_COMMIT!"
    if !errorlevel! neq 0 (
        echo.
        echo [ERROR] Merge conflict occurred during recovery!
        echo [ACTION] Please resolve conflicts in your editor.
        echo [NOTE] Your detached work is safely preserved in branch: !TEMP_BRANCH!
        goto :FAIL
    )

    echo [INFO] Cleaning up temporary recovery branch...
    git branch -D !TEMP_BRANCH! >nul 2>&1

) else (
    echo ----------------------------------------------------------------
    echo Pulling latest changes from origin/%TARGET_BRANCH%...
    git pull origin %TARGET_BRANCH% --no-rebase
    if !errorlevel! neq 0 (
        echo [ERROR] Pull failed. Please resolve conflicts or check network.
        goto :FAIL
    )
)

:: 8. Push to remote
echo.
echo ----------------------------------------------------------------
echo Pushing synchronized branch [%TARGET_BRANCH%] to remote...
echo ----------------------------------------------------------------
git push origin %TARGET_BRANCH%
if !errorlevel! neq 0 (
    echo [ERROR] Push failed. Remote rejected updates.
    goto :FAIL
)

:: 9. Restore stash if stashed earlier
if "%STASHED%"=="1" (
    echo.
    echo [INFO] Restoring stashed uncommitted changes...
    git stash pop >nul 2>&1
)

:: 10. Success output
echo.
echo ================================================================
echo  [SUCCESS] All changes successfully synchronized and pushed!
echo  Synced Branch: %TARGET_BRANCH%
echo ================================================================
goto :END

:FAIL
if "%STASHED%"=="1" (
    echo.
    echo [INFO] Attempting to restore stashed changes...
    git stash pop >nul 2>&1
)
echo.
echo ================================================================
echo  [FAILED] Synchronization stopped. Check the error log above.
echo ================================================================

:END
echo.
pause
exit /b