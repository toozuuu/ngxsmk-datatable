#!/usr/bin/env node
/**
 * Bundle Analyzer Script
 * Analyzes the built library bundle size and composition
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/ngxsmk-datatable');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ngxsmk-datatable not found. Please run npm run build:lib first.');
  process.exit(1);
}

console.log('📊 Analyzing ngxsmk-datatable bundle...\n');

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

function analyzeDirectory(dir) {
  let totalSize = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile() && file.endsWith('.js')) {
      const size = getFileSize(filePath);
      totalSize += parseFloat(size);
      console.log(`  📄 ${file}: ${size} KB`);
    }
  });
  
  return totalSize;
}

try {
  console.log('Main bundles:');
  const totalSize = analyzeDirectory(path.join(distPath, 'fesm2022'));
  
  console.log(`\n✅ Total bundle size: ${totalSize.toFixed(2)} KB`);
  
  if (totalSize > 500) {
    console.log('\n⚠️  Warning: Bundle size is quite large. Consider code splitting or tree-shaking.');
  } else if (totalSize < 200) {
    console.log('\n🎉 Excellent! Bundle size is very good.');
  } else {
    console.log('\n✅ Bundle size is reasonable.');
  }
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}

