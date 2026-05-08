@echo off
chcp 65001 >nul
title Flora 服务管理器

echo ========================================
echo   Flora 花店系统启动脚本
echo ========================================
echo.

:menu
echo 请选择操作:
echo [1] 启动所有服务 (API + 后台管理)
echo [2] 仅启动 API 服务 (端口 3000)
echo [3] 仅启动后台管理 (端口 5173)
echo [4] 查看运行中的服务
echo [5] 停止所有服务
echo [0] 退出
echo.
set /p choice=请输入选项 [1-5 或 0]:

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_api
if "%choice%"=="3" goto start_admin
if "%choice%"=="4" goto check_services
if "%choice%"=="5" goto stop_services
if "%choice%"=="0" goto end

echo 无效选项，请重试
echo.
goto menu

:start_all
echo.
echo [1/2] 正在启动 API 服务 (端口 3000)...
cd /d "%~dp0flora-server"
start "Flora-API" cmd /k "node app.js 2>&1 | tee ..\logs\api.log"
timeout /t 2 /nobreak >nul

echo [2/2] 正在启动后台管理 (端口 5173)...
cd /d "%~dp0flora-admin"
start "Flora-Admin" cmd /k "npm run dev 2>&1 | tee ..\logs\admin.log"
echo.
echo ========================================
echo   所有服务已启动!
echo ========================================
echo   API 服务:     http://localhost:3000
echo   后台管理:     http://localhost:5173
echo   日志目录:     %~dp0logs\
echo ========================================
echo.
echo 按任意键返回菜单...
pause >nul
goto menu

:start_api
echo.
echo 正在启动 API 服务 (端口 3000)...
cd /d "%~dp0flora-server"
start "Flora-API" cmd /k "node app.js 2>&1 | tee ..\logs\api.log"
echo.
echo API 服务已启动: http://localhost:3000
echo 日志文件: %~dp0logs\api.log
echo.
echo 按任意键返回菜单...
pause >nul
goto menu

:start_admin
echo.
echo 正在启动后台管理 (端口 5173)...
cd /d "%~dp0flora-admin"
start "Flora-Admin" cmd /k "npm run dev 2>&1 | tee ..\logs\admin.log"
echo.
echo 后台管理已启动: http://localhost:5173
echo 日志文件: %~dp0logs\admin.log
echo.
echo 按任意键返回菜单...
pause >nul
goto menu

:check_services
echo.
echo 检查运行中的服务...
echo.
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo [API] 端口 3000 - 运行中
) else (
    echo [API] 端口 3000 - 未运行
)

netstat -ano | findstr ":5173" | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo [Admin] 端口 5173 - 运行中
) else (
    echo [Admin] 端口 5173 - 未运行
)
echo.
echo 按任意键返回菜单...
pause >nul
goto menu

:stop_services
echo.
echo 正在停止所有服务...
taskkill /FI "WINDOWTITLE eq Flora*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Flora-*" /F >nul 2>&1
echo 所有服务已停止
echo.
echo 按任意键返回菜单...
pause >nul
goto menu

:end
echo.
echo 再见!
exit
