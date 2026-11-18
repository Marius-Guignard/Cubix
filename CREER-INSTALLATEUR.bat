@echo off
chcp 65001 >nul
title Creation de l'installateur Cubix
cd /d "%~dp0"
echo.
echo  Creation de l'installateur Cubix (Node.js requis, internet requis la premiere fois)...
echo.
call npm install
if errorlevel 1 goto erreur
call npm run dist
if errorlevel 1 goto erreur
echo.
echo  Termine ! Ton installateur est dans le dossier "dist" :
echo     dist\Cubix-Setup-1.0.0.exe
echo.
start "" "%~dp0dist"
pause
exit /b 0
:erreur
echo.
echo  Une erreur est survenue. Fais une capture de cette fenetre.
pause
exit /b 1
