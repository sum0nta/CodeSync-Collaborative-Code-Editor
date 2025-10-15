# 🤖 AI Setup Guide for CodeSync

## Quick Answer: Use Google Gemini (FREE)

**Your project currently uses Ollama, but it won't work on free hosting.**

✅ **Solution**: Switch to Google Gemini (already integrated!)  
⏱️ **Time**: 2 minutes  
💰 **Cost**: FREE forever  

---

## Why Can't I Use Ollama on Render?

| What Ollama Needs | Render Free Tier Has | Result |
|-------------------|---------------------|--------|
| 4-8 GB RAM | ~512 MB | ❌ Not enough |
| 4-7 GB storage | Limited | ❌ Too small |
| Persistent disk | Ephemeral | ❌ Model lost on restart |
| Local inference | Cloud environment | ❌ Won't work |

**Ollama is for local development only!**

---

## ✅ Solution: Google AI Studio (Gemini)

### Why Gemini is Perfect:

1. **FREE Forever**
   - 1,500 requests/day
   - 60 requests/minute
   - 32K token context
   - No credit card needed!

2. **Better Performance**
   - Faster than Ollama
   - Better code generation
   - Always up-to-date models
   - No local resources needed

3. **Already Integrated**
   - Your backend auto-detects the API key
   - No code changes needed
   - Works with existing AI features

---

## 🚀 Setup in 2 Minutes

### Step 1: Get API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

**Example:** `AIzaSyDh3J7kG9fP2L5mN8qR4tU6vX7yZ0aB1cD`

### Step 2: Add to Deployment

**On Render (Production):**
1. Go to your backend service dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   ```
   Key: GOOGLE_AI_API_KEY
   Value: AIza...your-key-here
   ```
5. Click **"Save Changes"** (auto-redeploys)

**Local Development (.env file):**
```bash
# backend/.env
GOOGLE_AI_API_KEY=AIza...your-key-here
```

### Step 3: Test! ✅

**Backend will automatically:**
1. Detect the `GOOGLE_AI_API_KEY`
2. Load Gemini service instead of Ollama
3. Enable all AI features

**Check the logs:**
```
✅ Google AI Studio (Gemini) initialized successfully
   Model: gemini-1.5-flash
```

---

## 🎯 How It Works

### Automatic Provider Selection

Your backend automatically chooses the best AI service:

```javascript
// backend/controllers/aiController.js
if (process.env.GOOGLE_AI_API_KEY) {
  // ✅ Use Gemini (production)
  aiService = require('./services/aiService.gemini');
} else {
  // 🏠 Use Ollama (local only)
  aiService = require('./services/aiService');
}
```

### Features You Get:

1. **Code Generation**
   - Generate code from natural language
   - Supports all languages

2. **Code Analysis**
   - Find bugs and errors
   - Get improvement suggestions
   - Security recommendations

3. **Code Explanation**
   - Understand complex code
   - Step-by-step breakdowns

4. **AI Chat**
   - Ask coding questions
   - Get debugging help

5. **Code Fixing**
   - Automatic error correction
   - Best practices application

6. **Code Optimization**
   - Performance improvements
   - Readability enhancements

7. **Test Generation**
   - Unit tests
   - Edge cases
   - Integration tests

---

## 📊 Gemini Free Tier Limits

| Metric | Free Tier | Enough For |
|--------|-----------|------------|
| Requests/minute | 60 | ✅ Yes |
| Requests/day | 1,500 | ✅ Yes |
| Requests/month | ~45,000 | ✅ More than enough! |
| Context window | 32K tokens | ✅ Plenty |
| Cost | $0 | ✅ FREE! |

**Example Usage:**
- 100 users/day × 10 AI requests each = 1,000 requests/day ✅
- You have room for 500 more requests!

---

## 🔄 Development Workflow

### Local Development
```bash
# Option 1: Use Gemini (recommended)
GOOGLE_AI_API_KEY=your-key npm start

# Option 2: Use Ollama (if installed)
# Just don't set GOOGLE_AI_API_KEY
npm start
```

### Production (Render)
```bash
# Automatically uses Gemini
# (Set GOOGLE_AI_API_KEY in Render dashboard)
```

---

## 🧪 Testing AI Features

### Test Code Generation:

```bash
curl -X POST https://your-backend.onrender.com/api/ai/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a React component for a todo list",
    "language": "javascript"
  }'
```

### Test AI Chat:

```bash
curl -X POST https://your-backend.onrender.com/api/ai/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I sort an array in JavaScript?"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "response": "To sort an array in JavaScript, you can use the .sort() method..."
  }
}
```

---

## 🎨 Frontend Integration

Your frontend already supports AI features via the AIAssistant component.

**AI Features Available:**
- Generate code from prompts
- Explain selected code
- Fix code errors
- Optimize code
- Generate tests
- Chat with AI

**To enable in UI:**
1. Deploy backend with `GOOGLE_AI_API_KEY`
2. Frontend automatically detects available features
3. AI panel becomes active

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep API key in environment variables
- Never commit `.env` file to Git
- Use `.gitignore` to exclude `.env`
- Rotate keys if exposed

### ❌ DON'T:
- Hardcode API key in source code
- Share API key publicly
- Commit API key to repository
- Use API key in frontend code

---

## 💡 Alternative Free AI Options

If you want to try other AI providers, see [FREE_AI_ALTERNATIVES.md](./FREE_AI_ALTERNATIVES.md):

1. **Groq** - Fastest inference (500 tokens/sec)
2. **Hugging Face** - 1000s of models
3. **OpenAI** - $5 free credits
4. **Anthropic Claude** - $5 free credits
5. **Cohere** - 1,000 free requests

**But Gemini is recommended because:**
- ✅ Most generous free tier
- ✅ Already integrated
- ✅ No credit card needed
- ✅ Best for deployment

---

## 🐛 Troubleshooting

### AI features not working

**Check 1: API key is set**
```bash
# In Render logs, you should see:
✅ Google AI Studio (Gemini) initialized successfully
```

**Check 2: API key is valid**
```bash
# Test your API key:
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

**Check 3: Rate limits**
- Error 429 = Rate limit exceeded
- Wait 1 minute and try again
- Check usage at: https://aistudio.google.com/

**Check 4: Environment variables**
```bash
# Make sure env var is named exactly:
GOOGLE_AI_API_KEY
# NOT: GOOGLE_API_KEY, GEMINI_API_KEY, etc.
```

### Common Errors:

| Error | Cause | Solution |
|-------|-------|----------|
| "AI service not configured" | No API key | Add `GOOGLE_AI_API_KEY` |
| "Invalid API key" | Wrong key | Regenerate key |
| "Rate limit exceeded" | Too many requests | Wait 1 min |
| "Loading Ollama..." | API key not detected | Check env var name |

---

## 📈 Monitoring Usage

### View Your Usage:
1. Go to: https://aistudio.google.com/
2. Click on your API key
3. View usage statistics

### Stay Within Free Tier:
- Monitor daily requests
- Set up alerts if approaching limit
- Implement rate limiting in code (optional)

### If You Exceed Free Tier:
You'll get an error, but you won't be charged. Just:
1. Wait until tomorrow (limits reset daily)
2. Or upgrade to paid tier (very cheap)

---

## ✅ Deployment Checklist

- [ ] Get Google AI API key from aistudio.google.com
- [ ] Add `GOOGLE_AI_API_KEY` to Render environment
- [ ] Deploy backend (should auto-redeploy)
- [ ] Check logs for "✅ Google AI Studio (Gemini) initialized"
- [ ] Test AI features in deployed app
- [ ] AI panel should work in frontend

---

## 🎓 Learning Resources

- [Google AI Studio Docs](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Rate Limits & Quotas](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Best Practices](https://ai.google.dev/gemini-api/docs/best-practices)

---

## 🎉 Summary

1. **Ollama won't work on Render** (needs too much RAM)
2. **Use Google Gemini instead** (FREE API)
3. **Get API key** (2 minutes)
4. **Add to Render env vars** (1 minute)
5. **Deploy and test** (automatic)

**Result:** Professional AI-powered code editor, deployed free! 🚀

---

**Next:** Add the API key and deploy! Your AI features will work perfectly.

