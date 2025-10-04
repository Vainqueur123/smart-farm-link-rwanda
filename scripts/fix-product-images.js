const fs = require('fs');
const path = require('path');
const https = require('https');

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
  irish_potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  sweet_potato: 'https://images.unsplash.com/photo-1596124579925-2b30f59d3a7a?w=800&auto=format&fit=crop&q=80',
  cassava: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
  apple: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop&q=80',
  avocado: 'https://images.unsplash.com/photo-1585237672819-39029e3a4044?w=800&auto=format&fit=crop&q=80',
  pineapple: 'https://images.unsplash.com/photo-1550258987-1a16b2c9b5e8?w=800&auto=format&fit=crop&q=80',
  passion_fruit: 'https://images.unsplash.com/photo-1598230639631-2f3da6f0ff7e?w=800&auto=format&fit=crop&q=80',
  cabbage: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80',
  carrot: 'https://images.unsplash.com/photo-1447175008436-05417c79c6f5?w=800&auto=format&fit=crop&q=80',
  spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f7fb3?w=800&auto=format&fit=crop&q=80',
  garlic: 'https://images.unsplash.com/photo-1606813907291-d0e8e0a1a9c1?w=800&auto=format&fit=crop&q=80',
  ginger: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
  turmeric: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'
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

// Function to get all product types from the products.ts file
function getProductTypes() {
  const productsFile = path.join(__dirname, '../lib/products.ts');
  const content = fs.readFileSync(productsFile, 'utf8');
  
  // Extract product categories from the productCategories array
  const categoriesMatch = content.match(/export const productCategories = \[([\s\S]*?)\];/);
  if (!categoriesMatch) return [];
  
  const categoriesContent = categoriesMatch[1];
  const typeMatches = categoriesContent.matchAll(/id: '([^']+)'/g);
  const types = [];
  
  for (const match of typeMatches) {
    if (match[1] !== 'all') {
      types.push(match[1]);
    }
  }
  
  return types;
}

// Main function to download all product images
async function downloadAllImages() {
  const productTypes = getProductTypes();
  console.log('Found product types:', productTypes);
  
  for (const type of productTypes) {
    const imageUrl = imageUrls[type];
    if (!imageUrl) {
      console.warn(`No image URL found for product type: ${type}`);
      continue;
    }
    
    const imageName = `${type}.jpg`;
    const imagePath = path.join(imagesDir, imageName);
    
    if (!fs.existsSync(imagePath)) {
      try {
        console.log(`Downloading image for ${type}...`);
        await downloadImage(imageUrl, imagePath);
        console.log(`Downloaded ${imageName}`);
      } catch (error) {
        console.error(`Error downloading image for ${type}:`, error.message);
      }
    } else {
      console.log(`Image already exists: ${imageName}`);
    }
  }
  
  console.log('All images have been processed!');
}

// Run the script
downloadAllImages().catch(console.error);
