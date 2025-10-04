const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const axios = require('axios');
const fsExtra = require('fs-extra');

const readdir = promisify(fs.readdir);
const IMAGES_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(__dirname, '../public/images/backup');

// High-quality image sources (from Unsplash)
const imageSources = {
  'carrot.jpg': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=1200&auto=format&fit=crop&q=80',
  'irish_potato.jpg': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1200&auto=format&fit=crop&q=80',
  'tea.jpg': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80'
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupOriginalImage(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  await fsExtra.copy(filePath, backupPath);
  console.log(`Backed up ${fileName} to ${backupPath}`);
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
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function processImages() {
  try {
    console.log('Starting image enhancement process...\n');
    
    // Process each image that needs enhancement
    for (const [fileName, imageUrl] of Object.entries(imageSources)) {
      const filePath = path.join(IMAGES_DIR, fileName);
      const tempPath = path.join(IMAGES_DIR, `temp_${fileName}`);
      
      try {
        console.log(`Processing ${fileName}...`);
        
        // Backup original image
        if (fs.existsSync(filePath)) {
          await backupOriginalImage(filePath);
        }
        
        // Download new high-quality image
        await downloadImage(imageUrl, tempPath);
        
        // Optimize the downloaded image
        await optimizeImage(tempPath, filePath);
        
        // Remove temporary file
        await fs.promises.unlink(tempPath);
        
        console.log(`Successfully enhanced ${fileName}\n`);
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error.message);
      }
    }
    
    console.log('Image enhancement process completed!');
  } catch (error) {
    console.error('Error in image enhancement process:', error);
  }
}

// Install required dependencies if not already installed
async function installDependencies() {
  try {
    await require('child_process').execSync('npm list sharp axios fs-extra', { stdio: 'ignore' });
  } catch (e) {
    console.log('Installing required dependencies...');
    require('child_process').execSync('npm install sharp axios fs-extra --save-dev', { stdio: 'inherit' });
  }
}

// Run the script
(async () => {
  await installDependencies();
  await processImages();
})();
