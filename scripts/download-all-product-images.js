const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const fsExtra = require('fs-extra');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const BACKUP_DIR = path.join(__dirname, '../public/images/backup');

// High-quality image sources from Pexels (more reliable)
const imageSources = {
  'apple.jpg': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'avocado.jpg': 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'banana.jpg': 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'beans.jpg': 'https://images.pexels.com/photos/6605214/pexels-photo-6605214.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'cabbage.jpg': 'https://images.pexels.com/photos/12300197/pexels-photo-12300197.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'carrot.jpg': 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'cassava.jpg': 'https://images.pexels.com/photos/6605205/pexels-photo-6605205.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'chili.jpg': 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'coffee.jpg': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'garlic.jpg': 'https://images.pexels.com/photos/5632405/pexels-photo-5632405.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'ginger.jpg': 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'irish_potato.jpg': 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'maize.jpg': 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'mango.jpg': 'https://images.pexels.com/photos/4023132/pexels-photo-4023132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'onion.jpg': 'https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'passion_fruit.jpg': 'https://images.pexels.com/photos/4023133/pexels-photo-4023133.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'pineapple.jpg': 'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'rice.jpg': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'spinach.jpg': 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'sweet_potato.jpg': 'https://images.pexels.com/photos/2286775/pexels-photo-2286775.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'tea.jpg': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'tomato.jpg': 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'turmeric.jpg': 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200'
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
  return filePath;
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
    
    // Check if file exists and back it up
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(BACKUP_DIR, fileName);
      await fsExtra.copy(filePath, backupPath);
      console.log(`Backed up to ${backupPath}`);
    }
    
    // Download the image
    console.log(`Downloading from ${imageUrl}...`);
    await downloadImage(imageUrl, tempPath);
    
    // Optimize the downloaded image
    console.log('Optimizing image...');
    const success = await optimizeImage(tempPath, filePath);
    
    if (success) {
      console.log(`✅ Successfully processed ${fileName}`);
    } else {
      console.error(`❌ Failed to process ${fileName}`);
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
  console.log('Starting image download and optimization...');
  
  // Process all images
  const results = [];
  for (const [fileName, imageUrl] of Object.entries(imageSources)) {
    const success = await processImage(fileName, imageUrl);
    results.push({ fileName, success });
  }
  
  // Print summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n=== Summary ===');
  console.log(`✅ Successfully processed: ${successful} images`);
  if (failed > 0) {
    console.log(`❌ Failed to process: ${failed} images`);
    console.log('Failed images:', results.filter(r => !r.success).map(r => r.fileName).join(', '));
  }
  console.log('\nAll done! Original images have been backed up to:', BACKUP_DIR);
  
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
