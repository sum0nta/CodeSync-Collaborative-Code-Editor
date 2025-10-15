const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Use Gemini AI service for production (free API)
// Falls back to Ollama for local development
const useGemini = process.env.GOOGLE_AI_API_KEY ? true : false;
if (useGemini) {
  console.log('✅ Using Google AI Studio (Gemini) for AI features');
} else {
  console.log('ℹ️  No GOOGLE_AI_API_KEY found. AI features will use Ollama (local only)');
}
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
