import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Download, Upload, Settings, Terminal, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './CodeExecution.css';

// Language detection utility
const detectLanguageFromFileName = (fileName) => {
  if (!fileName) return 'javascript';
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap = {
    // JavaScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'javascript', // TypeScript - we'll execute as JS for now
    'tsx': 'javascript',
    'mjs': 'javascript',
    
    // Python
    'py': 'python',
    'pyw': 'python',
    'pyx': 'python',
    
    // Java
    'java': 'java',
    
    // C++
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'c++': 'cpp',
    
    // C
    'c': 'c',
    
    // PHP
    'php': 'php',
    'phtml': 'php',
    
    // Ruby
    'rb': 'ruby',
    'erb': 'ruby',
    
    // Go
    'go': 'go',
    
    // Rust
    'rs': 'rust'
  };
  
  return languageMap[extension] || 'javascript';
};

const CodeExecution = ({ 
  isVisible, 
  onClose, 
  currentCode, 
  currentLanguage,
  onLanguageChange 
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [autoExecute, setAutoExecute] = useState(false);
  const [executionTimeout, setExecutionTimeout] = useState(10);
  const [currentFileName, setCurrentFileName] = useState('');
  const outputRef = useRef(null);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' // Use relative URLs in production (Vercel) so API proxy can handle routing
    : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001');

  // Enhanced language detection and setup
  useEffect(() => {
    if (isVisible) {
      fetchSupportedLanguages();
      
      // Detect language from current file
      const detectedLanguage = detectLanguageFromFileName(currentLanguage);
      setSelectedLanguage(detectedLanguage);
      setCurrentFileName(currentLanguage || 'untitled');
      
      // Notify parent component about language change
      if (onLanguageChange && detectedLanguage !== currentLanguage) {
        onLanguageChange(detectedLanguage);
      }
    }
  }, [isVisible, currentLanguage]);

  // Update selected language when currentLanguage prop changes
  useEffect(() => {
    if (currentLanguage && currentLanguage !== selectedLanguage) {
      const detectedLanguage = detectLanguageFromFileName(currentLanguage);
      setSelectedLanguage(detectedLanguage);
      setCurrentFileName(currentLanguage);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionResult]);

  const fetchSupportedLanguages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/execution/languages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSupportedLanguages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      toast.error('Failed to load supported languages');
    }
  };

  const executeCode = async () => {
    if (!currentCode || !currentCode.trim()) {
      toast.error('No code to execute');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/execution/execute`, {
        code: currentCode,
        language: selectedLanguage,
        input: input
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: (executionTimeout + 5) * 1000 // Add 5 seconds buffer
      });

      if (response.data.success) {
        const result = response.data.data;
        setExecutionResult(result);
        
        // Add to execution history
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          language: selectedLanguage,
          success: result.success,
          output: result.output,
          error: result.error,
          executionTime: result.executionTime
        };
        
        setExecutionHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 executions
        
        if (result.success) {
          toast.success('Code executed successfully');
        } else {
          toast.error('Code execution failed');
        }
      }
    } catch (error) {
      console.error('Code execution error:', error);
      
      let errorMessage = 'Code execution failed';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Execution timed out';
      }
      
      setExecutionResult({
        success: false,
        error: errorMessage,
        output: '',
        executionTime: Date.now(),
        language: selectedLanguage
      });
      
      toast.error(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  const stopExecution = () => {
    setIsExecuting(false);
    toast('Execution stopped');
  };

  const clearOutput = () => {
    setExecutionResult(null);
    setExecutionHistory([]);
  };

  const downloadOutput = () => {
    if (!executionResult) return;

    const content = `Code Execution Result
Language: ${selectedLanguage}
File: ${currentFileName}
Timestamp: ${new Date().toLocaleString()}
Success: ${executionResult.success}

${executionResult.output ? `Output:\n${executionResult.output}\n` : ''}
${executionResult.error ? `Error:\n${executionResult.error}` : ''}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const formatOutput = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <div key={index} className="output-line">
        {line}
      </div>
    ));
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '⚡',
      python: '🐍',
      java: '☕',
      cpp: '⚙️',
      c: '🔧',
      php: '🐘',
      ruby: '💎',
      go: '🚀',
      rust: '🦀'
    };
    return icons[language] || '📄';
  };

  if (!isVisible) return null;

  return (
    <div className="code-execution-panel">
      <div className="code-execution-header">
        <div className="header-left">
          <Terminal className="header-icon" />
          <h3>Code Execution</h3>
          {currentFileName && (
            <span className="current-file">({currentFileName})</span>
          )}
        </div>
        <div className="header-right">
          <button
            className="icon-button"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            className="icon-button"
            onClick={onClose}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="code-execution-content">
        {/* Language Selection */}
        <div className="language-selector">
          <label>Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isExecuting}
          >
            {supportedLanguages.map(lang => (
              <option key={lang.id} value={lang.id}>
                {getLanguageIcon(lang.id)} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={autoExecute}
                  onChange={(e) => setAutoExecute(e.target.checked)}
                />
                Auto-execute on save
              </label>
            </div>
            <div className="setting-item">
              <label>Execution Timeout (seconds):</label>
              <input
                type="number"
                min="1"
                max="60"
                value={executionTimeout}
                onChange={(e) => setExecutionTimeout(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="input-section">
          <label>Input (optional):</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your program..."
            disabled={isExecuting}
            rows={3}
          />
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          <button
            className={`execute-button ${isExecuting ? 'executing' : ''}`}
            onClick={executeCode}
            disabled={isExecuting || !currentCode?.trim()}
          >
            {isExecuting ? (
              <>
                <div className="spinner"></div>
                Executing...
              </>
            ) : (
              <>
                <Play size={16} />
                Execute
              </>
            )}
          </button>
          
          <button
            className="stop-button"
            onClick={stopExecution}
            disabled={!isExecuting}
          >
            <Square size={16} />
            Stop
          </button>
          
          <button
            className="clear-button"
            onClick={clearOutput}
            disabled={!executionResult && executionHistory.length === 0}
          >
            <RotateCcw size={16} />
            Clear
          </button>
          
          <button
            className="download-button"
            onClick={downloadOutput}
            disabled={!executionResult}
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {/* Output Section */}
        <div className="output-section">
          <div className="output-header">
            <h4>Output</h4>
            {executionResult && (
              <span className={`status ${executionResult.success ? 'success' : 'error'}`}>
                {executionResult.success ? '✓ Success' : '✗ Error'}
              </span>
            )}
          </div>
          
          <div className="output-content" ref={outputRef}>
            {executionResult ? (
              <div className="execution-result">
                {executionResult.output && (
                  <div className="output-block">
                    <div className="output-label">Output:</div>
                    <div className="output-text">
                      {formatOutput(executionResult.output)}
                    </div>
                  </div>
                )}
                
                {executionResult.error && (
                  <div className="output-block error">
                    <div className="output-label">Error:</div>
                    <div className="output-text error">
                      {formatOutput(executionResult.error)}
                    </div>
                  </div>
                )}
                
                <div className="execution-meta">
                  <span>Language: {executionResult.language}</span>
                  <span>File: {currentFileName}</span>
                  <span>Time: {new Date(executionResult.executionTime).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className="no-output">
                <Terminal size={48} />
                <p>No output yet. Execute your code to see results.</p>
                {currentFileName && (
                  <p className="file-info">Current file: {currentFileName}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Execution History */}
        {executionHistory.length > 0 && (
          <div className="history-section">
            <h4>Recent Executions</h4>
            <div className="history-list">
              {executionHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-meta">
                    <span className={`status ${item.success ? 'success' : 'error'}`}>
                      {item.success ? '✓' : '✗'}
                    </span>
                    <span className="language">{item.language}</span>
                    <span className="time">{item.timestamp}</span>
                  </div>
                  <div className="history-preview">
                    {item.output ? item.output.substring(0, 50) + '...' : 'No output'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExecution;
