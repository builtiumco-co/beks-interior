const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'optimized');

// Image size configurations
const SIZES = {
  hero: { width: 1920, quality: 85, suffix: '' },
  large: { width: 1200, quality: 82, suffix: '-large' },
  medium: { width: 800, quality: 80, suffix: '-medium' },
  small: { width: 400, quality: 78, suffix: '-small' }
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Optimize a single image - convert to WebP and create responsive variants
 */
async function optimizeImage(inputPath, filename) {
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();

  // Skip if not an image file
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`⏭️  Skipping ${filename} (not an image)`);
    return;
  }

  console.log(`\n🖼️  Processing: ${filename}`);

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB`);

    let totalSaved = 0;

    // Create different size variants
    for (const [sizeName, config] of Object.entries(SIZES)) {
      // Skip if original is smaller than target
      if (metadata.width < config.width && sizeName !== 'hero') {
        continue;
      }

      const outputName = `${baseName}${config.suffix}`;

      // Generate WebP version
      const webpPath = path.join(OUTPUT_DIR, `${outputName}.webp`);
      await sharp(inputPath)
        .resize(config.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: config.quality })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;

      // Generate JPEG fallback (for older browsers)
      const jpegPath = path.join(OUTPUT_DIR, `${outputName}.jpg`);
      await sharp(inputPath)
        .resize(config.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: config.quality, mozjpeg: true })
        .toFile(jpegPath);

      const jpegSize = fs.statSync(jpegPath).size;

      console.log(`   ✅ ${sizeName}: WebP ${(webpSize / 1024).toFixed(0)}KB, JPEG ${(jpegSize / 1024).toFixed(0)}KB`);
      totalSaved += (fs.statSync(inputPath).size - webpSize);
    }

    const savedMB = (totalSaved / 1024 / 1024).toFixed(2);
    console.log(`   💾 Saved: ${savedMB}MB`);

  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

/**
 * Process all images in the input directory
 */
async function processAllImages() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`📁 Input:  ${INPUT_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  console.log('═══════════════════════════════════════════════════════\n');

  const files = fs.readdirSync(INPUT_DIR);
  let processedCount = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const stat = fs.statSync(inputPath);

    if (stat.isFile()) {
      await optimizeImage(inputPath, file);
      processedCount++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`\n✨ Optimization complete! Processed ${processedCount} images.`);
  console.log(`\n📦 Optimized images are in: ${OUTPUT_DIR}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Run: npm run minify');
  console.log('   2. Update your HTML to use the optimized images');
  console.log('   3. Test the website performance\n');
}

// Run the optimization
processAllImages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
