@echo off
REM ============================================================
REM  ITL Website - Windows Quick Start Script
REM  استبدل هذا الملف مكان أمر bun run dev
REM ============================================================

echo.
echo  ========================================
echo   ITL Website - Starting Dev Server
echo  ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo  [!] node_modules not found. Running bun install...
    call bun install
    if errorlevel 1 (
        echo  [X] Failed to install dependencies. Trying npm...
        call npm install
        if errorlevel 1 (
            echo  [X] npm install also failed. Please check your setup.
            pause
            exit /b 1
        )
    )
)

REM Check if .env exists
if not exist ".env" (
    echo  [!] .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo  [OK] .env created. Please edit it with your settings.
    ) else (
        echo  [!] .env.example not found. Creating minimal .env...
        echo DATABASE_URL="file:./db/custom.db" > .env
        echo AUTH_SECRET="change-this-to-random-32-chars" >> .env
    )
)

REM Check if database exists
if not exist "db\custom.db" (
    echo  [!] Database not found. Running db:push and seed...
    call bunx prisma db push
    if exist "scripts\seed.ts" (
        call bunx tsx scripts\seed.ts
    )
)

REM Delete stale lock file if exists
if exist ".next\dev\lock" (
    echo  [!] Stale lock file found. Removing...
    del /q ".next\dev\lock" 2>nul
)

REM Kill any process on port 3000
echo  [*] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000.*LISTENING"') do (
    echo  [!] Port 3000 is in use by PID %%a. Killing...
    taskkill /f /pid %%a 2>nul
)

REM Start the dev server
echo.
echo  [OK] Starting Next.js dev server on port 3000...
echo  [OK] Open: http://localhost:3000
echo  [OK] Admin: http://localhost:3000/admin-login
echo  [OK] Login: demo@itl.com / demo1234
echo.
echo  Press Ctrl+C to stop the server.
echo  ========================================
echo.

REM Try bun first, fall back to npx
where bun >nul 2>nul
if %errorlevel%==0 (
    bunx next dev -p 3000
) else (
    npx next dev -p 3000
)

pause
