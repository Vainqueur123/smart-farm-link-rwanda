const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const PRODUCTS_FILE = path.join(__dirname, '../lib/products.ts');

// List of all valid product image names from the products.ts file
const validImageNames = [
  'apple.jpg', 'avocado.jpg', 'banana.jpg', 'beans.jpg',
  'cabbage.jpg', 'carrot.jpg', 'cassava.jpg', 'chili.jpg',
  'coffee.jpg', 'garlic.jpg', 'ginger.jpg', 'irish_potato.jpg',
  'maize.jpg', 'mango.jpg', 'onion.jpg', 'passion_fruit.jpg',
  'pineapple.jpg', 'potatoes.jpg', 'rice.jpg', 'spinach.jpg',
  'sweet_potato.jpg', 'tea.jpg', 'tomato.jpg', 'turmeric.jpg'
];

// Clean up temporary files
function cleanTempFiles() {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    const tempFiles = files.filter(file => file.startsWith('temp_') || file.endsWith('.tmp'));
    
    console.log('Cleaning up temporary files...');
    tempFiles.forEach(file => {
      try {
        fs.unlinkSync(path.join(IMAGES_DIR, file));
        console.log(`✅ Deleted temporary file: ${file}`);
      } catch (error) {
        console.warn(`⚠️ Could not delete ${file}: ${error.message}`);
      }
    });
    
    return tempFiles.length;
  } catch (error) {
    console.error('Error cleaning up temporary files:', error.message);
    return 0;
  }
}

// Remove duplicate and unused images
function cleanUnusedImages() {
  try {
    const files = fs.readdirSync(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.webp'].some(ext => file.toLowerCase().endsWith(ext))
    );
    
    console.log('\nChecking for unused images...');
    let removedCount = 0;
    
    imageFiles.forEach(file => {
      if (!validImageNames.includes(file)) {
        try {
          fs.unlinkSync(path.join(IMAGES_DIR, file));
          console.log(`✅ Deleted unused file: ${file}`);
          removedCount++;
        } catch (error) {
          console.warn(`⚠️ Could not delete ${file}: ${error.message}`);
        }
      }
    });
    
    return removedCount;
  } catch (error) {
    console.error('Error cleaning up unused images:', error.message);
    return 0;
  }
}

// Update image references in products.ts
function updateProductReferences() {
  try {
    let content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    
    // Map of old image names to new standardized names
    const imageNameMap = {
      'potatoes.jpg': 'irish_potato.jpg',
      // Add more mappings if needed
    };
    
    // Replace old image references with new ones
    for (const [oldName, newName] of Object.entries(imageNameMap)) {
      const oldPath = `/images/${oldName}`;
      const newPath = `/images/${newName}`;
      
      if (content.includes(oldPath)) {
        content = content.replace(new RegExp(oldPath.replace(/\./g, '\\.'), 'g'), newPath);
        console.log(`Updated image reference: ${oldName} → ${newName}`);
      }
    }
    
    // Save the updated content
    fs.writeFileSync(PRODUCTS_FILE, content, 'utf8');
    console.log('✅ Updated image references in products.ts');
    
    return true;
  } catch (error) {
    console.error('Error updating product references:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting image cleanup and reference update...\n');
  
  // Clean up temporary files
  const tempFilesRemoved = cleanTempFiles();
  
  // Clean up unused images
  const unusedFilesRemoved = cleanUnusedImages();
  
  // Update product references
  const referencesUpdated = updateProductReferences();
  
  console.log('\nCleanup completed:');
  console.log(`- Removed ${tempFilesRemoved} temporary files`);
  console.log(`- Removed ${unusedFilesRemoved} unused images`);
  console.log(`- ${referencesUpdated ? 'Updated' : 'Failed to update'} product references`);
  
  if (referencesUpdated) {
    console.log('\n✅ All product images have been cleaned up and references updated!');
  } else {
    console.log('\n⚠️ Some issues were encountered during cleanup. Check the logs above.');
  }
}

main().catch(console.error);
