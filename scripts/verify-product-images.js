const fs = require('fs');
const path = require('path');
const { sampleProducts } = require('../lib/products');

const IMAGES_DIR = path.join(__dirname, '../public/images');

// Get all image files in the directory
const imageFiles = fs.readdirSync(IMAGES_DIR)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

// Check for missing images
console.log('=== Checking product images ===');
let hasIssues = false;

// Check each product's image
sampleProducts.forEach(product => {
  const imageName = path.basename(product.imageUrl);
  const imagePath = path.join(IMAGES_DIR, imageName);
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Missing image for product: ${product.name} (${imageName})`);
    hasIssues = true;
  } else {
    console.log(`✅ Found image for: ${product.name}`);
  }
});

// Check for unused images
console.log('\n=== Checking for unused images ===');
const usedImages = new Set(sampleProducts.map(p => path.basename(p.imageUrl)));
const unusedImages = imageFiles.filter(file => !usedImages.has(file));

if (unusedImages.length > 0) {
  console.log('The following images are not being used by any product:');
  unusedImages.forEach(img => console.log(`  - ${img}`));
} else {
  console.log('All images are being used by products.');
}

// Check for duplicate product IDs
console.log('\n=== Checking for duplicate product IDs ===');
const productIds = sampleProducts.map(p => p.id);
const duplicateIds = productIds.filter((id, index) => productIds.indexOf(id) !== index);

if (duplicateIds.length > 0) {
  console.error('Duplicate product IDs found:', [...new Set(duplicateIds)]);
  hasIssues = true;
} else {
  console.log('No duplicate product IDs found.');
}

// Final status
if (hasIssues) {
  console.log('\n❌ Some issues were found. Please check the logs above.');
  process.exit(1);
} else {
  console.log('\n✅ All product images are properly set up!');
}
