const { spawn, exec } = require('child_process');
const vm = require('vm');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutionService {
  constructor() {
    this.executionTimeout = 10000; // 10 seconds
    this.maxOutputSize = 10000; // 10KB
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.ensureDir(this.tempDir);
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async cleanupTempFiles(executionId) {
    try {
      const filePath = path.join(this.tempDir, `${executionId}.*`);
      const files = await fs.readdir(this.tempDir);
      const matchingFiles = files.filter(file => file.startsWith(executionId));
      
      for (const file of matchingFiles) {
        await fs.remove(path.join(this.tempDir, file));
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }

  async executeCode(code, language, input = '') {
    const executionId = uuidv4();
    
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          return await this.executeJavaScript(code, input, executionId);
        case 'python':
        case 'py':
          return await this.executePython(code, input, executionId);
        case 'java':
          return await this.executeJava(code, input, executionId);
        case 'cpp':
        case 'c++':
          return await this.executeCpp(code, input, executionId);
        case 'c':
          return await this.executeC(code, input, executionId);
        case 'php':
          return await this.executePHP(code, input, executionId);
        case 'ruby':
        case 'rb':
          return await this.executeRuby(code, input, executionId);
        case 'go':
          return await this.executeGo(code, input, executionId);
        case 'rust':
        case 'rs':
          return await this.executeRust(code, input, executionId);
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } finally {
      // Cleanup temp files
      await this.cleanupTempFiles(executionId);
    }
  }

  async executeJavaScript(code, input, executionId) {
    return new Promise((resolve, reject) => {
      try {
        // Create a sandboxed context
        const context = vm.createContext({
          console: {
            log: (...args) => {
              const output = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              return output;
            },
            error: (...args) => {
              const output = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              return output;
            }
          },
          setTimeout: setTimeout,
          setInterval: setInterval,
          clearTimeout: clearTimeout,
          clearInterval: clearInterval,
          Buffer: Buffer,
          process: {
            env: {},
            exit: () => {},
            stdout: { write: () => {} },
            stderr: { write: () => {} }
          }
        });

        let output = '';
        let error = '';

        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
          output += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        };
        
        console.error = (...args) => {
          error += args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ') + '\n';
        };

        try {
          // Execute the code with timeout
          const script = new vm.Script(code);
          const result = script.runInContext(context, { timeout: this.executionTimeout });
          
          // Restore console functions
          console.log = originalLog;
          console.error = originalError;

          if (result !== undefined) {
            output += typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
          }

          resolve({
            success: true,
            output: output.trim(),
            error: error.trim(),
            executionTime: Date.now(),
            language: 'javascript'
          });
        } catch (execError) {
          // Restore console functions
          console.log = originalLog;
          console.error = originalError;
          
          reject({
            success: false,
            error: execError.message,
            output: output.trim(),
            executionTime: Date.now(),
            language: 'javascript'
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: error.message,
          output: '',
          executionTime: Date.now(),
          language: 'javascript'
        });
      }
    });
  }

  async executePython(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.py`);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [filePath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: this.executionTimeout
        });

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              output: output.trim(),
              error: error.trim(),
              executionTime: Date.now(),
              language: 'python'
            });
          } else {
            reject({
              success: false,
              error: error.trim() || `Process exited with code ${code}`,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'python'
            });
          }
        });

        pythonProcess.on('error', (err) => {
          reject({
            success: false,
            error: err.message,
            output: output.trim(),
            executionTime: Date.now(),
            language: 'python'
          });
        });

        // Send input if provided
        if (input) {
          pythonProcess.stdin.write(input);
          pythonProcess.stdin.end();
        }
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'python'
      };
    }
  }

  async executeJava(code, input, executionId) {
    const className = 'Main';
    const filePath = path.join(this.tempDir, `${className}.java`);
    
    try {
      // Wrap code in a class if it's not already
      const wrappedCode = code.includes('public class') ? code : 
        `public class ${className} {\n    public static void main(String[] args) {\n        ${code}\n    }\n}`;
      
      await fs.writeFile(filePath, wrappedCode);
      
      return new Promise((resolve, reject) => {
        // Compile Java code
        const compileProcess = spawn('javac', [filePath], {
          cwd: this.tempDir,
          timeout: this.executionTimeout
        });

        let compileError = '';

        compileProcess.stderr.on('data', (data) => {
          compileError += data.toString();
        });

        compileProcess.on('close', (code) => {
          if (code !== 0) {
            reject({
              success: false,
              error: compileError.trim(),
              output: '',
              executionTime: Date.now(),
              language: 'java'
            });
            return;
          }

          // Execute compiled Java code
          const javaProcess = spawn('java', [className], {
            cwd: this.tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: this.executionTimeout
          });

          let output = '';
          let error = '';

          javaProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          javaProcess.stderr.on('data', (data) => {
            error += data.toString();
          });

          javaProcess.on('close', (code) => {
            if (code === 0) {
              resolve({
                success: true,
                output: output.trim(),
                error: error.trim(),
                executionTime: Date.now(),
                language: 'java'
              });
            } else {
              reject({
                success: false,
                error: error.trim() || `Process exited with code ${code}`,
                output: output.trim(),
                executionTime: Date.now(),
                language: 'java'
              });
            }
          });

          javaProcess.on('error', (err) => {
            reject({
              success: false,
              error: err.message,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'java'
            });
          });

          // Send input if provided
          if (input) {
            javaProcess.stdin.write(input);
            javaProcess.stdin.end();
          }
        });
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'java'
      };
    }
  }

  async executeCpp(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.cpp`);
    const outputPath = path.join(this.tempDir, executionId);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        // Compile C++ code
        const compileProcess = spawn('g++', [filePath, '-o', outputPath], {
          cwd: this.tempDir,
          timeout: this.executionTimeout
        });

        let compileError = '';

        compileProcess.stderr.on('data', (data) => {
          compileError += data.toString();
        });

        compileProcess.on('close', (code) => {
          if (code !== 0) {
            reject({
              success: false,
              error: compileError.trim(),
              output: '',
              executionTime: Date.now(),
              language: 'cpp'
            });
            return;
          }

          // Execute compiled C++ code
          const cppProcess = spawn(outputPath, [], {
            cwd: this.tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: this.executionTimeout
          });

          let output = '';
          let error = '';

          cppProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          cppProcess.stderr.on('data', (data) => {
            error += data.toString();
          });

          cppProcess.on('close', (code) => {
            if (code === 0) {
              resolve({
                success: true,
                output: output.trim(),
                error: error.trim(),
                executionTime: Date.now(),
                language: 'cpp'
              });
            } else {
              reject({
                success: false,
                error: error.trim() || `Process exited with code ${code}`,
                output: output.trim(),
                executionTime: Date.now(),
                language: 'cpp'
              });
            }
          });

          cppProcess.on('error', (err) => {
            reject({
              success: false,
              error: err.message,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'cpp'
            });
          });

          // Send input if provided
          if (input) {
            cppProcess.stdin.write(input);
            cppProcess.stdin.end();
          }
        });
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'cpp'
      };
    }
  }

  async executeC(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.c`);
    const outputPath = path.join(this.tempDir, executionId);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        // Compile C code
        const compileProcess = spawn('gcc', [filePath, '-o', outputPath], {
          cwd: this.tempDir,
          timeout: this.executionTimeout
        });

        let compileError = '';

        compileProcess.stderr.on('data', (data) => {
          compileError += data.toString();
        });

        compileProcess.on('close', (code) => {
          if (code !== 0) {
            reject({
              success: false,
              error: compileError.trim(),
              output: '',
              executionTime: Date.now(),
              language: 'c'
            });
            return;
          }

          // Execute compiled C code
          const cProcess = spawn(outputPath, [], {
            cwd: this.tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: this.executionTimeout
          });

          let output = '';
          let error = '';

          cProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          cProcess.stderr.on('data', (data) => {
            error += data.toString();
          });

          cProcess.on('close', (code) => {
            if (code === 0) {
              resolve({
                success: true,
                output: output.trim(),
                error: error.trim(),
                executionTime: Date.now(),
                language: 'c'
              });
            } else {
              reject({
                success: false,
                error: error.trim() || `Process exited with code ${code}`,
                output: output.trim(),
                executionTime: Date.now(),
                language: 'c'
              });
            }
          });

          cProcess.on('error', (err) => {
            reject({
              success: false,
              error: err.message,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'c'
            });
          });

          // Send input if provided
          if (input) {
            cProcess.stdin.write(input);
            cProcess.stdin.end();
          }
        });
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'c'
      };
    }
  }

  async executePHP(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.php`);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        const phpProcess = spawn('php', [filePath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: this.executionTimeout
        });

        let output = '';
        let error = '';

        phpProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        phpProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        phpProcess.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              output: output.trim(),
              error: error.trim(),
              executionTime: Date.now(),
              language: 'php'
            });
          } else {
            reject({
              success: false,
              error: error.trim() || `Process exited with code ${code}`,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'php'
            });
          }
        });

        phpProcess.on('error', (err) => {
          reject({
            success: false,
            error: err.message,
            output: output.trim(),
            executionTime: Date.now(),
            language: 'php'
          });
        });

        // Send input if provided
        if (input) {
          phpProcess.stdin.write(input);
          phpProcess.stdin.end();
        }
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'php'
      };
    }
  }

  async executeRuby(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.rb`);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        const rubyProcess = spawn('ruby', [filePath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: this.executionTimeout
        });

        let output = '';
        let error = '';

        rubyProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        rubyProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        rubyProcess.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              output: output.trim(),
              error: error.trim(),
              executionTime: Date.now(),
              language: 'ruby'
            });
          } else {
            reject({
              success: false,
              error: error.trim() || `Process exited with code ${code}`,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'ruby'
            });
          }
        });

        rubyProcess.on('error', (err) => {
          reject({
            success: false,
            error: err.message,
            output: output.trim(),
            executionTime: Date.now(),
            language: 'ruby'
          });
        });

        // Send input if provided
        if (input) {
          rubyProcess.stdin.write(input);
          rubyProcess.stdin.end();
        }
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'ruby'
      };
    }
  }

  async executeGo(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.go`);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        const goProcess = spawn('go', ['run', filePath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: this.executionTimeout
        });

        let output = '';
        let error = '';

        goProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        goProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        goProcess.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              output: output.trim(),
              error: error.trim(),
              executionTime: Date.now(),
              language: 'go'
            });
          } else {
            reject({
              success: false,
              error: error.trim() || `Process exited with code ${code}`,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'go'
            });
          }
        });

        goProcess.on('error', (err) => {
          reject({
            success: false,
            error: err.message,
            output: output.trim(),
            executionTime: Date.now(),
            language: 'go'
          });
        });

        // Send input if provided
        if (input) {
          goProcess.stdin.write(input);
          goProcess.stdin.end();
        }
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'go'
      };
    }
  }

  async executeRust(code, input, executionId) {
    const filePath = path.join(this.tempDir, `${executionId}.rs`);
    
    try {
      await fs.writeFile(filePath, code);
      
      return new Promise((resolve, reject) => {
        const rustProcess = spawn('rustc', [filePath, '-o', path.join(this.tempDir, executionId)], {
          cwd: this.tempDir,
          timeout: this.executionTimeout
        });

        let compileError = '';

        rustProcess.stderr.on('data', (data) => {
          compileError += data.toString();
        });

        rustProcess.on('close', (code) => {
          if (code !== 0) {
            reject({
              success: false,
              error: compileError.trim(),
              output: '',
              executionTime: Date.now(),
              language: 'rust'
            });
            return;
          }

          // Execute compiled Rust code
          const executableProcess = spawn(path.join(this.tempDir, executionId), [], {
            cwd: this.tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: this.executionTimeout
          });

          let output = '';
          let error = '';

          executableProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          executableProcess.stderr.on('data', (data) => {
            error += data.toString();
          });

          executableProcess.on('close', (code) => {
            if (code === 0) {
              resolve({
                success: true,
                output: output.trim(),
                error: error.trim(),
                executionTime: Date.now(),
                language: 'rust'
              });
            } else {
              reject({
                success: false,
                error: error.trim() || `Process exited with code ${code}`,
                output: output.trim(),
                executionTime: Date.now(),
                language: 'rust'
              });
            }
          });

          executableProcess.on('error', (err) => {
            reject({
              success: false,
              error: err.message,
              output: output.trim(),
              executionTime: Date.now(),
              language: 'rust'
            });
          });

          // Send input if provided
          if (input) {
            executableProcess.stdin.write(input);
            executableProcess.stdin.end();
          }
        });
      });
    } catch (error) {
      throw {
        success: false,
        error: error.message,
        output: '',
        executionTime: Date.now(),
        language: 'rust'
      };
    }
  }

  getSupportedLanguages() {
    return [
      { id: 'javascript', name: 'JavaScript', extension: '.js' },
      { id: 'python', name: 'Python', extension: '.py' },
      { id: 'java', name: 'Java', extension: '.java' },
      { id: 'cpp', name: 'C++', extension: '.cpp' },
      { id: 'c', name: 'C', extension: '.c' },
      { id: 'php', name: 'PHP', extension: '.php' },
      { id: 'ruby', name: 'Ruby', extension: '.rb' },
      { id: 'go', name: 'Go', extension: '.go' },
      { id: 'rust', name: 'Rust', extension: '.rs' }
    ];
  }
}

module.exports = new CodeExecutionService();
