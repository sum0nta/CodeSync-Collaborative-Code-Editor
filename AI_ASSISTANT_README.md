# AI Assistant Feature - CodeSync

## Overview

The AI Assistant feature provides intelligent code assistance powered by **Google AI Studio (Gemini 1.5 Pro)**. This feature enhances the collaborative coding experience by offering code generation, analysis, explanation, and optimization capabilities directly within the CodeSync editor.

## Features

### 🤖 Core AI Capabilities

- **Code Generation**: Generate code from natural language descriptions
- **Code Analysis**: Identify bugs, errors, and potential improvements
- **Code Explanation**: Get detailed explanations of code functionality
- **Code Fixing**: Automatically fix common code issues
- **Code Optimization**: Improve performance and readability
- **Test Generation**: Create comprehensive test suites
- **Interactive Chat**: Ask programming questions and get AI assistance

### 🎯 AI Provider

- **Google AI Studio (Gemini 1.5 Pro)**: Advanced AI model for code generation and analysis
- **Multi-language Support**: Works with JavaScript, Python, Java, C++, and many other programming languages
- **Context-Aware**: Understands your current file and project context

## Setup

### Prerequisites

1. **Google AI Studio API Key**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Backend Server**: Ensure the backend is running on port 5001
3. **Frontend Application**: Ensure the frontend is running on port 3000

### Configuration

1. **Copy Environment Template**:
   ```bash
   cp backend/env.example backend/.env
   ```

2. **Add Your API Key**:
   ```bash
   # Edit backend/.env
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

3. **Restart Backend**:
   ```bash
   cd backend
   npm start
   ```

### API Key Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your `backend/.env` file
5. Restart the backend server

## Usage

### Opening the AI Assistant

1. Click the **"🤖 AI Assistant"** button in the main toolbar
2. The AI Assistant panel will open with a chat interface

### Quick Actions

The AI Assistant provides several quick action buttons:

- **🔵 Generate Code**: Create code from descriptions in the input field
- **🟢 Analyze Code**: Analyze the currently open file for issues
- **🟣 Explain Code**: Get detailed explanations of the current code
- **🔴 Fix Code**: Automatically fix issues in the current code
- **🟡 Optimize**: Improve performance and readability
- **🟦 Generate Tests**: Create comprehensive test suites

### Chat Interface

- **Ask Questions**: Type programming questions in the chat input
- **Code Context**: The AI understands your current file and project
- **Conversation History**: Maintains context across multiple messages
- **Code Insertion**: Click the checkmark to insert generated code into the editor

### Code Actions

- **Copy Code**: Click the copy icon to copy generated code to clipboard
- **Insert Code**: Click the checkmark to insert code directly into the editor
- **Clear Conversation**: Click the X button to start a fresh conversation

## API Endpoints

All AI endpoints require authentication via JWT token.

### Base URL
```
http://localhost:5001/api/ai
```

### Endpoints

#### Generate Code
```http
POST /generate
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "prompt": "Create a function to calculate fibonacci numbers",
  "language": "javascript",
  "context": "Current file content for context"
}
```

#### Analyze Code
```http
POST /analyze
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "function test() { return 1; }",
  "language": "javascript"
}
```

#### Explain Code
```http
POST /explain
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "function test() { return 1; }",
  "language": "javascript"
}
```

#### Chat with AI
```http
POST /chat
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "message": "How do I implement a binary search?",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

#### Fix Code
```http
POST /fix
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "function test() { return 1; }",
  "language": "javascript",
  "errorDescription": "Optional error description"
}
```

#### Optimize Code
```http
POST /optimize
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "function test() { return 1; }",
  "language": "javascript"
}
```

#### Generate Tests
```http
POST /tests
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "code": "function test() { return 1; }",
  "language": "javascript"
}
```

#### Get Available Providers
```http
GET /providers
Authorization: Bearer <jwt_token>
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_AI_API_KEY` | Google AI Studio API key | Yes | - |
| `PORT` | Backend server port | No | 5001 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |

### AI Model Configuration

The AI Assistant uses **Gemini 1.5 Pro** by default, which provides:
- Advanced code understanding and generation
- Multi-language support
- Context-aware responses
- High-quality code analysis

## Security

### Authentication
- All AI endpoints require valid JWT authentication
- API keys are stored securely in environment variables
- No API keys are exposed to the frontend

### Rate Limiting
- Consider implementing rate limiting for production use
- Monitor API usage to stay within Google AI Studio limits

### Input Validation
- All user inputs are validated and sanitized
- Code analysis is performed in a secure environment

## Troubleshooting

### Common Issues

#### "Gemini AI is not available"
- **Cause**: Missing or invalid API key
- **Solution**: Check your `GOOGLE_AI_API_KEY` in `backend/.env`

#### "Failed to generate code"
- **Cause**: API key issues or network problems
- **Solution**: Verify API key and check network connectivity

#### "Authentication required"
- **Cause**: Missing or expired JWT token
- **Solution**: Log in again to get a fresh token

### Debug Mode

Enable debug logging by adding to `backend/.env`:
```bash
DEBUG=ai-service:*
```

### API Key Verification

Test your API key:
```bash
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello, world!"}]
    }]
  }'
```

## Performance

### Response Times
- Code generation: 2-5 seconds
- Code analysis: 1-3 seconds
- Chat responses: 1-4 seconds

### Optimization Tips
- Keep conversation history manageable
- Use specific prompts for better results
- Provide context when asking questions

## Limitations

### Current Limitations
- Requires internet connection for AI features
- API rate limits apply
- Large code files may have slower analysis
- Some complex code patterns may need clarification

### Future Enhancements
- Offline code analysis capabilities
- Custom AI model fine-tuning
- Integration with more AI providers
- Advanced code refactoring features

## Support

For issues related to the AI Assistant:
1. Check the troubleshooting section above
2. Verify your API key configuration
3. Check the browser console for error messages
4. Review the backend logs for detailed error information

## Contributing

To contribute to the AI Assistant feature:
1. Follow the existing code structure
2. Add proper error handling
3. Include tests for new functionality
4. Update documentation for any changes

---

**Note**: The AI Assistant feature requires a valid Google AI Studio API key to function. Make sure to configure your API key before using the feature.
