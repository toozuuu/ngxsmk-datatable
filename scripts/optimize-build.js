#!/usr/bin/env node
/**
 * Build Optimization Script
 * Performs additional optimizations on the built library
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/ngxsmk-datatable');

console.log('⚡ Optimizing build output...\n');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ngxsmk-datatable not found. Please run npm run build:lib first.');
  process.exit(1);
}

// Remove source maps in production if needed
function removeSourceMaps() {
  console.log('🗑️  Removing source maps...');
  const removeFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        removeFiles(filePath);
      } else if (file.endsWith('.map')) {
        fs.unlinkSync(filePath);
        console.log(`  ✅ Removed: ${file}`);
      }
    });
  };
  
  removeFiles(distPath);
}

// Optimize package.json
function optimizePackageJson() {
  console.log('\n📦 Optimizing package.json...');
  const packageJsonPath = path.join(distPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove unnecessary fields
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('  ✅ package.json optimized');
}

try {
  // Uncomment if you want to remove source maps in production
  // removeSourceMaps();
  
  optimizePackageJson();
  
  console.log('\n✅ Build optimization complete!');
} catch (error) {
  console.error('❌ Error during optimization:', error.message);
  process.exit(1);
}

