const fs = require('fs');
const path = require('path');
const https = require('https');
const { sampleProducts } = require('../lib/products');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Map of product types to high-quality image URLs
const imageUrls = {
  maize: 'https://images.unsplash.com/photo-1601593764920-9d1bd1f54636?w=800&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1547496502-8daf41a3a4a1?w=800&auto=format&fit=crop&q=80',
  mango: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80',
  banana: 'https://images.unsplash.com/photo-1571771574823-7e9ff7a5abdc?w=800&auto=format&fit=crop&q=80',
  tomato: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=800&auto=format&fit=crop&q=80',
  onion: 'https://images.unsplash.com/photo-1580206672800-87d63ae1d18f?w=800&auto=format&fit=crop&q=80',
  coffee: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
  chili: 'https://images.unsplash.com/photo-1603394633863-9a1e9e6d8e3d?w=800&auto=format&fit=crop&q=80',
  beans: 'https://images.unsplash.com/photo-1615715757401-f30e7b27b912?w=800&auto=format&fit=crop&q=80',
  tea: 'https://images.unsplash.com/photo-1597318181409-ca893535f5f9?w=800&auto=format&fit=crop&q=80',
  potatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  // Add more image URLs as needed
};

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${url}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Process each product
async function updateProductImages() {
  const updatedProducts = [];
  
  for (const product of sampleProducts) {
    const imageName = `${product.type}.jpg`;
    const imagePath = path.join(imagesDir, imageName);
    const imageUrl = imageUrls[product.type];
    
    if (imageUrl && !fs.existsSync(imagePath)) {
      try {
        console.log(`Downloading image for ${product.name}...`);
        await downloadImage(imageUrl, imagePath);
        console.log(`Downloaded ${imageName}`);
      } catch (error) {
        console.error(`Error downloading image for ${product.name}:`, error.message);
      }
    }
    
    // Update the product's image URL
    const updatedProduct = {
      ...product,
      imageUrl: `/images/${imageName}`
    };
    
    updatedProducts.push(updatedProduct);
  }
  
  // Save updated products back to the file
  const productsFile = path.join(__dirname, '../lib/products.ts');
  let content = fs.readFileSync(productsFile, 'utf8');
  
  // Replace the sampleProducts array with the updated one
  const updatedProductsString = JSON.stringify(updatedProducts, null, 2)
    .replace(/"/g, "'")
    .replace(/'([^']+)':/g, '$1:');
    
  content = content.replace(
    /export const sampleProducts: ProductData\[\] = \[[\s\S]*?\];/,
    `export const sampleProducts: ProductData[] = ${updatedProductsString};`
  );
  
  fs.writeFileSync(productsFile, content, 'utf8');
  console.log('Product images and references updated successfully!');
}

// Run the script
updateProductImages().catch(console.error);
