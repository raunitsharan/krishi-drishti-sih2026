# 🎯 Quick Command Reference - Krishi Drishti

All commands you need to run, test, and deploy the application.

## 📍 Navigation

```bash
# Navigate to project directory
cd krishi-drishti
```

## 🚀 Development

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open in browser
# Visit: http://localhost:3000
```

## 🏗️ Build & Test

```bash
# Create production build
npm run build

# Start production server locally
npm run start

# Run linter
npm run lint
```

## 🌐 Deployment to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally (one time)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use npm script
npm run deploy
```

### Method 2: GitHub + Vercel Dashboard

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Krishi Drishti - Complete SIH 2026 Prototype"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/krishi-drishti.git

# Push to GitHub
git branch -M main
git push -u origin main

# Then go to vercel.com and import the repository
```

## 🔍 Testing

```bash
# Test if app runs locally
npm run dev

# Test production build
npm run build && npm run start

# Check for TypeScript errors
npx tsc --noEmit

# Check bundle size
npm run build
```

## 🧹 Cleanup

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules (Windows)
rmdir /s /q node_modules

# Reinstall
npm install
```

## 📦 Package Management

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name

# Remove package
npm uninstall package-name
```

## 🐛 Troubleshooting Commands

```bash
# If build fails - clear cache
rm -rf .next
npm run build

# If dependencies issue
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If port 3000 is busy
npm run dev -- -p 3001

# Check Node version (needs 18+)
node --version

# Check npm version
npm --version
```

## 📊 Project Info

```bash
# See all available scripts
npm run

# View dependency tree
npm list

# Check package info
npm info krishi-drishti

# See project size
du -sh .
```

## 🔐 Git Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View commit history
git log --oneline
```

## 🌐 Vercel CLI Commands

```bash
# List all deployments
vercel list

# View deployment logs
vercel logs

# Open deployment in browser
vercel --open

# Remove deployment
vercel remove [deployment-url]

# Link to existing project
vercel link

# View project settings
vercel project

# Set environment variable
vercel env add
```

## 📱 Mobile Testing

```bash
# Get local IP address (Windows)
ipconfig

# Find IPv4 Address (e.g., 192.168.1.100)
# Then on mobile browser visit:
# http://192.168.1.100:3000

# Or use ngrok for public URL
npx ngrok http 3000
```

## 🎨 Code Quality

```bash
# Format code (if prettier installed)
npx prettier --write .

# Check for unused dependencies
npx depcheck

# Analyze bundle
npm run build
# Then check .next/analyze/client.html
```

## 📸 Generate Screenshots

```bash
# Open app
npm run dev

# Take screenshots of:
# - 3D visualization (main view)
# - Each tab (Sensors, Crop AI, Analytics)
# - Threat detection alert
# - Mobile responsive view
```

## 🎬 Record Demo Video

```bash
# Start app
npm run dev

# Use screen recording:
# Windows: Win + G (Game Bar)
# Mac: Cmd + Shift + 5
# Linux: OBS Studio

# Record:
# 1. 3D farm view rotation
# 2. Threat detection appearing
# 3. Navigation through tabs
# 4. Mobile responsiveness
```

## 📦 Create Backup

```bash
# Create zip of project (exclude node_modules)
# Windows PowerShell:
Compress-Archive -Path .\krishi-drishti\* -DestinationPath krishi-drishti-backup.zip -Exclude node_modules,.next

# Or use git archive
git archive --format=zip --output=krishi-drishti.zip HEAD
```

## 🚨 Emergency Commands (Demo Day)

```bash
# Quick restart
Ctrl + C  # Stop server
npm run dev  # Start again

# Force refresh browser
Ctrl + Shift + R  # (Cmd + Shift + R on Mac)

# Quick redeploy
vercel --prod --force

# Check if dependencies installed
npm list --depth=0

# Verify build works
npm run build
```

## 📋 Pre-Presentation Checklist

```bash
# 30 minutes before presentation:

# 1. Pull latest changes
git pull

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Test locally
npm run start

# 5. Check deployment
curl https://your-app.vercel.app

# 6. Verify all features work
# - Open each tab
# - Check 3D loads
# - Wait for threat detection
# - Toggle irrigation

# 7. Test on mobile
# Visit URL on phone

# 8. Have backup ready
# Screenshots + video
```

## 🎯 Most Used Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check status
git status

# Commit and push
git add .
git commit -m "Update"
git push
```

## 🔗 Important URLs

```bash
# Local development
http://localhost:3000

# Your Vercel deployment
https://your-app-name.vercel.app

# Vercel dashboard
https://vercel.com/dashboard

# GitHub repository
https://github.com/yourusername/krishi-drishti

# Next.js docs
https://nextjs.org/docs

# Three.js docs
https://threejs.org/docs

# Vercel docs
https://vercel.com/docs
```

## 💡 Pro Tips

```bash
# Keep dev server running while you work
# Open new terminal for git commands

# Use separate terminal windows:
Terminal 1: npm run dev (keep running)
Terminal 2: git commands
Terminal 3: vercel commands

# Auto-save on file changes
# Next.js hot-reloads automatically

# Clear browser cache if changes don't show
# Ctrl + Shift + Delete (Chrome)
```

## 📞 Quick Help

```bash
# Next.js help
npx next --help

# npm help
npm help

# Vercel help
vercel --help

# Git help
git --help

# Node version
node --version

# Check if ports are in use (Windows)
netstat -ano | findstr :3000
```

## 🎉 Success Commands

```bash
# After successful deployment:

# 1. Test live URL
curl -I https://your-app.vercel.app

# 2. Share with team
echo "Live at: https://your-app.vercel.app"

# 3. Update README with URL
# Edit README.md and add your Vercel URL

# 4. Commit final version
git add README.md
git commit -m "Add live deployment URL"
git push
```

---

## 🆘 If Something Goes Wrong

```bash
# Nuclear option (fresh start):
rm -rf node_modules .next package-lock.json
npm install
npm run build
npm run dev

# If git issues:
git reset --hard HEAD
git pull

# If Vercel issues:
vercel remove [deployment-name]
vercel --prod

# If nothing works:
# Close everything
# Restart computer
# cd krishi-drishti
# npm install
# npm run dev
```

---

**Keep this file open during hackathon day for quick reference!**

**Team Krishi Drishti | Smart India Hackathon 2026**
