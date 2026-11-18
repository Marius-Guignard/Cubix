@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===== Envoi de Cubix sur GitHub =====
where git >nul 2>nul
if errorlevel 1 (
  echo Git n'est pas installe. Installe "Git pour Windows" sur git-scm.com puis relance ce fichier.
  pause
  exit /b
)
if not exist ".git" git init -b main
git config user.name "Marius-Guignard"
git config user.email "marius@cubix.local"
git config core.autocrlf false
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/Marius-Guignard/Cubix.git
if not exist ".gitignore" (
  echo dist/> .gitignore
  echo node_modules/>> .gitignore
)
git add -A
git commit -m "Mise a jour Cubix"
git push -u origin main
if errorlevel 1 (
  echo.
  echo L'envoi a echoue. Si une fenetre GitHub s'ouvre, connecte-toi puis relance ce fichier.
) else (
  echo.
  echo Termine ! Les autres ordinateurs recevront la mise a jour au prochain lancement de Cubix.
)
pause
