const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '../public/ScreenShot');

async function compressImages() {
  const files = fs.readdirSync(screenshotDir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(screenshotDir, file);
    const tempPath = path.join(screenshotDir, 'temp_' + file);
    
    const originalSize = fs.statSync(inputPath).size;
    
    // 使用更安全的压缩方式
    await sharp(inputPath)
      .resize(1600, null, { withoutEnlargement: true, fit: 'inside' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(tempPath);
    
    const newSize = fs.statSync(tempPath).size;
    
    // 替换原文件
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);
    
    console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  console.log('\nAll screenshots compressed!');
}

compressImages().catch(console.error);

