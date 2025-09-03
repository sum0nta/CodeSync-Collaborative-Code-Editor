# Use the official Ollama image as base
FROM ollama/ollama:latest

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm ci for faster, reliable builds)
RUN npm ci --only=production

# Copy source code
COPY . .

# Create a startup script
RUN echo '#!/bin/bash\n\
# Start Ollama in the background\n\
ollama serve &\n\
\n\
# Wait for Ollama to be ready\n\
echo "Waiting for Ollama to start..."\n\
until curl -s http://localhost:11434/api/tags > /dev/null; do\n\
  sleep 2\n\
  echo "Still waiting for Ollama..."\n\
done\n\
\n\
# Pull the default model if not present\n\
echo "Checking for model..."\n\
if ! ollama list | grep -q "codellama:7b"; then\n\
  echo "Downloading codellama:7b model..."\n\
  ollama pull codellama:7b\n\
fi\n\
\n\
# Start the Node.js backend\n\
echo "Starting Node.js backend..."\n\
exec node index.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 5001 11434

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
  CMD curl -f http://localhost:5001/api/health || exit 1

# Start the application
CMD ["/app/start.sh"]
