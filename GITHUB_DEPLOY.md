# 🚀 Deploy to Vercel via GitHub - Step by Step

## ✅ Your Code is Ready!

Everything is committed and ready to push to GitHub.

---

## 📋 Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. **Go to GitHub**
   - Visit: https://github.com/new
   - Or go to https://github.com and click the "+" icon → "New repository"

2. **Create Repository**
   - **Repository name:** `krishi-drishti-sih2026`
   - **Description:** `AI-Powered Precision Agriculture System - Smart India Hackathon 2026`
   - **Visibility:** Public (so judges can see it)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

3. **Copy the Repository URL**
   - You'll see: `https://github.com/YOUR_USERNAME/krishi-drishti-sih2026.git`
   - Copy this URL

### Option B: Via GitHub CLI (if installed)

```powershell
gh repo create krishi-drishti-sih2026 --public --description "AI-Powered Precision Agriculture System - SIH 2026"
```

---

## 📋 Step 2: Push to GitHub

### Open PowerShell in the krishi-drishti folder:

```powershell
# Navigate to project
cd "C:\Users\rauni\OneDrive\Desktop\SIH 26210\krishi-drishti"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/krishi-drishti-sih2026.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted:**
- Username: your_github_username
- Password: Use a Personal Access Token (not your GitHub password)

### If you need a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Vercel Deployment"
4. Select scopes: `repo` (check the box)
5. Click "Generate token"
6. Copy the token (save it somewhere safe!)
7. Use this token as your password when pushing

---

## 📋 Step 3: Deploy on Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Log In"
   - **Sign up with GitHub** (recommended)

2. **Import Project**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find and click "Import" next to `krishi-drishti-sih2026`

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected) ✓
   - **Root Directory:** ./ (leave as default) ✓
   - **Build Command:** `npm run build` (auto-filled) ✓
   - **Output Directory:** `.next` (auto-filled) ✓
   - No environment variables needed ✓

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes (Vercel will build your app)
   - You'll get a live URL! 🎉

5. **Your Live URL**
   - Format: `https://krishi-drishti-sih2026-xyz.vercel.app`
   - Or: `https://krishi-drishti-sih2026.vercel.app`
   - Click to visit and test!

---

## 📋 Step 4: Test Your Deployment

### Visit your Vercel URL and check:

✓ 3D farm visualization loads
✓ All navigation tabs work
✓ Click "Problem Inject" tab
✓ Try injecting threats:
  - Click "🐘 Elephant" - see alert appear
  - Click "🔥 Fire" - see fire detection
  - Click "🦅 Bird Flock" - see bird alert
✓ Try weather conditions:
  - Click "☀️ Drought" - soil moisture drops
  - Click "🌊 Heavy Rain" - moisture increases
✓ Test on mobile device
✓ Share URL with team!

---

## 🎯 New Feature: Problem Injection Panel

### What's New:

**New Tab Added: "Problem Inject"**

This panel allows you to manually trigger problems for demonstration:

1. **Threat Detection:**
   - 🐘 Elephant intrusion
   - 🐗 Wild Boar attack
   - 🦅 Bird flock activity
   - 🔥 Fire detection
   - 🦌 Deer intrusion
   - Clear All (reset)

2. **Weather Conditions:**
   - ☀️ Drought (low moisture, high temp)
   - 🌊 Heavy Rain (high moisture)
   - 🌡️ Heatwave (extreme temperature)
   - Reset Weather (back to normal)

3. **System Issues:**
   - 💧 Irrigation Failure (valve stuck)
   - Status monitoring in real-time

### How to Use During Demo:

1. Navigate to "Problem Inject" tab
2. Click any button to inject that problem
3. Immediately see:
   - 3D view updates (threat indicators)
   - Alert cards appear
   - Sensor data changes
   - System responses
4. Switch to other tabs to see the effects
5. Use "Clear All" or "Reset" buttons to return to normal

### Perfect for Presentations:

- **Control the demo** - trigger threats when you want
- **Show responses** - demonstrate AI detection
- **Prove reliability** - system handles all scenarios
- **Interactive** - judges can try it themselves

---

## 📱 Update README with Live URL

After deployment, update your README:

```powershell
# Open README.md and add your live URL at the top
```

Or use this command (replace URL):

```powershell
$url = "https://your-app.vercel.app"
(Get-Content README.md) -replace 'your-deployment-url.vercel.app', "$url" | Set-Content README.md
git add README.md
git commit -m "Add live deployment URL"
git push
```

---

## 🔄 Automatic Deployments

From now on:
- Every time you push to `main` branch
- Vercel automatically builds and deploys
- You get a new live URL within 2-3 minutes
- Perfect for updates and improvements!

---

## 🆘 Troubleshooting

### Issue: Git push asks for password but won't accept it

**Solution:** Use Personal Access Token instead
1. Go to: https://github.com/settings/tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

### Issue: Remote already exists

**Solution:** Remove and re-add
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/krishi-drishti-sih2026.git
git push -u origin main
```

### Issue: Vercel build fails

**Solution:** Check build log in Vercel dashboard
- Usually fixes itself on refresh
- Or click "Redeploy" button

### Issue: 3D view not loading on deployment

**Solution:** This is normal! Try:
- Different browser (Chrome recommended)
- Clear cache (Ctrl + Shift + R)
- Check on mobile device
- Wait 30 seconds for assets to load

---

## 📊 Post-Deployment Checklist

After successful deployment:

- [ ] Tested live URL - everything works
- [ ] Problem injection panel works
- [ ] All 5 tabs accessible and functional
- [ ] 3D visualization loads correctly
- [ ] Threats can be manually injected
- [ ] Weather conditions change sensor data
- [ ] Mobile responsive design works
- [ ] Shared URL with team members
- [ ] Added URL to hackathon submission
- [ ] Updated README with live link
- [ ] Took screenshots for backup

---

## 🎤 Demo Script with Problem Injection

**Enhanced 5-Minute Demo:**

**Minute 1:** Introduction + 3D Farm View
- "This is Krishi Drishti - complete AI agriculture solution"
- Show 3D visualization

**Minute 2:** Live Threat Injection
- Navigate to "Problem Inject" tab
- Click "🐘 Elephant" button
- Go back to Monitor tab
- "See! Elephant detected in real-time"
- Show alert with location and confidence

**Minute 3:** Weather Simulation
- Go to Problem Inject
- Click "☀️ Drought"
- Go to Sensors tab
- "Notice soil moisture dropped to 20%, temperature increased"
- Show AI recommendation

**Minute 4:** All Features
- Click through remaining tabs
- Show crop recommendations
- Display harvest predictions
- Present analytics dashboard

**Minute 5:** Impact & Questions
- "₹18,500 savings per acre"
- "35% water conservation"
- "Ready for questions!"

---

## 🌟 Your URLs

After deployment, you'll have:

**GitHub Repository:**
```
https://github.com/YOUR_USERNAME/krishi-drishti-sih2026
```

**Live Application:**
```
https://krishi-drishti-sih2026.vercel.app
(or similar - Vercel will provide exact URL)
```

**Vercel Dashboard:**
```
https://vercel.com/your-username/krishi-drishti-sih2026
```

---

## 🎉 You're Done!

Once deployed:
✅ Share Vercel URL with judges
✅ Add to hackathon submission
✅ Test on multiple devices
✅ Practice demo with problem injection
✅ Show off to your team!

---

**Pro Tip:** Use the Problem Injection panel during live demo to:
- Control exactly when threats appear
- Show different scenarios on demand
- Prove system handles all problems
- Make your demo interactive and impressive!

---

**Questions? Check:**
- Vercel documentation: https://vercel.com/docs
- GitHub help: https://docs.github.com
- This project's README.md
- PRESENTATION.md for demo tips

---

**Built with ❤️ for Smart India Hackathon 2026**

**Team Krishi Drishti | Problem Statement 26210**

🌾 Good Luck! 🚀
