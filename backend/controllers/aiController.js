const aiService = require('../services/aiService');

// Generate code based on user prompt
const generateCode = async (req, res) => {
  try {
    const { prompt, language, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

    const code = await aiService.generateCode(
      prompt, 
      language || 'javascript', 
      context || ''
    );

    res.json({
      success: true,
      data: {
        code,
        language: language || 'javascript',
        prompt
      }
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate code'
    });
  }
};

// Analyze code for errors and improvements
const analyzeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code is required' 
      });
    }

    const analysis = await aiService.analyzeCode(
      code, 
      language || 'javascript'
    );

    res.json({
      success: true,
      data: {
        analysis,
        language: language || 'javascript'
      }
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze code'
    });
  }
};

// Explain code functionality
const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code is required' 
      });
    }

    const explanation = await aiService.explainCode(
      code, 
      language || 'javascript'
    );

    res.json({
      success: true,
      data: {
        explanation,
        language: language || 'javascript'
      }
    });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to explain code'
    });
  }
};

// Chat with AI assistant
const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    const response = await aiService.chatWithAI(
      message, 
      conversationHistory || []
    );

    res.json({
      success: true,
      data: {
        response,
        message
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI response'
    });
  }
};

// Get available AI providers
const getProviders = async (req, res) => {
  try {
    const providers = aiService.getAvailableProviders();
    const isAvailable = await aiService.isAvailable();
    
    res.json({
      success: true,
      data: {
        providers,
        default: providers.length > 0 ? providers[0] : null,
        isAvailable
      }
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get providers'
    });
  }
};

// Fix code errors
const fixCode = async (req, res) => {
  try {
    const { code, language, errorDescription } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code is required' 
      });
    }

    const fixedCode = await aiService.fixCode(
      code, 
      language || 'javascript',
      errorDescription || ''
    );

    res.json({
      success: true,
      data: {
        fixedCode,
        language: language || 'javascript'
      }
    });
  } catch (error) {
    console.error('Code fixing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fix code'
    });
  }
};

// Optimize code
const optimizeCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code is required' 
      });
    }

    const optimizedCode = await aiService.optimizeCode(
      code, 
      language || 'javascript'
    );

    res.json({
      success: true,
      data: {
        optimizedCode,
        language: language || 'javascript'
      }
    });
  } catch (error) {
    console.error('Code optimization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to optimize code'
    });
  }
};

// Generate tests for code
const generateTests = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code is required' 
      });
    }

    const tests = await aiService.generateTests(
      code, 
      language || 'javascript'
    );

    res.json({
      success: true,
      data: {
        tests,
        language: language || 'javascript'
      }
    });
  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate tests'
    });
  }
};

// Get available models
const getModels = async (req, res) => {
  try {
    const models = await aiService.getAvailableModels();
    
    res.json({
      success: true,
      data: {
        models,
        currentModel: aiService.model
      }
    });
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get models'
    });
  }
};

// Change model
const changeModel = async (req, res) => {
  try {
    const { modelName } = req.body;
    
    if (!modelName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Model name is required' 
      });
    }

    await aiService.changeModel(modelName);

    res.json({
      success: true,
      data: {
        message: `Model changed to ${modelName}`,
        currentModel: modelName
      }
    });
  } catch (error) {
    console.error('Change model error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change model'
    });
  }
};

module.exports = {
  generateCode,
  analyzeCode,
  explainCode,
  chatWithAI,
  getProviders,
  getModels,
  changeModel,
  fixCode,
  optimizeCode,
  generateTests
};
