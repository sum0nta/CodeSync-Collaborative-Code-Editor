# Ollama Setup Guide for CodeSync AI

This guide will help you set up Ollama to replace Google Gemini in your CodeSync AI assistant.

## What is Ollama?

Ollama is a free, open-source AI platform that runs locally on your machine. It allows you to use various AI models without API costs or rate limits.

## Installation

### 1. Install Ollama

Visit [ollama.ai](https://ollama.ai) and download the installer for your operating system:

- **Windows**: Download and run the Windows installer
- **macOS**: Download and run the macOS installer  
- **Linux**: Run the installation script

### 2. Verify Installation

Open a terminal/command prompt and run:
```bash
ollama --version
```

You should see the Ollama version number.

## Downloading Models

### Recommended Models for Coding

1. **CodeLlama 7B** (Best for coding, ~4GB):
   ```bash
   ollama pull codellama:7b
   ```

2. **CodeLlama 13B** (Better quality, ~7GB):
   ```bash
   ollama pull codellama:13b
   ```

3. **Llama2 7B** (Good general purpose, ~4GB):
   ```bash
   ollama pull llama2:7b
   ```

4. **Mistral 7B** (Fast and efficient, ~4GB):
   ```bash
   ollama pull mistral:7b
   ```

### Other Available Models

- **Neural Chat**: `ollama pull neural-chat:7b`
- **Vicuna**: `ollama pull vicuna:7b`
- **Wizard Coder**: `ollama pull wizardcoder:7b`

## Starting Ollama

### 1. Start the Service

```bash
ollama serve
```

This starts the Ollama server on `http://localhost:11434`

### 2. Keep it Running

- **Windows**: Run `ollama serve` in a command prompt and keep it open
- **macOS/Linux**: Use `ollama serve &` to run in background

## Configuration

### 1. Environment Variables

Update your `.env` file in the backend directory:

```env
# Remove or comment out Google AI
# GOOGLE_AI_API_KEY=your_key_here

# Add Ollama configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=codellama:7b
```

### 2. Install Dependencies

In your backend directory, install axios:

```bash
cd backend
npm install axios
npm uninstall @google/generative-ai
```

## Usage

### 1. Start Your Backend

```bash
cd backend
npm start
```

### 2. Start Your Frontend

```bash
cd frontend
npm start
```

### 3. Use the AI Assistant

- Open the AI assistant in CodeSync
- Select your preferred model from the dropdown
- Start chatting with your local AI!

## Troubleshooting

### Common Issues

1. **"Ollama connection failed"**
   - Make sure Ollama is running: `ollama serve`
   - Check if port 11434 is available

2. **"Model not found"**
   - Install the model: `ollama pull modelname`
   - Check available models: `ollama list`

3. **Slow responses**
   - Use smaller models (7B instead of 13B)
   - Close other applications to free up RAM
   - Consider using a GPU if available

4. **High memory usage**
   - Models require 4-8GB RAM
   - Close unused models: `ollama rm modelname`

### Performance Tips

1. **Use appropriate model size**:
   - 7B models: Good for most tasks, faster
   - 13B models: Better quality, slower

2. **GPU acceleration** (if available):
   - Install CUDA drivers
   - Ollama will automatically use GPU

3. **Model switching**:
   - Switch models based on task
   - Use smaller models for quick responses

## Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| codellama:7b | ~4GB | Fast | Good | Coding, debugging |
| codellama:13b | ~7GB | Medium | Better | Complex code analysis |
| llama2:7b | ~4GB | Fast | Good | General programming |
| mistral:7b | ~4GB | Very Fast | Good | Quick responses |

## Benefits of Ollama

✅ **Free to use** - No API costs or rate limits  
✅ **Privacy** - All data stays on your machine  
✅ **Offline** - Works without internet connection  
✅ **Customizable** - Choose from many models  
✅ **Fast** - No network latency  
✅ **Unlimited** - No usage quotas  

## Next Steps

1. Install Ollama and download your preferred models
2. Update your environment configuration
3. Restart your backend and frontend
4. Enjoy free, unlimited AI assistance!

## Support

- **Ollama Documentation**: [ollama.ai/docs](https://ollama.ai/docs)
- **Model Library**: [ollama.ai/library](https://ollama.ai/library)
- **Community**: [GitHub Discussions](https://github.com/ollama/ollama/discussions)

---

**Note**: The first time you use a model, it may take a few minutes to download and initialize. Subsequent uses will be much faster.
