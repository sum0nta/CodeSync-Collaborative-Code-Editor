/**
 * Quick AI Testing Script
 * 
 * This tests the Google Gemini AI integration locally
 * 
 * Usage:
 *   1. Get API key from https://aistudio.google.com/app/apikey
 *   2. Add to backend/.env: GOOGLE_AI_API_KEY=your-key
 *   3. Run: node test-ai.js
 */

require('dotenv').config();

// Check if API key is set
if (!process.env.GOOGLE_AI_API_KEY) {
  console.error('\n❌ ERROR: GOOGLE_AI_API_KEY not found in environment variables!\n');
  console.log('Steps to fix:');
  console.log('1. Get API key from: https://aistudio.google.com/app/apikey');
  console.log('2. Create backend/.env file (if not exists)');
  console.log('3. Add this line: GOOGLE_AI_API_KEY=your-key-here');
  console.log('4. Run this script again\n');
  process.exit(1);
}

const aiService = require('./services/aiService.gemini');

async function testAI() {
  console.log('\n🧪 Testing Google Gemini AI Integration...\n');
  console.log('═══════════════════════════════════════════════════\n');
  
  try {
    // Test 1: Simple chat
    console.log('📝 Test 1: AI Chat');
    console.log('   Prompt: "Say hello and introduce yourself briefly"');
    const chatResponse = await aiService.chatWithAI('Say hello and introduce yourself briefly as a coding assistant');
    console.log('   ✅ Response:', chatResponse.substring(0, 200) + (chatResponse.length > 200 ? '...' : ''));
    console.log('');
    
    // Test 2: Code generation
    console.log('💻 Test 2: Code Generation');
    console.log('   Prompt: "Create a simple hello world function in JavaScript"');
    const code = await aiService.generateCode(
      'Create a simple hello world function that prints to console',
      'javascript'
    );
    console.log('   ✅ Generated Code:\n');
    console.log('   ' + code.split('\n').slice(0, 10).join('\n   '));
    if (code.split('\n').length > 10) console.log('   ...');
    console.log('');
    
    // Test 3: Code explanation
    console.log('📖 Test 3: Code Explanation');
    const sampleCode = 'const result = [1, 2, 3, 4, 5].filter(n => n % 2 === 0).map(n => n * 2);';
    console.log('   Code:', sampleCode);
    const explanation = await aiService.explainCode(sampleCode, 'javascript');
    console.log('   ✅ Explanation:', explanation.substring(0, 200) + (explanation.length > 200 ? '...' : ''));
    console.log('');
    
    // Test 4: Check model info
    console.log('ℹ️  Test 4: Model Information');
    const modelInfo = aiService.getModelInfo();
    console.log('   Provider:', modelInfo.provider);
    console.log('   Model:', modelInfo.model);
    console.log('   Configured:', modelInfo.isConfigured ? '✅ Yes' : '❌ No');
    console.log('   Free Tier:');
    console.log('     - Requests/min:', modelInfo.freeTier.requestsPerMinute);
    console.log('     - Requests/day:', modelInfo.freeTier.requestsPerDay);
    console.log('     - Context:', modelInfo.freeTier.contextWindow);
    console.log('');
    
    // Success summary
    console.log('═══════════════════════════════════════════════════\n');
    console.log('🎉 SUCCESS! All tests passed!\n');
    console.log('✅ Google Gemini is working perfectly');
    console.log('✅ Your AI features are ready for deployment');
    console.log('✅ You can now add this API key to Render environment\n');
    console.log('Next steps:');
    console.log('1. Deploy to Render (see QUICK_DEPLOY.md)');
    console.log('2. Add GOOGLE_AI_API_KEY to Render environment');
    console.log('3. Your AI features will work in production!\n');
    
  } catch (error) {
    console.log('═══════════════════════════════════════════════════\n');
    console.error('❌ ERROR:', error.message, '\n');
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Fix: Your API key might be invalid');
      console.log('   1. Go to: https://aistudio.google.com/app/apikey');
      console.log('   2. Create a new API key');
      console.log('   3. Update backend/.env with new key\n');
    } else if (error.message.includes('Rate limit')) {
      console.log('💡 Fix: Rate limit exceeded');
      console.log('   1. Wait 1 minute');
      console.log('   2. Try again\n');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      console.log('💡 Fix: Network connection issue');
      console.log('   1. Check your internet connection');
      console.log('   2. Try again\n');
    } else {
      console.log('💡 Debug info:');
      console.log('   Full error:', error);
      console.log('');
    }
    
    process.exit(1);
  }
}

// Run the tests
console.log('Starting AI tests...');
testAI();

