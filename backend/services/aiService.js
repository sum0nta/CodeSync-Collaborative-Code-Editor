const axios = require('axios');

class AIService {
  constructor() {
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'codellama:7b';
    
    // Debug: Log environment variables
    console.log('OLLAMA_BASE_URL:', this.ollamaBaseUrl);
    console.log('OLLAMA_MODEL:', this.model);
    
    // Test Ollama connection
    this.testConnection();
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.ollamaBaseUrl}/api/tags`);
      console.log('Ollama connection successful');
      console.log('Available models:', response.data.models?.map(m => m.name) || []);
    } catch (error) {
      console.warn('Ollama connection failed. Make sure Ollama is running locally.');
      console.warn('Install Ollama from: https://ollama.ai/');
    }
  }

  async generateCode(prompt, language, context = '') {
    try {
      const systemPrompt = this.buildSystemPrompt(language, context);
      const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
      
      return await this.generateWithOllama(fullPrompt);
    } catch (error) {
      console.error('AI Code Generation Error:', error);
      throw new Error(`Failed to generate code: ${error.message}`);
    }
  }

  async analyzeCode(code, language) {
    try {
      const prompt = `Analyze the following ${language} code for potential issues, bugs, or improvements:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Syntax errors or warnings
2. Potential bugs or logical issues
3. Code quality improvements
4. Performance optimizations
5. Security concerns
6. Best practices recommendations

Format your response as JSON with the following structure:
{
  "errors": [{"line": number, "message": "error description", "severity": "error|warning|info"}],
  "suggestions": [{"line": number, "message": "suggestion description", "type": "quality|performance|security"}],
  "summary": "overall assessment"
}`;

      return await this.analyzeWithOllama(prompt);
    } catch (error) {
      console.error('AI Code Analysis Error:', error);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async explainCode(code, language) {
    try {
      const prompt = `Explain the following ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. What the code does
2. How it works step by step
3. Key concepts and patterns used
4. Any important variables or functions
5. Potential use cases
6. Related concepts or alternatives`;

      return await this.explainWithOllama(prompt);
    } catch (error) {
      console.error('AI Code Explanation Error:', error);
      throw new Error(`Failed to explain code: ${error.message}`);
    }
  }

  async chatWithAI(message, conversationHistory = []) {
    try {
      const prompt = this.buildChatPrompt(message, conversationHistory);
      return await this.chatWithOllama(prompt);
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  async fixCode(code, language, errorDescription = '') {
    try {
      const prompt = `Fix the following ${language} code. ${errorDescription ? `Error: ${errorDescription}` : 'Please identify and fix any issues:'}

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The corrected code
2. Explanation of what was fixed
3. Any additional improvements made`;

      return await this.fixWithOllama(prompt);
    } catch (error) {
      console.error('AI Code Fix Error:', error);
      throw new Error(`Failed to fix code: ${error.message}`);
    }
  }

  async optimizeCode(code, language) {
    try {
      const prompt = `Optimize the following ${language} code for better performance, readability, and maintainability:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The optimized code
2. Explanation of optimizations made
3. Performance improvements
4. Code quality enhancements`;

      return await this.optimizeWithOllama(prompt);
    } catch (error) {
      console.error('AI Code Optimization Error:', error);
      throw new Error(`Failed to optimize code: ${error.message}`);
    }
  }

  async generateTests(code, language) {
    try {
      const prompt = `Generate comprehensive tests for the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Unit tests covering all functions/methods
2. Edge cases and error scenarios
3. Integration tests if applicable
4. Test setup and teardown code
5. Mock data and fixtures`;

      return await this.generateTestsWithOllama(prompt);
    } catch (error) {
      console.error('AI Test Generation Error:', error);
      throw new Error(`Failed to generate tests: ${error.message}`);
    }
  }

  // Ollama Implementation
  async generateWithOllama(prompt) {
    try {
      const response = await axios.post(`${this.ollamaBaseUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        }
      });
      
      return response.data.response;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`Model ${this.model} not found. Please install it with: ollama pull ${this.model}`);
      }
      throw error;
    }
  }

  async analyzeWithOllama(prompt) {
    const response = await this.generateWithOllama(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      return { error: 'Failed to parse AI response', raw: response };
    }
  }

  async explainWithOllama(prompt) {
    return await this.generateWithOllama(prompt);
  }

  async chatWithOllama(prompt) {
    return await this.generateWithOllama(prompt);
  }

  async fixWithOllama(prompt) {
    return await this.generateWithOllama(prompt);
  }

  async optimizeWithOllama(prompt) {
    return await this.generateWithOllama(prompt);
  }

  async generateTestsWithOllama(prompt) {
    return await this.generateWithOllama(prompt);
  }

  // Helper methods
  buildSystemPrompt(language, context) {
    return `You are an expert ${language} programmer and coding assistant using Ollama. 
    
Context: ${context}

Please provide:
- Clean, well-documented code
- Best practices and conventions for ${language}
- Proper error handling
- Clear comments explaining complex logic
- Efficient and readable solutions

Format your response as clean code without markdown formatting unless specifically requested.`;
  }

  buildChatPrompt(message, conversationHistory) {
    const history = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    return `You are an AI coding assistant powered by Ollama. Help with programming questions, code reviews, debugging, and general software development topics.

Previous conversation:
${history}

Current message: ${message}

Please provide helpful, accurate, and practical responses.`;
  }

  // Get available providers (now only Ollama)
  getAvailableProviders() {
    return ['ollama'];
  }

  // Check if AI is available
  async isAvailable() {
    try {
      await axios.get(`${this.ollamaBaseUrl}/api/tags`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get available models
  async getAvailableModels() {
    try {
      const response = await axios.get(`${this.ollamaBaseUrl}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      return [];
    }
  }

  // Change model
  async changeModel(modelName) {
    try {
      // Check if model exists
      const models = await this.getAvailableModels();
      const modelExists = models.some(m => m.name === modelName);
      
      if (!modelExists) {
        throw new Error(`Model ${modelName} not found. Available models: ${models.map(m => m.name).join(', ')}`);
      }
      
      this.model = modelName;
      console.log(`Model changed to: ${modelName}`);
      return true;
    } catch (error) {
      console.error('Error changing model:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
