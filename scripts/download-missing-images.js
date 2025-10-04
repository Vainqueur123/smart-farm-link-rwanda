const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const TEMP_DIR = path.join(__dirname, 'temp_images');
const IMAGE_URLS = {
  'red_tomatoes.jpg': 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'red_chili.jpg': 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

// Create images directory if it doesn't exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadAndOptimizeImage(filename, url) {
  try {
    console.log(`Downloading ${filename}...`);
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });

    const tempPath = path.join(TEMP_DIR, `temp_${filename}`);
    const finalPath = path.join(IMAGES_DIR, filename);

    // Save the original file to temp directory
    fs.writeFileSync(tempPath, response.data);
    
    // Create images directory if it doesn't exist
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    
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

    // Remove temp file
    try {
      fs.unlinkSync(tempPath);
    } catch (e) {
      console.warn(`Warning: Could not delete temp file ${tempPath}:`, e.message);
    }
    
    console.log(`✅ Successfully downloaded and optimized ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting image download and optimization...\n');
  
  let successCount = 0;
  const totalImages = Object.keys(IMAGE_URLS).length;
  
  try {
    for (const [filename, url] of Object.entries(IMAGE_URLS)) {
      const success = await downloadAndOptimizeImage(filename, url);
      if (success) successCount++;
    }
    
    console.log(`\n✅ Completed: ${successCount} of ${totalImages} images processed successfully`);
    
    if (successCount < totalImages) {
      console.log('❌ Some images failed to download. Check the logs above for details.');
      process.exit(1);
    }
  } finally {
    // Clean up temp directory
    try {
      if (fs.existsSync(TEMP_DIR)) {
        fs.rmdirSync(TEMP_DIR, { recursive: true });
      }
    } catch (e) {
      console.warn('Warning: Could not clean up temp directory:', e.message);
    }
  }
}

main().catch(console.error);
