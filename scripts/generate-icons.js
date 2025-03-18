const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  icon: 1024,
  'adaptive-icon': 1024,
  splash: 2048,
  favicon: 196,
};

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../assets/icon.svg'));

  for (const [name, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../assets/${name}.png`));

    console.log(`Generated ${name}.png (${size}x${size})`);
  }
}

generateIcons().catch(console.error);
