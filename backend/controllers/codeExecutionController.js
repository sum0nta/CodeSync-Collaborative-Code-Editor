const codeExecutionService = require('../services/codeExecutionService');

const executeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    // Validate code length
    if (code.length > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Code is too long. Maximum 10,000 characters allowed.'
      });
    }

    // Validate input length
    if (input && input.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Input is too long. Maximum 1,000 characters allowed.'
      });
    }

    // Execute the code
    const result = await codeExecutionService.executeCode(code, language, input || '');

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Code execution error:', error);
    
    // If it's a known execution error, return it
    if (error.success !== undefined) {
      return res.json({
        success: true,
        data: error
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error during code execution'
    });
  }
};

const getSupportedLanguages = async (req, res) => {
  try {
    const languages = codeExecutionService.getSupportedLanguages();
    
    res.json({
      success: true,
      data: languages
    });
  } catch (error) {
    console.error('Error getting supported languages:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getExecutionStatus = async (req, res) => {
  try {
    // This endpoint can be used to check if the code execution service is available
    // and what languages are supported
    const languages = codeExecutionService.getSupportedLanguages();
    
    res.json({
      success: true,
      data: {
        status: 'available',
        supportedLanguages: languages.length,
        languages: languages.map(lang => lang.id)
      }
    });
  } catch (error) {
    console.error('Error getting execution status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  executeCode,
  getSupportedLanguages,
  getExecutionStatus
};
