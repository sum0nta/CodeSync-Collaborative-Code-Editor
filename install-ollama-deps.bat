@echo off
echo 🚀 Installing Ollama dependencies for CodeSync AI...

REM Check if we're in the right directory
if not exist "backend\package.json" (
    echo ❌ Error: Please run this script from the CodeSync root directory
    pause
    exit /b 1
)

echo 📦 Installing axios in backend...
cd backend
npm install axios

echo 🗑️  Removing Google AI dependency...
npm uninstall @google/generative-ai

echo ✅ Dependencies updated successfully!
echo.
echo 📋 Next steps:
echo 1. Install Ollama from https://ollama.ai
echo 2. Download a model: ollama pull codellama:7b
echo 3. Start Ollama: ollama serve
echo 4. Update your .env file (see OLLAMA_SETUP_GUIDE.md)
echo 5. Restart your backend server
echo.
echo 📖 For detailed setup instructions, see OLLAMA_SETUP_GUIDE.md
pause
