// Quick script to list available Gemini models for your API key
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.GOOGLE_AI_API_KEY;

async function listModels() {
  console.log('\n🔍 Checking available Gemini models for your API key...\n');
  
  try {
    // Try to list models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await axios.get(url);
    
    console.log('✅ Available models:\n');
    
    if (response.data.models && response.data.models.length > 0) {
      response.data.models.forEach(model => {
        console.log(`📦 ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      });
      
      // Find a model that supports generateContent
      const compatibleModel = response.data.models.find(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (compatibleModel) {
        console.log('\n✅ RECOMMENDED MODEL TO USE:');
        console.log(`   ${compatibleModel.name}`);
        console.log('\n📝 Update your code to use this model name.\n');
      }
    } else {
      console.log('⚠️  No models found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.log('\nYour API key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
  }
}

listModels();

