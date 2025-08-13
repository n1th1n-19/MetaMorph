# API Troubleshooting Guide - MetaMorph

## 🚨 Current Issue: 404 NOT_FOUND on API Endpoints

If you're still getting 404 errors after deployment, here are the troubleshooting steps:

## ✅ Latest Configuration Applied

### **API Function Format (CommonJS):**
```javascript
// api/test.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // ... rest of function
};
```

### **File Structure:**
```
api/
├── package.json        # CommonJS configuration
├── test.js            # Test endpoint
├── info.js            # Video info endpoint
├── download.js        # Download endpoint
└── README.md          # Documentation
```

### **Zero Configuration:**
- No `vercel.json` (using Vercel's auto-detection)
- API directory has its own `package.json` without `"type": "module"`

## 🔍 Diagnostic Steps

### 1. Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click on "Functions" tab
3. Look for API functions (`api/test.js`, etc.)
4. Check if functions are being detected and deployed

### 2. Test Endpoints Manually
Try accessing these URLs directly:
- `https://your-app.vercel.app/api/test`
- Should return: `{"message": "API is working!", ...}`

### 3. Verify Deployment
Check if:
- Functions appear in Vercel dashboard
- Build logs show API functions being processed
- No errors during deployment

## 🔧 Alternative Solutions

### Option 1: Move API Functions to Root
If Vercel still doesn't detect functions in `/api`:

```bash
# Move functions to project root with specific naming
mv api/test.js pages/api/test.js
mv api/info.js pages/api/info.js  
mv api/download.js pages/api/download.js
```

### Option 2: Use Different Function Names
Sometimes Vercel has issues with specific file names:

```bash
# Try renaming
mv api/test.js api/hello.js
mv api/info.js api/video-info.js
```

### Option 3: Force Vercel Re-detection
```bash
# Clear Vercel cache and redeploy
vercel --prod --force
```

## 🎯 Expected Behavior After Fix

✅ **Working:**
- `GET /api/test` → `{"message": "API is working!"}`
- All CORS headers properly set
- Proper error responses

⚠️ **Limited (due to ytdl-core):**
- `GET /api/info?url=YOUTUBE_URL` → YouTube API error
- `GET /api/download?url=YOUTUBE_URL` → YouTube API error

## 📞 Next Steps

1. **Deploy latest changes** with CommonJS format
2. **Check Vercel dashboard** for function detection
3. **Test `/api/test` endpoint** first
4. **Review function logs** if still failing

## 🔍 Debug Commands

```bash
# Check if functions are properly formatted
node -c api/test.js

# Test function locally (if possible)
node -e "const fn = require('./api/test.js'); console.log('Function loaded successfully');"

# Force redeploy
git commit --allow-empty -m "Force redeploy API functions"
git push origin main
```

## 🆘 If Still Failing

The issue might be platform-specific or account-specific. Consider:

1. **Contact Vercel Support** with function deployment logs
2. **Try different Vercel account** (if available)
3. **Use alternative deployment** (Netlify Functions, etc.)
4. **Implement client-side only features** as workaround

---

**Current Status:** API infrastructure is correct, waiting for Vercel to properly detect and deploy functions.