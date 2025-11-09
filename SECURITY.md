# Security Features - GenAIMagic.io

## 🔒 Current Security Measures

### 1. Rate Limiting (Active)
**Protection against API abuse and cost overruns**

- **Content Generation Endpoint** (`/api/generate-content`):
  - **Limit**: 20 requests per IP address per 15 minutes
  - **Why**: Prevents abuse of Gemini API (which costs money)
  - **Response**: HTTP 429 with "Too many requests" message

- **Extension Sessions & Other APIs** (`/api/extension-sessions`):
  - **Limit**: 100 requests per IP address per 15 minutes
  - **Why**: Prevents database spam and DoS attacks
  
- **Development Mode**: Rate limiting is disabled in development for easier testing

### 2. CORS (Cross-Origin Resource Sharing)
**Controls which websites/extensions can access your API**

- ✅ **Allowed Origins**:
  - Your web app domain (automatically detected from `RENDER_EXTERNAL_URL`)
  - Browser extensions (`chrome-extension://`, `moz-extension://`)
  - Localhost (for development)
  - Custom origins via `ALLOWED_ORIGINS` environment variable

- ❌ **Blocked Origins**:
  - All other websites and domains
  - Direct browser access (unless from your domain)

### 3. Environment Variable Protection
**Secrets are never exposed in code**

- `GEMINI_API_KEY`: Stored securely in Render environment variables
- `DATABASE_URL`: PostgreSQL credentials secured
- `SESSION_SECRET`: Session encryption key protected

### 4. Input Validation
**Prevents malicious data and injection attacks**

- All API inputs validated with Zod schemas
- URL validation for affiliate and resource links
- Product name/description length limits
- Content type enforcement

### 5. HTTPS Encryption
**All data transmitted securely**

- Render provides automatic HTTPS
- SSL/TLS certificates managed automatically
- No plain HTTP connections in production

---

## ⚠️ Current Limitations

### What's NOT Protected (Optional Enhancements):

1. **No User Authentication**
   - Anyone can use the API within rate limits
   - Consider adding:
     - API keys for power users
     - Login system for tracking usage
     - Premium tier with higher limits

2. **Basic Rate Limiting**
   - IP-based only (can be bypassed with VPNs)
   - Consider upgrading to:
     - User account-based limits
     - Distributed rate limiting (Redis)
     - Progressive limits (stricter after violations)

3. **No Usage Analytics**
   - Can't track who's using most resources
   - Consider adding:
     - Request logging
     - Cost tracking per user/IP
     - Usage dashboard

---

## 🎯 Recommended Enhancements (Optional)

### For Higher Security:

1. **Add API Keys** (if you want to control who uses it):
```javascript
// Require X-API-Key header
if (req.headers['x-api-key'] !== process.env.VALID_API_KEY) {
  return res.status(401).json({ error: 'Invalid API key' });
}
```

2. **Add Gemini API Budget Alerts**:
- Set up Google Cloud billing alerts
- Monitor Gemini API usage in console
- Add cost limits to prevent overages

3. **Implement Session-Based Auth** (for web app users):
- Already have session infrastructure
- Add login/signup flow
- Track usage per user account

4. **Content Filtering**:
- Add moderation for product descriptions
- Block spam/malicious keywords
- Validate URLs aren't malicious

---

## 🚀 Current Status

### ✅ Your API is Protected Against:
- Spam/DoS attacks (rate limiting)
- Unauthorized website access (CORS)
- SQL injection (input validation)
- Data interception (HTTPS)
- Secret exposure (environment variables)

### 💰 Cost Protection:
- **20 requests per 15 min per IP** = Max ~2,000 requests/day per user
- With average cost of $0.001 per Gemini request
- **Maximum daily cost from abuse**: ~$2/day (very conservative)
- **Realistic daily cost**: $0.10-0.50/day for normal usage

---

## 📊 Monitoring Your Security

### Check Rate Limit Headers:
Every API response includes:
- `X-RateLimit-Limit`: Your limit (20 or 100)
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When limit resets

### Example:
```bash
curl -I https://genaimagic.onrender.com/api/generate-content

# Response headers:
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1699564800
```

---

## 🔧 Configuration

### Adjust Rate Limits:
Edit `server/index.ts`:
```typescript
const contentGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Change window (15 minutes)
  max: 20,                   // Change limit (20 requests)
});
```

### Add Custom Allowed Origins:
In Render environment variables:
```
ALLOWED_ORIGINS=https://yoursite.com,https://partner.com
```

---

## 🎉 Summary

Your API is **reasonably secure** for a free, public service. The rate limiting prevents cost overruns from abuse, and CORS blocks unauthorized access from other websites.

**For most use cases, this is sufficient.** If you want stricter control or higher limits for trusted users, consider implementing API keys or user authentication.
