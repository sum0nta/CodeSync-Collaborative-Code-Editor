import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Bot, 
  Send, 
  Code, 
  Search, 
  BookOpen, 
  Wrench, 
  Zap, 
  TestTube,
  X,
  Copy,
  Check,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const AIAssistant = ({ isOpen, onClose, currentFile, onCodeInsert }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('codellama:7b');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Helper function to handle Ollama errors
  const handleOllamaError = (errorMessage) => {
    if (errorMessage.includes('Model') && errorMessage.includes('not found')) {
      return '🤖 Model not found! Please install the required model or select an available one.';
    }
    if (errorMessage.includes('connection failed')) {
      return '🤖 Ollama connection failed! Make sure Ollama is running locally. Install from: https://ollama.ai/';
    }
    return `Error: ${errorMessage}`;
  };

  useEffect(() => {
    if (isOpen) {
      checkAvailability();
      loadAvailableModels();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/providers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAvailable(data.data.isAvailable);
        
        if (!data.data.isAvailable) {
          addMessage('⚠️ Ollama is not available. Please check your Ollama installation.', false);
        }
      }
    } catch (error) {
      console.error('Error checking AI availability:', error);
      setIsAvailable(false);
    }
  };

  const loadAvailableModels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.data.models || []);
        setCurrentModel(data.data.currentModel || 'codellama:7b');
      }
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const changeModel = async (modelName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/change-model`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ modelName })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentModel(modelName);
        toast.success(`Model changed to ${modelName}`);
        addMessage(`🤖 Switched to ${modelName} model`, false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error changing model:', error);
      toast.error('Failed to change model');
    }
  };

  const addMessage = (content, isUser = false, type = 'text') => {
    const newMessage = {
      id: Date.now(),
      content,
      isUser,
      type,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (isUser) {
      setConversationHistory(prev => [...prev, { role: 'user', content }]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isAvailable) return;

    const message = inputMessage.trim();
    setInputMessage('');
    addMessage(message, true);

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.response, false);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: data.data.response }]);
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async () => {
    if (!inputMessage.trim() || isLoading || !isAvailable) return;

    const prompt = inputMessage.trim();
    setInputMessage('');
    addMessage(`Generate code: ${prompt}`, true);

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          language: currentFile?.name?.split('.').pop() || 'javascript',
          context: currentFile?.content || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.code, false, 'code');
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error generating code:', error);
      addMessage('Sorry, I encountered an error while generating code.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!currentFile?.content || isLoading || !isAvailable) {
      toast.error('No code to analyze. Please open a file first.');
      return;
    }

    addMessage('Analyzing current code...', true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currentFile.content,
          language: currentFile.name?.split('.').pop() || 'javascript'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.data.analysis;
        
        let analysisText = '';
        if (analysis.errors && analysis.errors.length > 0) {
          analysisText += '**Errors:**\n';
          analysis.errors.forEach(error => {
            analysisText += `- Line ${error.line}: ${error.message} (${error.severity})\n`;
          });
        }
        
        if (analysis.suggestions && analysis.suggestions.length > 0) {
          analysisText += '\n**Suggestions:**\n';
          analysis.suggestions.forEach(suggestion => {
            analysisText += `- Line ${suggestion.line}: ${suggestion.message} (${suggestion.type})\n`;
          });
        }
        
        if (analysis.summary) {
          analysisText += `\n**Summary:** ${analysis.summary}`;
        }
        
        addMessage(analysisText || 'No issues found in the code.', false);
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error analyzing code:', error);
      addMessage('Sorry, I encountered an error while analyzing the code.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const explainCode = async () => {
    if (!currentFile?.content || isLoading || !isAvailable) {
      toast.error('No code to explain. Please open a file first.');
      return;
    }

    addMessage('Explaining current code...', true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/explain`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currentFile.content,
          language: currentFile.name?.split('.').pop() || 'javascript'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.explanation, false);
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error explaining code:', error);
      addMessage('Sorry, I encountered an error while explaining the code.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const fixCode = async () => {
    if (!currentFile?.content || isLoading || !isAvailable) {
      toast.error('No code to fix. Please open a file first.');
      return;
    }

    addMessage('Fixing code issues...', true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/fix`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currentFile.content,
          language: currentFile.name?.split('.').pop() || 'javascript'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.fixedCode, false, 'code');
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error fixing code:', error);
      addMessage('Sorry, I encountered an error while fixing the code.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeCode = async () => {
    if (!currentFile?.content || isLoading || !isAvailable) {
      toast.error('No code to optimize. Please open a file first.');
      return;
    }

    addMessage('Optimizing code...', true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currentFile.content,
          language: currentFile.name?.split('.').pop() || 'javascript'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.optimizedCode, false, 'code');
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error optimizing code:', error);
      addMessage('Sorry, I encountered an error while optimizing the code.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTests = async () => {
    if (!currentFile?.content || isLoading || !isAvailable) {
      toast.error('No code to generate tests for. Please open a file first.');
      return;
    }

    addMessage('Generating tests...', true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/tests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: currentFile.content,
          language: currentFile.name?.split('.').pop() || 'javascript'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.data.tests, false, 'code');
      } else {
        const errorData = await response.json();
        addMessage(handleOllamaError(errorData.message), false);
      }
    } catch (error) {
      console.error('Error generating tests:', error);
      addMessage('Sorry, I encountered an error while generating tests.', false);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy code');
    }
  };

  const insertCode = (code) => {
    if (onCodeInsert) {
      onCodeInsert(code);
      toast.success('Code inserted into editor!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
    toast.success('Conversation cleared');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      width: '400px',
      height: '600px',
      backgroundColor: '#2d2d30',
      border: '1px solid #3e3e42',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>
            🤖 AI Assistant
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0'
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontSize: '10px', color: '#888' }}>
          Powered by Ollama | Model: {currentModel}
        </div>
        
        {/* Model Selector */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
            Available Models:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {availableModels.slice(0, 3).map((model) => (
              <button
                key={model.name}
                onClick={() => changeModel(model.name)}
                style={{
                  padding: '2px 6px',
                  fontSize: '9px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currentModel === model.name ? '#007acc' : '#404040',
                  color: 'white'
                }}
                title={model.name}
              >
                {model.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Conversation Button */}
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={clearConversation}
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#dc2626',
            color: 'white'
          }}
          title="Clear conversation"
        >
          🗑️ Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
            color: '#cccccc',
            height: '100%'
          }}>
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
              <div>AI Assistant Ready</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Ask me anything about coding!
              </div>
              {!isAvailable && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '8px', 
                  backgroundColor: '#dc2626', 
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  ⚠️ Ollama is offline
                </div>
              )}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              padding: '12px',
              backgroundColor: message.isUser ? '#007acc' : '#3e3e42',
              borderRadius: '8px',
              maxWidth: '90%',
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              position: 'relative'
            }}
          >
            <div style={{
              fontSize: '10px',
              color: '#cccccc',
              marginBottom: '4px'
            }}>
              {message.isUser ? 'You' : 'AI Assistant'}
              <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {message.type === 'code' ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: '#1e1e1e',
                    color: '#cccccc',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Code
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      style={{
                        padding: '2px 4px',
                        fontSize: '10px',
                        backgroundColor: '#404040',
                        border: 'none',
                        color: '#cccccc',
                        borderRadius: '2px',
                        cursor: 'pointer'
                      }}
                      title="Copy code"
                    >
                      📋
                    </button>
                    {onCodeInsert && (
                      <button
                        onClick={() => insertCode(message.content)}
                        style={{
                          padding: '2px 4px',
                          fontSize: '10px',
                          backgroundColor: '#007acc',
                          border: 'none',
                          color: 'white',
                          borderRadius: '2px',
                          cursor: 'pointer'
                        }}
                        title="Insert into editor"
                      >
                        ➕
                      </button>
                    )}
                  </div>
                </div>
                <pre style={{
                  fontSize: '10px',
                  overflowX: 'auto',
                  backgroundColor: '#1e1e1e',
                  color: '#cccccc',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #3e3e42',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  <code>{message.content}</code>
                </pre>
              </div>
            ) : (
              <div style={{ 
                color: 'white', 
                wordBreak: 'break-word',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {message.content}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            padding: '12px',
            backgroundColor: '#3e3e42',
            borderRadius: '8px',
            maxWidth: '90%',
            alignSelf: 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#cccccc'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #007acc',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ fontSize: '12px' }}>AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #3e3e42',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isAvailable ? "Ask me anything about coding..." : "Ollama is offline. Check installation."}
          disabled={isLoading || !isAvailable}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: '#1e1e1e',
            border: '1px solid #3e3e42',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading || !isAvailable}
          style={{
            padding: '8px 16px',
            backgroundColor: inputMessage.trim() && !isLoading && isAvailable ? '#007acc' : '#404040',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: inputMessage.trim() && !isLoading && isAvailable ? 'pointer' : 'not-allowed',
            fontSize: '14px'
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
