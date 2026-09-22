# 🚀 Deployment Guide - Krishi Drishti

This guide will help you deploy the Krishi Drishti application to Vercel for live demonstration.

## 📋 Prerequisites

- A GitHub account
- A Vercel account (free tier works perfectly)
- Git installed on your computer
- Node.js 18+ installed

## 🌐 Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git Repository** (if not already done)
   ```bash
   cd krishi-drishti
   git init
   git add .
   git commit -m "Initial commit - Krishi Drishti SIH 2026"
   ```

2. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it: `krishi-drishti-sih2026`
   - Keep it public for hackathon judging

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/krishi-drishti-sih2026.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your `krishi-drishti-sih2026` repository

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Environment Variables** (Optional)
   - No environment variables needed for the demo
   - Click "Deploy"

5. **Wait for Deployment**
   - Vercel will build and deploy your app
   - Takes about 2-3 minutes
   - You'll get a live URL like: `https://krishi-drishti-sih2026.vercel.app`

### Step 3: Test Your Deployment

1. Visit your deployment URL
2. Check all tabs:
   - ✅ Live Monitor with 3D visualization
   - ✅ Sensors dashboard
   - ✅ Crop AI recommendations
   - ✅ Analytics charts
3. Test responsiveness on mobile/tablet

## 💻 Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd krishi-drishti
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: krishi-drishti-sih2026
- **Directory**: ./ (press Enter)
- **Override settings**: No

### Step 4: Deploy to Production

```bash
vercel --prod
```

## 🔄 Automatic Deployments

After initial setup:
- Every push to `main` branch → Production deployment
- Every push to other branches → Preview deployment
- Pull requests get their own preview URLs

## ⚙️ Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your domain (e.g., `krishidrishti.com`)
   - Follow DNS configuration instructions

2. **Update DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Wait for DNS propagation (up to 48 hours)

## 📊 Performance Optimization

Vercel automatically provides:
- ✅ Global CDN (Edge Network)
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 & HTTP/3
- ✅ Edge caching

## 🔍 Monitoring & Analytics

### Built-in Vercel Analytics

1. Go to your project dashboard
2. Click "Analytics" tab
3. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Enable Speed Insights

```bash
npm install @vercel/speed-insights
```

Add to `app/layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: TypeScript errors**
```bash
# Solution: Fix TypeScript errors locally first
npm run build
# Fix any errors, then deploy
```

### 3D Scene Not Loading

**Issue**: Black screen or loading forever

**Solution**: This is usually fine in production. The 3D scene uses dynamic import to avoid SSR issues. If problems persist:

1. Check browser console for errors
2. Ensure WebGL is supported in browser
3. Try different browser (Chrome/Firefox recommended)

### Slow Initial Load

**Solution**: Vercel's first deployment might be cached. Clear cache:
- Click "Redeploy" in Vercel dashboard
- Or push a new commit

## 📱 Mobile Optimization

The app is already responsive, but for best mobile experience:

1. **Test on Real Devices**
   - Use Vercel's preview deployments
   - Share preview URL to test on phones

2. **PWA Support** (Optional Enhancement)
   ```bash
   npm install next-pwa
   ```

## 🔐 Security

Vercel provides:
- ✅ DDoS protection
- ✅ SSL certificates (auto-renewed)
- ✅ Security headers (configured in vercel.json)
- ✅ Rate limiting

## 💰 Cost

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Analytics
- ✅ Preview deployments

Perfect for hackathon demos and prototypes!

## 🎯 Hackathon Presentation Tips

### Before Judging

1. **Test Everything**
   ```bash
   # Visit your deployment URL and verify:
   - 3D visualization loads smoothly
   - All tabs work correctly
   - Animations are smooth
   - Data updates in real-time
   - Mobile view looks good
   ```

2. **Prepare Backup**
   - Take screenshots of all features
   - Record a demo video
   - Have local version ready (`npm run dev`)

3. **Share Link**
   - Add deployment URL to your hackathon submission
   - Include QR code in presentation
   - Test on judging day morning

### During Demo

1. Start with Live Monitor (3D view) - Most impressive!
2. Show threat detection in action
3. Navigate through all tabs smoothly
4. Show mobile responsiveness
5. Highlight real-time data updates

## 📊 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] 3D farm scene renders properly
- [ ] All sensor data displays correctly
- [ ] Threat detection UI works
- [ ] Irrigation control functions
- [ ] Crop recommendations show
- [ ] Harvest prediction displays
- [ ] Alert system UI works
- [ ] Analytics charts render
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Fast load times (<3s)

## 🔄 Update Deployment

To update your live site:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Vercel auto-deploys the changes!
```

## 📞 Support

**Vercel Issues:**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

**Project Issues:**
- Check README.md
- Review browser console
- Test locally first: `npm run dev`

## 🎉 Success!

Your Krishi Drishti application is now live and accessible worldwide!

**Share your deployment:**
- Add URL to GitHub README
- Include in hackathon submission
- Share with team members
- Use in presentation

---

**Built for Smart India Hackathon 2026 | Problem Statement 26210**
