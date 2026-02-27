@echo off
chcp 65001 >nul
echo Instalando dependências do projeto...
cd /d "%~dp0"
npm install
echo.
echo Instalação concluída!
echo.
echo Próximos passos:
echo 1. Configure o arquivo .env com EVOLUTION_API_PATH
echo 2. Compile a Evolution API: cd ..\..\ap.api\evolution-api ^&^& npm run build
echo 3. Execute: npm run dev
pause
