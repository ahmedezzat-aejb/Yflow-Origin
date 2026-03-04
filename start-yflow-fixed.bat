@echo off
chcp 65001 >nul
echo Starting YFlow Platform - Complete Project
echo Languages: Russian, English, Arabic, Chinese
echo Payment: YooKassa + SBP
echo White Label: Complete
echo.

cd packages\react-ui
npx vite --port 4300 --host 0.0.0.0
