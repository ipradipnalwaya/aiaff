# Deploy GenAIMagic to Render (100% Free)

This guide shows you how to deploy your full-stack app to Render for free.

## Why Render?

- ✅ **100% Free** - No credit card required
- ✅ **750 hours/month** free tier
- ✅ **No timeout limits** - Perfect for AI generation (15-45 seconds)
- ✅ **Automatic SSL** - Free HTTPS
- ✅ **Simple deployment** - Connect GitHub and deploy

## Free Tier Limitation

⚠️ **Apps sleep after 15 minutes of inactivity**
- First request after sleep takes ~1 minute to wake up
- **Solution**: Use a free keep-alive service (instructions below)

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/genaimagic.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (no credit card needed)

### 2.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Authorize Render to access your GitHub
4. Select your `genaimagic` repository

### 2.3 Configure the Service

Render will auto-detect settings from `render.yaml`, but verify:

- **Name**: genaimagic (or your choice)
- **Region**: Oregon (or closest to you)
- **Branch**: main
- **Runtime**: Node
- **Build Command**: 
  ```bash
  npm install && npm run build && cd client && npm install && npm run build && cd ..
  ```
- **Start Command**: 
  ```bash
  npm run start
  ```

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `GEMINI_API_KEY` | Your API key | Get from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `SESSION_SECRET` | (auto-generated) | Render generates this automatically |
| `PORT` | `5000` | Required |

**Important**: `ALLOWED_ORIGINS` is optional on Render. The app automatically detects and allows the Render deployment URL. Only add this variable if you need to allow additional domains (e.g., custom domain).

### 2.5 Create Web Service

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Render will give you a URL like: `https://genaimagic.onrender.com`

---

## Step 3: Test Your Deployment

1. Visit your Render URL: `https://genaimagic.onrender.com`
2. Fill out the product form
3. Generate content
4. Verify everything works!

---

## Step 4: Keep Your App Awake (Optional but Recommended)

Since the free tier sleeps after 15 minutes, use a free monitoring service to keep it awake.

### Option A: UptimeRobot (Recommended)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free (50 monitors included)
3. Click **"Add New Monitor"**
4. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: GenAIMagic Keep-Alive
   - **URL**: `https://genaimagic.onrender.com`
   - **Monitoring Interval**: 5 minutes
5. Click **"Create Monitor"**

**Result**: Your app will be pinged every 5 minutes and stay awake!

### Option B: Cron-job.org

1. Go to [cron-job.org](https://cron-job.org)
2. Sign up for free
3. Create a new cron job:
   - **URL**: `https://genaimagic.onrender.com`
   - **Schedule**: Every 10 minutes
4. Enable the job

---

## Troubleshooting

### Build Fails

**Error**: "npm ERR! Missing script: start"

**Solution**: The `package.json` already has a start script. Make sure Render's start command is:
```bash
npm run start
```

### Environment Variables Not Working

**Error**: "GEMINI_API_KEY is not defined"

**Solution**: 
1. Go to Render Dashboard → Your Service → Environment
2. Add the `GEMINI_API_KEY` variable
3. Click **"Save Changes"**
4. Render will auto-redeploy

### CORS Errors

**Error**: "Blocked by CORS policy"

**Solution**: The app is already configured to allow all origins in production. If you still see errors:
1. Check browser console for the exact error
2. Verify the API requests are going to the correct Render URL
3. Make sure `NODE_ENV=production` is set

### App Takes Long to Wake Up

**Symptom**: First request after inactivity takes 60+ seconds

**Solution**: This is normal for the free tier. Solutions:
1. Use UptimeRobot/Cron-job to keep it awake (see Step 4)
2. Upgrade to Render's paid plan ($7/month for no sleep)
3. Let users know there might be a delay on first load

### Content Generation Times Out

**Symptom**: Generation fails after 30+ seconds

**Solution**: This shouldn't happen on Render (no timeout limits), but if it does:
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify `GEMINI_API_KEY` is valid
3. Try with simpler input (fewer URLs)
4. Check your Gemini API quota

---

## Updating Your App

### Deploy New Changes

```bash
# Make your changes locally
git add .
git commit -m "Update feature X"
git push

# Render automatically detects the push and redeploys!
```

### View Logs

1. Go to Render Dashboard
2. Click your service name
3. Click **"Logs"** tab
4. See real-time logs of your app

### Manual Redeploy

1. Go to Render Dashboard
2. Click your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## Render Free Tier Limits

- ✅ **750 hours/month** of runtime (enough for 24/7 with keep-alive)
- ✅ **100GB bandwidth** per month
- ✅ **512MB RAM**
- ✅ **0.1 CPU**
- ⚠️ Apps sleep after 15 minutes inactivity
- ⚠️ ~1 minute cold start time

**For most use cases, this is more than enough!**

---

## Upgrading (Optional)

If you need:
- No sleep/instant wake-up
- More RAM/CPU
- Faster builds

Render's **Starter plan is $7/month**:
- No sleep
- 512MB RAM
- Priority support

---

## Cost Estimate

### Completely Free Setup:
- **Render**: Free (with sleep)
- **UptimeRobot**: Free (keeps app awake)
- **Total**: $0/month

### Premium Setup:
- **Render Starter**: $7/month (no sleep)
- **Total**: $7/month

---

## Alternative to Keep-Alive Services

If you don't want to use UptimeRobot, you can:

1. Accept the 15-min sleep (users see loading on first visit)
2. Add a loading message: "Waking up server, please wait..."
3. Upgrade to Render Starter ($7/month)

---

## Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Issues**: Open an issue on your GitHub repository

---

## Summary

1. ✅ Push code to GitHub
2. ✅ Connect GitHub to Render
3. ✅ Add environment variables (especially `GEMINI_API_KEY`)
4. ✅ Deploy (takes 3-5 minutes)
5. ✅ Set up UptimeRobot to keep app awake
6. ✅ Done! Your app is live and free!

Your app will be available at: `https://your-service-name.onrender.com`
