# Multi-stage build for Ollama + Node.js backend
FROM ollama/ollama:latest as ollama

# Use Node.js 18 Alpine for the backend
FROM node:18-alpine

# Install dependencies for Ollama
RUN apk add --no-cache \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Copy Ollama from the ollama stage
COPY --from=ollama /usr/bin/ollama /usr/bin/ollama
COPY --from=ollama /usr/local/bin/ollama /usr/local/bin/ollama

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
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
  sleep 1\n\
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
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5001/api/health || exit 1

# Start the application
CMD ["/app/start.sh"]
