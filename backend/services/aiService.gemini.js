const axios = require('axios');

/**
 * Google AI Studio (Gemini) Service
 * FREE API for AI code assistance - Perfect for deployment!
 * 
 * Get your FREE API key: https://aistudio.google.com/app/apikey
 * 
 * Free Tier Limits:
 * - 60 requests per minute
 * - 1,500 requests per day
 * - 32K context window
 */
class GeminiAIService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY;
    // Use the full model path as returned by the API
    this.model = process.env.AI_MODEL || 'models/gemini-2.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
    if (!this.apiKey) {
      console.warn('⚠️  GOOGLE_AI_API_KEY not set. AI features will be disabled.');
      console.warn('Get your FREE API key at: https://aistudio.google.com/app/apikey');
    } else {
      console.log('✅ Google AI Studio (Gemini) initialized successfully');
      console.log(`   Model: ${this.model}`);
    }
  }

  async generateCode(prompt, language, context = '') {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const systemPrompt = this.buildSystemPrompt(language, context);
      const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
      
      return await this.callGemini(fullPrompt);
    } catch (error) {
      console.error('AI Code Generation Error:', error.message);
      throw new Error(`Failed to generate code: ${error.message}`);
    }
  }

  async analyzeCode(code, language) {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const prompt = `Analyze the following ${language} code for potential issues, bugs, or improvements:

\`\`\`${language}
${code}
\`\`\`

Please provide a detailed analysis including:
1. Syntax errors or warnings
2. Potential bugs or logical issues
3. Code quality improvements
4. Performance optimizations
5. Security concerns
6. Best practices recommendations

Format your response as JSON with this structure:
{
  "errors": [{"line": number, "message": "error description", "severity": "error|warning|info"}],
  "suggestions": [{"line": number, "message": "suggestion description", "type": "quality|performance|security"}],
  "summary": "overall assessment"
}`;

      const response = await this.callGemini(prompt);
      
      try {
        // Try to parse JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return { summary: response, errors: [], suggestions: [] };
      } catch (parseError) {
        return { summary: response, errors: [], suggestions: [] };
      }
    } catch (error) {
      console.error('AI Code Analysis Error:', error.message);
      throw new Error(`Failed to analyze code: ${error.message}`);
    }
  }

  async explainCode(code, language) {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const prompt = `Explain the following ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. What the code does (overview)
2. How it works step by step
3. Key concepts and patterns used
4. Important variables or functions
5. Potential use cases
6. Related concepts or alternatives

Make the explanation clear and educational.`;

      return await this.callGemini(prompt);
    } catch (error) {
      console.error('AI Code Explanation Error:', error.message);
      throw new Error(`Failed to explain code: ${error.message}`);
    }
  }

  async chatWithAI(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const prompt = this.buildChatPrompt(message, conversationHistory);
      return await this.callGemini(prompt);
    } catch (error) {
      console.error('AI Chat Error:', error.message);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }

  async fixCode(code, language, errorDescription = '') {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const prompt = `Fix the following ${language} code. ${errorDescription ? `Error: ${errorDescription}` : 'Please identify and fix any issues:'}

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The corrected code (wrapped in code blocks)
2. Explanation of what was fixed
3. Any additional improvements made

Make sure to return working, production-ready code.`;

      return await this.callGemini(prompt);
    } catch (error) {
      console.error('AI Code Fix Error:', error.message);
      throw new Error(`Failed to fix code: ${error.message}`);
    }
  }

  async optimizeCode(code, language) {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

    try {
      const prompt = `Optimize the following ${language} code for better performance, readability, and maintainability:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. The optimized code (wrapped in code blocks)
2. Explanation of optimizations made
3. Performance improvements
4. Code quality enhancements

Focus on real-world improvements that make a difference.`;

      return await this.callGemini(prompt);
    } catch (error) {
      console.error('AI Code Optimization Error:', error.message);
      throw new Error(`Failed to optimize code: ${error.message}`);
    }
  }

  async generateTests(code, language) {
    if (!this.apiKey) {
      throw new Error('AI service not configured. Please set GOOGLE_AI_API_KEY environment variable.');
    }

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
5. Mock data and fixtures

Use popular testing frameworks for ${language}.`;

      return await this.callGemini(prompt);
    } catch (error) {
      console.error('AI Test Generation Error:', error.message);
      throw new Error(`Failed to generate tests: ${error.message}`);
    }
  }

  // Core Gemini API call
  async callGemini(prompt, temperature = 0.7) {
    try {
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      } else if (error.response?.status === 403) {
        throw new Error('Invalid API key. Please check your GOOGLE_AI_API_KEY.');
      } else if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      } else {
        throw error;
      }
    }
  }

  // Helper methods
  buildSystemPrompt(language, context) {
    return `You are an expert ${language} programmer and coding assistant powered by Google Gemini.
    
Context: ${context}

Please provide:
- Clean, well-documented code
- Best practices and conventions for ${language}
- Proper error handling
- Clear comments explaining complex logic
- Efficient and readable solutions

Format your response with code in markdown code blocks when showing code.`;
  }

  buildChatPrompt(message, conversationHistory) {
    const history = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    return `You are an AI coding assistant powered by Google Gemini. Help with programming questions, code reviews, debugging, and general software development topics.

${history ? `Previous conversation:\n${history}\n` : ''}
Current message: ${message}

Please provide helpful, accurate, and practical responses with code examples when relevant.`;
  }

  // Get available providers
  getAvailableProviders() {
    return ['gemini'];
  }

  // Check if AI is available
  async isAvailable() {
    if (!this.apiKey) {
      return false;
    }
    
    try {
      // Simple test call
      await this.callGemini('Say "OK" if you can respond.', 0.1);
      return true;
    } catch (error) {
      console.error('Gemini availability check failed:', error.message);
      return false;
    }
  }

  // Get model info
  getModelInfo() {
    return {
      provider: 'Google AI Studio',
      model: this.model,
      isConfigured: !!this.apiKey,
      freeTier: {
        requestsPerMinute: 60,
        requestsPerDay: 1500,
        contextWindow: '32K tokens'
      }
    };
  }
}

module.exports = new GeminiAIService();

