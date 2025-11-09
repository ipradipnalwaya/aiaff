# Deployment Guide: Frontend on Netlify + Backend on Replit

This guide explains how to deploy GenAIMagic with the frontend on Netlify and the backend on Replit.

## Architecture

- **Frontend (React/Vite)**: Hosted on Netlify as a static site
- **Backend (Express API)**: Running on Replit to handle AI generation and web scraping

## Benefits

- **Fast global CDN** for frontend (Netlify)
- **No timeout limits** for long-running AI requests (Replit)
- **Free tier** available on both platforms
- **Minimal resources** needed on Replit (backend only)

---

## Step 1: Deploy Backend on Replit

### 1.1 Publish Your Replit App

1. Click the **"Deploy"** button at the top of your Replit workspace
2. Choose deployment type:
   - **Autoscale Deployment** (recommended) - scales based on traffic
   - **Reserved VM** - always-on instance
3. Click **"Deploy"** and wait for deployment to complete
4. Copy your deployment URL (e.g., `https://your-app-name.replit.app`)

### 1.2 Configure Environment Variables

In your Replit deployment settings, set the backend environment variables.

**Reference**: See `.env.example` in the project root for all required variables.

**Backend Variables (Replit):**
```bash
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=your_random_session_secret_here
ALLOWED_ORIGINS=https://your-app.netlify.app
NODE_ENV=production
```

**Important Notes**:
- `GEMINI_API_KEY`: Get this from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `SESSION_SECRET`: Generate a random string (at least 32 characters)
- `ALLOWED_ORIGINS`: Update with your actual Netlify URL after Step 2 deployment (NO trailing slash)
- Do NOT include `VITE_API_URL` here - that's for the frontend only

### 1.3 Test Your Backend

Test that your backend is working:

```bash
curl https://your-app-name.replit.app/api/health
```

You should see a response confirming the API is running.

---

## Step 2: Deploy Frontend on Netlify

### 2.1 Push Code to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/genaimagic.git
git push -u origin main
```

### 2.2 Deploy on Netlify

#### Option A: Using Netlify UI (Recommended)

1. Go to [netlify.com](https://www.netlify.com/) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize Netlify
4. Choose your repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app-name.replit.app` (your Replit backend URL)
7. Click **"Deploy site"**

#### Option B: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variable
netlify env:set VITE_API_URL https://your-app-name.replit.app

# Deploy
netlify deploy --prod
```

### 2.3 Get Your Netlify URL

After deployment completes, Netlify will provide your site URL:
- Example: `https://your-app.netlify.app`

---

## Step 3: Update CORS Configuration

Now that you have your Netlify URL, update the backend CORS settings:

1. Go back to your Replit deployment
2. Update the `ALLOWED_ORIGINS` environment variable:
   ```
   ALLOWED_ORIGINS=https://your-app.netlify.app
   ```
3. Redeploy the backend (or it will auto-update)

---

## Step 4: Test Your Deployment

1. Visit your Netlify URL: `https://your-app.netlify.app`
2. Fill out the product form
3. Click "Generate Content"
4. Verify that content is generated successfully

---

## Troubleshooting

### CORS Errors

**Problem**: "Access to fetch blocked by CORS policy"

**Solution**: 
1. Check that `ALLOWED_ORIGINS` in Replit includes your Netlify URL
2. Ensure there are no trailing slashes
3. Verify the Netlify URL is exactly as deployed (check https vs http)

### Content Generation Timeout

**Problem**: Request times out before content is generated

**Solution**: This shouldn't happen on Replit (no timeout limits), but if it does:
1. Check your Gemini API key is valid
2. Verify the backend logs in Replit
3. Try with simpler input (fewer URLs, shorter content)

### 404 Errors on Refresh

**Problem**: Refreshing a page on Netlify shows 404

**Solution**: This is already handled by `netlify.toml` redirects. If you still see it:
1. Verify `netlify.toml` is in your repository root
2. Check that the redirects section exists
3. Redeploy on Netlify

### Environment Variables Not Working

**Problem**: `VITE_API_URL` is undefined

**Solution**:
1. In Netlify: Site Settings → Environment Variables → Add `VITE_API_URL`
2. Must start with `VITE_` prefix for Vite to expose it
3. Redeploy after adding variables

---

## Updating Your App

### Frontend Changes

```bash
# Make your changes
git add .
git commit -m "Update frontend"
git push

# Netlify auto-deploys on push
```

### Backend Changes

1. Make changes in Replit
2. Test locally
3. Click "Deploy" to update production

---

## Cost Estimation

### Netlify (Frontend)
- **Free tier**: 100GB bandwidth, 300 build minutes/month
- **Typical usage**: Enough for small to medium traffic sites
- **Paid tier**: $19/month if you exceed limits

### Replit (Backend)
- **Autoscale Deployment**: Pay only for usage
- **Reserved VM**: ~$7-20/month for always-on
- **Typical usage**: Minimal resources needed for API-only backend

---

## Alternative: Full Deployment on Replit

If you prefer simpler deployment, you can deploy everything on Replit:

1. Click "Deploy" in Replit
2. Choose deployment type
3. Done! No CORS or environment variable configuration needed

This is simpler but won't benefit from Netlify's global CDN.

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Replit Docs**: https://docs.replit.com
- **Issues**: Open an issue on your GitHub repository
