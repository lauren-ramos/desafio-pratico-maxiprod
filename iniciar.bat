@echo off
REM Abre o backend e o frontend, cada um em seu proprio terminal.
start "Backend"  cmd /k "cd /d %~dp0backend\src\ControleGastos.Api && dotnet run"
start "Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"
