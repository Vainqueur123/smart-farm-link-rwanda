const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  { name: 'maize.jpg', url: 'https://images.unsplash.com/photo-1601593768790-7e4a4c9f4b3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'coffee.jpg', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'tea.jpg', url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'potatoes.jpg', url: 'https://images.unsplash.com/photo-1518977676601-b53fcc967d48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { name: 'beans.jpg', url: 'https://images.unsplash.com/photo-1586201375761-83865001e8c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download each image
images.forEach(({ name, url }) => {
  const filePath = path.join(imagesDir, name);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    response.pipe(file);
    console.log(`Downloaded ${name}`);
  }).on('error', (err) => {
    console.error(`Error downloading ${name}:`, err.message);
  });
});

console.log('Finished downloading product images!');
