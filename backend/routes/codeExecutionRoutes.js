const express = require('express');
const router = express.Router();
const { executeCode, getSupportedLanguages, getExecutionStatus } = require('../controllers/codeExecutionController');
const { authenticateToken } = require('../helper/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Execute code
router.post('/execute', executeCode);

// Get supported programming languages
router.get('/languages', getSupportedLanguages);

// Get execution service status
router.get('/status', getExecutionStatus);

module.exports = router;
