const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const TEMP_DIR = path.join(__dirname, 'temp_images');

// High-quality image sources
const IMAGE_URLS = {
  'fresh_tomatoes.jpg': 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'sweet_potatoes.jpg': 'https://images.pexels.com/photos/2286775/pexels-photo-2286775.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

// Create necessary directories
[IMAGES_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function downloadAndOptimizeImage(filename, url) {
  try {
    console.log(`Downloading ${filename}...`);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });

    const tempPath = path.join(TEMP_DIR, `temp_${filename}`);
    const finalPath = path.join(IMAGES_DIR, filename);

    // Save the original file to temp directory
    fs.writeFileSync(tempPath, response.data);
    
    // Optimize the image and save to final location
    await sharp(tempPath)
      .resize(800, 600, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: 80,
        progressive: true,
        optimizeScans: true
      })
      .toFile(finalPath);

    console.log(`✅ Successfully processed ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting image update...\n');
  
  let successCount = 0;
  for (const [filename, url] of Object.entries(IMAGE_URLS)) {
    const success = await downloadAndOptimizeImage(filename, url);
    if (success) successCount++;
  }
  
  console.log(`\n✅ Completed: ${successCount} of ${Object.keys(IMAGE_URLS).length} images processed`);
  
  // Clean up temp directory
  try {
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmdirSync(TEMP_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('Warning: Could not clean up temp directory:', e.message);
  }
}

main().catch(console.error);
