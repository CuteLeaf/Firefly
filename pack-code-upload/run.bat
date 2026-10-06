@echo off
chcp 65001 >nul
cd /d "%~dp0"
setlocal enabledelayedexpansion

set "py_count=0"

:: 遍历当前目录下的所有 .py 文件并记录编号
for %%f in (*.py) do (
    set /a py_count+=1
    set "py_!py_count!=%%f"
)

:: 判断文件数量
if !py_count! equ 0 goto :no_py
if !py_count! equ 1 (
    set "target_py=!py_1!"
    goto :run_py
)

:: 存在多个 Python 文件时，进入交互选择菜单
:select_py
cls
echo ========================================================
echo 检测到当前目录下存在 !py_count! 个 Python 脚本，请选择：
echo ========================================================
for /l %%i in (1, 1, !py_count!) do (
    echo   [%%i] !py_%%i!
)
echo ========================================================
echo.

set "choice="
set /p "choice=请输入要运行的脚本序号 (1-!py_count!): "

:: 校验输入有效性
if not defined choice goto :invalid_choice
for /f "delims=0123456789" %%a in ("!choice!") do goto :invalid_choice
if !choice! lss 1 goto :invalid_choice
if !choice! gtr !py_count! goto :invalid_choice

set "target_py=!py_%choice%!"
goto :run_py

:invalid_choice
echo.
echo [错误] 输入的序号无效，按任意键重新选择...
pause >nul
goto :select_py

:run_py
echo.
echo ========================================================
echo [已选定] !target_py!
echo [运行中] 正在启动 Python 脚本...
echo ========================================================
echo.

:: 运行选定的 Python 脚本
python "!target_py!"

echo.
echo ========================================================
echo [提示] 脚本执行完毕。终端保持就绪状态，可继续输入命令。
echo ========================================================
goto :keep_terminal

:no_py
echo ========================================================
echo [错误] 当前目录下未找到任何 .py 文件！
echo ========================================================
goto :keep_terminal

:keep_terminal
cmd /k