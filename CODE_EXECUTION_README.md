# Code Execution Feature

## Overview

The Code Execution feature allows users to execute code directly within the collaborative code editor environment. This feature supports multiple programming languages and provides a secure, sandboxed execution environment with real-time output display.

## Features

### 🚀 Supported Programming Languages

- **JavaScript** - Executed in a sandboxed VM environment
- **Python** - Native Python execution
- **Java** - Compiled and executed Java code
- **C++** - Compiled and executed C++ code
- **C** - Compiled and executed C code
- **PHP** - Native PHP execution
- **Ruby** - Native Ruby execution
- **Go** - Native Go execution
- **Rust** - Compiled and executed Rust code

### 🔧 Key Features

- **Real-time Code Execution** - Execute code with immediate feedback
- **Input Support** - Provide input to programs that require user interaction
- **Output Display** - Clear separation of stdout and stderr output
- **Error Handling** - Comprehensive error reporting and display
- **Execution History** - Track recent executions with timestamps
- **Download Results** - Export execution results as text files
- **Timeout Protection** - Configurable execution timeouts (default: 10 seconds)
- **Sandboxed Environment** - Secure execution with limited system access
- **Language Auto-detection** - Automatically detect language based on file extension

### 🛡️ Security Features

- **Sandboxed Execution** - JavaScript runs in a VM2 sandbox
- **Process Isolation** - Each execution runs in a separate process
- **Timeout Limits** - Prevents infinite loops and resource exhaustion
- **Input Validation** - Validates code and input length
- **Temporary File Cleanup** - Automatic cleanup of temporary files
- **Authentication Required** - All execution requests require valid JWT tokens

## Installation & Setup

### Prerequisites

Ensure the following programming language runtimes are installed on your system:

```bash
# JavaScript (Node.js)
node --version

# Python
python --version

# Java
javac --version

# C/C++ (GCC)
gcc --version
g++ --version

# PHP
php --version

# Ruby
ruby --version

# Go
go version

# Rust
rustc --version
```

### Backend Dependencies

The following new dependencies have been added to `backend/package.json`:

```json
{
  "child_process": "^1.0.2",
  "vm2": "^3.9.19",
  "uuid": "^9.0.1",
  "fs-extra": "^11.1.1"
}
```

Install the new dependencies:

```bash
cd backend
npm install
```

### Frontend Integration

The code execution feature is integrated into the existing VSCode layout with:

- A new "Execute" button in the toolbar
- A slide-out panel for code execution
- Integration with the current file's content and language

## Usage

### Basic Code Execution

1. **Open a file** in the editor
2. **Click the "Execute" button** (▶️) in the toolbar
3. **Select the programming language** from the dropdown
4. **Optionally provide input** in the input field
5. **Click "Execute"** to run the code
6. **View the results** in the output panel

### Advanced Features

#### Input Support
For programs that require user input, you can provide input in the dedicated input field:

```python
# Example Python code that reads input
name = input("Enter your name: ")
print(f"Hello, {name}!")
```

#### Execution Settings
Click the settings icon (⚙️) to configure:
- **Auto-execute on save** - Automatically execute code when files are saved
- **Execution timeout** - Set custom timeout limits (1-60 seconds)

#### Output Management
- **Clear Output** - Clear current execution results
- **Download Results** - Export execution results as a text file
- **Execution History** - View recent executions with timestamps

## API Endpoints

### Execute Code
```http
POST /api/execution/execute
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "code": "console.log('Hello, World!');",
  "language": "javascript",
  "input": "optional input"
}
```

### Get Supported Languages
```http
GET /api/execution/languages
Authorization: Bearer <jwt_token>
```

### Get Execution Status
```http
GET /api/execution/status
Authorization: Bearer <jwt_token>
```

## Architecture

### Backend Components

#### CodeExecutionService (`backend/services/codeExecutionService.js`)
- Handles code execution for all supported languages
- Manages temporary file creation and cleanup
- Implements security measures and sandboxing
- Provides language-specific execution methods

#### CodeExecutionController (`backend/controllers/codeExecutionController.js`)
- Handles HTTP requests for code execution
- Validates input parameters
- Manages authentication and authorization
- Returns execution results

#### CodeExecutionRoutes (`backend/routes/codeExecutionRoutes.js`)
- Defines API endpoints for code execution
- Applies authentication middleware
- Routes requests to appropriate controllers

### Frontend Components

#### CodeExecution (`frontend/src/components/CodeExecution.jsx`)
- Main React component for the code execution interface
- Manages execution state and UI interactions
- Handles API communication
- Displays execution results and history

#### Integration with VSCodeLayout
- Added "Execute" button to the toolbar
- Integrated as a slide-out panel
- Connects with current file content and language

## Security Considerations

### JavaScript Sandboxing
JavaScript code runs in a VM2 sandbox with limited access:
- No file system access
- No network access
- Limited process access
- Controlled console output

### Process Isolation
- Each execution runs in a separate process
- Temporary files are created with unique IDs
- Automatic cleanup prevents file system pollution

### Input Validation
- Code length limit: 10,000 characters
- Input length limit: 1,000 characters
- Language validation against supported list
- Authentication required for all requests

### Timeout Protection
- Default timeout: 10 seconds
- Configurable timeout limits
- Process termination on timeout
- Resource cleanup on timeout

## Error Handling

### Common Error Types
- **Compilation Errors** - Syntax errors, missing dependencies
- **Runtime Errors** - Logic errors, exceptions
- **Timeout Errors** - Execution exceeds time limit
- **System Errors** - Missing language runtime, permission issues

### Error Display
- Clear error messages with line numbers
- Syntax highlighting for error output
- Separate error and output sections
- Error categorization and formatting

## Performance Considerations

### Optimization Features
- **Lazy Loading** - Components load only when needed
- **Caching** - Supported languages cached on first load
- **Efficient Cleanup** - Temporary files removed immediately
- **Resource Limits** - Configurable memory and time limits

### Scalability
- **Stateless Execution** - Each request is independent
- **Process Pooling** - Efficient process management
- **Load Balancing** - Can be distributed across multiple servers
- **Resource Monitoring** - Track execution resource usage

## Troubleshooting

### Common Issues

#### Language Runtime Not Found
```
Error: Command not found: python
```
**Solution**: Install the required language runtime on the server.

#### Permission Denied
```
Error: Permission denied
```
**Solution**: Ensure proper file permissions for temporary directories.

#### Timeout Issues
```
Error: Execution timed out
```
**Solution**: Increase timeout limit or optimize code performance.

#### Memory Issues
```
Error: Out of memory
```
**Solution**: Reduce code complexity or increase server memory.

### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=code-execution:*
```

## Future Enhancements

### Planned Features
- **Real-time Collaboration** - Share execution results with collaborators
- **Code Templates** - Pre-built code examples for common tasks
- **Execution Analytics** - Track execution patterns and performance
- **Custom Runtimes** - Support for additional programming languages
- **Dependency Management** - Install and manage language packages
- **Execution Scheduling** - Schedule code execution for later
- **Result Comparison** - Compare outputs from different executions

### Integration Opportunities
- **Git Integration** - Execute code from specific commits
- **CI/CD Pipeline** - Integrate with continuous integration
- **Testing Framework** - Automated test execution
- **Performance Profiling** - Code performance analysis
- **Security Scanning** - Code security analysis

## Contributing

### Adding New Languages
1. Add language support in `CodeExecutionService`
2. Update `getSupportedLanguages()` method
3. Add language icon in frontend component
4. Update documentation and tests

### Security Review
All code execution features must pass security review:
- Input validation
- Output sanitization
- Resource limits
- Access controls
- Error handling

## License

This feature is part of the CodeSync collaborative code editor project and follows the same licensing terms.
