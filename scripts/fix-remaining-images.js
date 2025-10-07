const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
const fsExtra = require('fs-extra');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(__dirname, '../public/images/backup');

// High-quality image sources for remaining low-res images
const imageSources = {
  'carrot.jpg': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=1200&auto=format&fit=crop&q=80',
  'tea.jpg': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80'
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function downloadImage(url, filePath) {
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer'
  });
  
  await fs.promises.writeFile(filePath, response.data);
  console.log(`Downloaded ${path.basename(filePath)}`);
}

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 80,
        progressive: true,
        optimizeScans: true
      })
      .toFile(outputPath);
    
    const stats = await fs.promises.stat(outputPath);
    console.log(`Optimized ${path.basename(outputPath)} - Size: ${Math.round(stats.size / 1024)} KB`);
    return true;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return false;
  }
}

async function processImage(fileName, imageUrl) {
  const filePath = path.join(IMAGES_DIR, fileName);
  const tempPath = path.join(IMAGES_DIR, `temp_${fileName}`);
  
  try {
    console.log(`\nProcessing ${fileName}...`);
    
    // Backup original image
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(BACKUP_DIR, fileName);
      await fsExtra.copy(filePath, backupPath);
      console.log(`Backed up to ${backupPath}`);
    }
    
    // Download new high-quality image
    console.log(`Downloading from ${imageUrl}...`);
    await downloadImage(imageUrl, tempPath);
    
    // Optimize the downloaded image
    console.log('Optimizing image...');
    const success = await optimizeImage(tempPath, filePath);
    
    if (success) {
      console.log(`✅ Successfully enhanced ${fileName}`);
    } else {
      console.error(`❌ Failed to optimize ${fileName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error.message);
    return false;
  } finally {
    // Clean up temporary file if it exists
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        console.warn(`Could not delete temporary file: ${tempPath}`);
      }
    }
  }
}

async function main() {
  console.log('Starting image enhancement for remaining low-quality images...');
  
  for (const [fileName, imageUrl] of Object.entries(imageSources)) {
    await processImage(fileName, imageUrl);
  }
  
  console.log('\nImage enhancement process completed!');
  console.log('You can find original images in the backup directory if needed:', BACKUP_DIR);
}

main().catch(console.error);
