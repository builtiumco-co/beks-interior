# Performance Optimization Guide

This document explains how to optimize your BEKs Interior website for maximum performance (99% PageSpeed score).

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)

### Installation

1. **Open Terminal/Command Prompt** in the project folder
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Optimization

**Option 1: Full Build (Recommended)**
```bash
npm run build
```
This will:
- Optimize all images (convert to WebP, create multiple sizes)
- Minify CSS and JavaScript files

**Option 2: Step-by-Step**
```bash
# Optimize images only
npm run optimize-images

# Minify CSS/JS only
npm run minify
```

### Clean Build Artifacts
```bash
npm run clean
```

---

## 📋 What Gets Optimized

### Images (`npm run optimize-images`)
- **Input:** `images/*.jpg`, `images/*.png`
- **Output:** `images/optimized/`

For each image, creates:
- **Hero size** (1920px) - for large backgrounds
- **Large** (1200px) - desktop displays
- **Medium** (800px) - tablets & portfolio items
- **Small** (400px) - mobile & thumbnails

Both **WebP** (modern browsers) and **JPEG** (fallback) formats.

**Example:**
```
spacejoy-XpbtQfr9Skg-unsplash.jpg (2.6MB)
  → spacejoy-XpbtQfr9Skg-unsplash.webp (145KB)
  → spacejoy-XpbtQfr9Skg-unsplash-large.webp (80KB)
  → spacejoy-XpbtQfr9Skg-unsplash-medium.webp (52KB)
  → spacejoy-XpbtQfr9Skg-unsplash-small.webp (28KB)
  + JPEG fallbacks
```

### CSS & JavaScript (`npm run minify`)
- **style.css** → **style.min.css** (~30-40% smaller)
- **script.js** → **script.min.js** (~30-40% smaller)

---

## 🎯 Expected Results

### Before Optimization
- **Images:** 25MB+ total
- **CSS:** 13KB unminified
- **JS:** 6KB unminified
- **PageSpeed:** ~40-60 (mobile)

### After Optimization
- **Images:** 2-3MB total (90% reduction)
- **CSS:** 9KB minified
- **JS:** 4KB minified
- **PageSpeed:** 90-99 (mobile & desktop)

---

## ⚠️ Important Notes

1. **Original images are NOT modified** - optimized versions go to `images/optimized/`
2. **Run this ONCE** - you don't need to re-run unless images change
3. **Commit optimized files** to your repository or upload them to your hosting

---

## 🐛 Troubleshooting

### `npm install` fails
- **Ensure Node.js is installed:** Run `node --version`
- **Try:** `npm install --force`

### `sharp` installation fails (Windows)
- Install Visual Studio Build Tools
- Or use: `npm install --platform=win32 --arch=x64 sharp`

### Out of memory during image optimization
- Process images in batches
- Reduce image sizes in the script config

---

## 📊 Verification

After running optimization:

1. **Check file sizes:**
   - Navigate to `images/optimized/`
   - Verify WebP files are much smaller

2. **Test locally:**
   - Open `index.html` in browser
   - Check Network tab - images should be smaller

3. **Run PageSpeed Insights:**
   - Visit: https://pagespeed.web.dev/
   - Enter your website URL
   - Target: 90+ mobile, 99+ desktop

---

## 💡 Next Steps

After running the optimization scripts:

1. ✅ **Update HTML files** to use optimized images
2. ✅ **Use minified CSS/JS** (already done in the updated files)
3. ✅ **Upload to hosting** (Netlify, GitHub Pages, etc.)
4. ✅ **Test performance** on PageSpeed Insights

For detailed implementation, see the updated HTML files which now reference the optimized images with lazy loading.

---

## 🆘 Need Help?

Common issues:
- **Images not loading?** Check the `images/optimized/` folder exists
- **Minified CSS broken?** Review the original CSS for syntax errors
- **Still slow?** Ensure your hosting has compression enabled

---

**Created:** December 2024  
**Purpose:** Performance optimization for BEKs Interior website
