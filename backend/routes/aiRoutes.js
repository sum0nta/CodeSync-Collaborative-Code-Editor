const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../helper/authMiddleware');

// Apply authentication middleware to all AI routes
router.use(authenticateToken);

// AI Code Generation
router.post('/generate', aiController.generateCode);

// AI Code Analysis
router.post('/analyze', aiController.analyzeCode);

// AI Code Explanation
router.post('/explain', aiController.explainCode);

// AI Chat
router.post('/chat', aiController.chatWithAI);

// Get available AI providers
router.get('/providers', aiController.getProviders);

// Get available models
router.get('/models', aiController.getModels);

// Change model
router.post('/change-model', aiController.changeModel);

// Fix code errors
router.post('/fix', aiController.fixCode);

// Optimize code
router.post('/optimize', aiController.optimizeCode);

// Generate tests
router.post('/tests', aiController.generateTests);

module.exports = router;
