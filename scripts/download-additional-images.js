const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  // Fruits
  { name: 'mango.jpg', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'banana.jpg', url: 'https://images.unsplash.com/photo-1571771574823-349f6f0bf204?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'apple.jpg', url: 'https://images.unsplash.com/photo-1567306226416-4f2896be0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'avocado.jpg', url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'pineapple.jpg', url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Vegetables
  { name: 'tomato.jpg', url: 'https://images.unsplash.com/photo-1592841200221-1907caa36f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'onion.jpg', url: 'https://images.unsplash.com/photo-1580207672855-f507b4330b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'cabbage.jpg', url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'carrot.jpg', url: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'spinach.jpg', url: 'https://images.unsplash.com/photo-1576045057995-568f4c2e11e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  
  // Additional crops
  { name: 'irish_potatoes.jpg', url: 'https://images.unsplash.com/photo-1518977676601-b53fcc967d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'sweet_potato.jpg', url: 'https://images.unsplash.com/photo-1601297183305-6a0b0c2dba66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'cassava.jpg', url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'passion_fruit.jpg', url: 'https://images.unsplash.com/photo-1591462655503-2d5ab3b3b88b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
];

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download each image
images.forEach(({ name, url }) => {
  const filePath = path.join(imagesDir, name);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${name} - already exists`);
    return;
  }
  
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    response.pipe(file);
    console.log(`Downloaded ${name}`);
  }).on('error', (err) => {
    console.error(`Error downloading ${name}:`, err.message);
  });
});

console.log('Finished downloading additional product images!');
