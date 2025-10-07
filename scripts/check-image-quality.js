const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const IMAGES_DIR = path.join(__dirname, '../public/images');
const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;
const MAX_SIZE_KB = 500; // Maximum file size in KB

async function checkImageQuality() {
  try {
    const files = await readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
    );

    console.log('\n=== Image Quality Report ===\n');
    console.log(`Found ${imageFiles.length} image files.\n`);

    const results = [];
    
    for (const file of imageFiles) {
      const filePath = path.join(IMAGES_DIR, file);
      const fileStat = await stat(filePath);
      const fileSizeKB = Math.round(fileStat.size / 1024);
      
      try {
        const metadata = await sharp(filePath).metadata();
        const { width, height, format } = metadata;
        
        const isHighQuality = width >= MIN_WIDTH && height >= MIN_HEIGHT;
        const isOptimized = fileSizeKB <= MAX_SIZE_KB;
        
        results.push({
          file,
          dimensions: `${width}x${height}`,
          size: `${fileSizeKB} KB`,
          format,
          quality: isHighQuality ? '✅ Good' : '⚠️ Low',
          optimization: isOptimized ? '✅ Optimized' : '⚠️ Needs optimization',
          issues: [
            ...(width < MIN_WIDTH || height < MIN_HEIGHT ? ['Low resolution'] : []),
            ...(fileSizeKB > MAX_SIZE_KB ? ['Large file size'] : [])
          ]
        });
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    // Display results in a table
    console.table(results, ['file', 'dimensions', 'size', 'format', 'quality', 'optimization']);
    
    // List files that need attention
    const needsAttention = results.filter(r => r.issues.length > 0);
    if (needsAttention.length > 0) {
      console.log('\n=== Images Needing Attention ===\n');
      needsAttention.forEach(img => {
        console.log(`- ${img.file}: ${img.issues.join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking image quality:', error);
  }
}

// Install required dependencies if not already installed
async function installDependencies() {
  try {
    await require('child_process').execSync('npm list sharp', { stdio: 'ignore' });
  } catch (e) {
    console.log('Installing sharp for image processing...');
    require('child_process').execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  }
}

// Run the script
(async () => {
  await installDependencies();
  await checkImageQuality();
})();
