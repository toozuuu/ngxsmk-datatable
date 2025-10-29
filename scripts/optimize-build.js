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

// Remove unnecessary files
function cleanupFiles() {
  console.log('\n🧹 Cleaning up unnecessary files...');
  const filesToRemove = [
    'README.md.bak',
    '.DS_Store',
    'Thumbs.db'
  ];
  
  const removeFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        removeFiles(filePath);
      } else if (filesToRemove.includes(file)) {
        fs.unlinkSync(filePath);
        console.log(`  ✅ Removed: ${file}`);
      }
    });
  };
  
  removeFiles(distPath);
}

// Verify sideEffects flag
function verifySideEffects() {
  console.log('\n🔍 Verifying sideEffects configuration...');
  const packageJsonPath = path.join(distPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.sideEffects === false) {
    console.log('  ✅ sideEffects: false (optimal for tree-shaking)');
  } else if (!packageJson.sideEffects) {
    packageJson.sideEffects = false;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('  ✅ Added sideEffects: false');
  }
}

// Display bundle size summary
function showBundleSize() {
  console.log('\n📊 Bundle Size Summary:');
  const fesmPath = path.join(distPath, 'fesm2022');
  
  if (fs.existsSync(fesmPath)) {
    const files = fs.readdirSync(fesmPath);
    let totalSize = 0;
    
    files.forEach(file => {
      if (file.endsWith('.js') && !file.endsWith('.map')) {
        const filePath = path.join(fesmPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += parseFloat(sizeKB);
        console.log(`  📦 ${file}: ${sizeKB} KB`);
      }
    });
    
    console.log(`\n  Total: ${totalSize.toFixed(2)} KB`);
    
    if (totalSize > 500) {
      console.log('  ⚠️  Consider code splitting for large bundle');
    } else {
      console.log('  ✅ Bundle size is optimal');
    }
  }
}

try {
  // Run optimizations in production mode only
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    removeSourceMaps();
  }
  
  optimizePackageJson();
  cleanupFiles();
  verifySideEffects();
  showBundleSize();
  
  console.log('\n✨ Build optimization complete!\n');
} catch (error) {
  console.error('❌ Error during optimization:', error.message);
  process.exit(1);
}

