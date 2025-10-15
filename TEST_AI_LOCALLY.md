# 🧪 Test AI Features Locally

## Quick Local Testing Guide

### Step 1: Get Google AI API Key (2 min)

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

### Step 2: Add to Backend Environment (30 sec)

Create or update `backend/.env`:

```bash
# backend/.env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/codesync
JWT_SECRET=your-local-secret-key-for-testing
GOOGLE_AI_API_KEY=AIza...paste-your-key-here
```

### Step 3: Start Backend (1 min)

```bash
cd backend
npm install  # if not already done
npm start
```

**Look for this in the console:**
```
✅ Google AI Studio (Gemini) initialized successfully
   Model: gemini-1.5-flash
Server running on port 5001
```

If you see this, Gemini is working! ✅

### Step 4: Test AI Endpoint (1 min)

Open a new terminal and test the AI:

#### Simple Test (No Auth):
First, let's create a quick test script.

Create `backend/test-ai.js`:
```javascript
const aiService = require('./services/aiService.gemini');

async function testAI() {
  console.log('🧪 Testing Google Gemini AI...\n');
  
  try {
    // Test 1: Simple chat
    console.log('Test 1: AI Chat');
    const chatResponse = await aiService.chatWithAI('Say hello!');
    console.log('✅ Response:', chatResponse.substring(0, 100) + '...\n');
    
    // Test 2: Code generation
    console.log('Test 2: Code Generation');
    const code = await aiService.generateCode('Create a hello world function', 'javascript');
    console.log('✅ Response:', code.substring(0, 150) + '...\n');
    
    // Test 3: Code explanation
    console.log('Test 3: Code Explanation');
    const explanation = await aiService.explainCode('const x = [1,2,3].map(n => n * 2);', 'javascript');
    console.log('✅ Response:', explanation.substring(0, 150) + '...\n');
    
    console.log('🎉 All tests passed! Gemini is working perfectly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAI();
```

Run it:
```bash
cd backend
node test-ai.js
```

### Expected Output:
```
🧪 Testing Google Gemini AI...

Test 1: AI Chat
✅ Response: Hello! I'm ready to help you with your coding questions. How can I assist you today?...

Test 2: Code Generation
✅ Response: function helloWorld() {
  console.log("Hello, World!");
}...

Test 3: Code Explanation
✅ Response: This code uses the map() method to create a new array. It takes each element (n) from the original array...

🎉 All tests passed! Gemini is working perfectly!
```

### Step 5: Test with Full App (Optional)

If you want to test with the full app:

1. **Start Backend:**
```bash
cd backend
npm start
```

2. **Start Frontend (new terminal):**
```bash
cd frontend
npm install  # if not already done
npm start
```

3. **Create Account & Test:**
   - Open http://localhost:3000
   - Register a new account
   - Login
   - Look for AI assistant panel
   - Try asking it to generate code!

---

## 🐛 Troubleshooting

### Issue: "AI service not configured"
**Solution:** Check that `GOOGLE_AI_API_KEY` is in `backend/.env`

### Issue: "Invalid API key"
**Solutions:**
- Regenerate key at https://aistudio.google.com/app/apikey
- Make sure you copied the full key (starts with `AIza...`)
- No extra spaces in the `.env` file

### Issue: "Rate limit exceeded"
**Solution:** Wait 1 minute. Free tier is 60 requests/minute.

### Issue: Backend still loads Ollama
**Solutions:**
- Make sure env variable is named exactly: `GOOGLE_AI_API_KEY`
- Restart the backend server
- Check for typos in `.env` file

---

## ✅ Success Checklist

After testing, you should have:
- [x] Google AI API key obtained
- [x] Key added to `backend/.env`
- [x] Backend starts with "✅ Google AI Studio initialized"
- [x] Test script runs successfully
- [x] AI generates code responses

---

## 📝 Next Steps

Once local testing works:
1. Deploy backend to Render (following QUICK_DEPLOY.md)
2. Add same `GOOGLE_AI_API_KEY` to Render environment
3. Deploy frontend to Vercel
4. Your AI features work in production! 🚀

---

## 💡 Quick Tips

### Check Current AI Provider:
Look at backend console on startup:
- `✅ Using Google AI Studio (Gemini)` = Gemini is active
- `ℹ️  Using Ollama (local)` = Ollama is active (need API key)

### Test Different Features:
```javascript
// In test-ai.js, try different methods:
await aiService.generateCode(prompt, language);
await aiService.analyzeCode(code, language);
await aiService.explainCode(code, language);
await aiService.fixCode(code, language);
await aiService.optimizeCode(code, language);
await aiService.generateTests(code, language);
await aiService.chatWithAI(message);
```

### Monitor Usage:
- Check usage at: https://aistudio.google.com/
- Free tier: 1,500 requests/day
- More than enough for testing!

---

## 🎉 You're Ready!

Once the test script passes, you're ready to deploy with confidence!

