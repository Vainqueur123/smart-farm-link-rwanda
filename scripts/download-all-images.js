const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Product images to download
const productImages = [
  // Staple Crops
  { name: 'maize.jpg', url: 'https://images.unsplash.com/photo-1601593768790-7e4a4c9f4b3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'rice.jpg', url: 'https://images.unsplash.com/photo-1586201375761-83865001e8c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'beans.jpg', url: 'https://images.unsplash.com/photo-1594282486552-8ad67c6b94ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'irish_potatoes.jpg', url: 'https://images.unsplash.com/photo-1518977676601-b53fcc967d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'sweet_potato.jpg', url: 'https://images.unsplash.com/photo-1601297183305-6a0b0c2dba66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'cassava.jpg', url: 'https://images.unsplash.com/photo-1594810203659-904e2d6e2b10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Fruits
  { name: 'mango.jpg', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'banana.jpg', url: 'https://images.unsplash.com/photo-1571771574823-349f6f0bf204?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'apple.jpg', url: 'https://images.unsplash.com/photo-1567306226416-4f2896be0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'avocado.jpg', url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'pineapple.jpg', url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'passion_fruit.jpg', url: 'https://images.unsplash.com/photo-1591462655503-2d5ab3b3b88b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Vegetables
  { name: 'tomato.jpg', url: 'https://images.unsplash.com/photo-1592841200221-1907caa36f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'onion.jpg', url: 'https://images.unsplash.com/photo-1580207672855-f507b433b2b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'cabbage.jpg', url: 'https://images.unsplash.com/photo-1571771574823-349f6f0bf204?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'carrot.jpg', url: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'spinach.jpg', url: 'https://images.unsplash.com/photo-1576045057995-568f4c2e11e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Cash Crops
  { name: 'coffee.jpg', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'tea.jpg', url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Spices
  { name: 'chili.jpg', url: 'https://images.unsplash.com/photo-1518633620420-bd35e38f2126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'garlic.jpg', url: 'https://images.unsplash.com/photo-1600716059458-db1688af9b1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'ginger.jpg', url: 'https://images.unsplash.com/photo-1603906341040-5a7b2a4a1b2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'turmeric.jpg', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
];

// Function to download a single image
function downloadImage({ name, url }) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, name);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${name} - already exists`);
      return resolve();
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${name}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${name}:`, err.message);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting image download...');
  
  try {
    // Download images in parallel with a concurrency limit
    const concurrencyLimit = 5;
    for (let i = 0; i < productImages.length; i += concurrencyLimit) {
      const batch = productImages.slice(i, i + concurrencyLimit);
      await Promise.all(batch.map(downloadImage));
    }
    
    console.log('\nAll images downloaded successfully!');
    console.log(`Images saved to: ${imagesDir}`);
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

// Run the download
downloadAllImages();
