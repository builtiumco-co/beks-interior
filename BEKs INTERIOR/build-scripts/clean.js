const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const OPTIMIZED_DIR = path.join(PROJECT_ROOT, 'images', 'optimized');

/**
 * Recursively delete directory
 */
function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirectory(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

/**
 * Delete file if exists
 */
function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

console.log('🧹 Cleaning build artifacts...\n');

let deletedCount = 0;

// Delete optimized images
if (fs.existsSync(OPTIMIZED_DIR)) {
    console.log('   🗑️  Deleting optimized images...');
    deleteDirectory(OPTIMIZED_DIR);
    deletedCount++;
}

// Delete minified CSS
if (deleteFile(path.join(PROJECT_ROOT, 'style.min.css'))) {
    console.log('   🗑️  Deleted style.min.css');
    deletedCount++;
}

// Delete minified JS
if (deleteFile(path.join(PROJECT_ROOT, 'script.min.js'))) {
    console.log('   🗑️  Deleted script.min.js');
    deletedCount++;
}

// Delete critical CSS
if (deleteFile(path.join(PROJECT_ROOT, 'critical.css'))) {
    console.log('   🗑️  Deleted critical.css');
    deletedCount++;
}

if (deletedCount === 0) {
    console.log('   ℹ️  Nothing to clean - no build artifacts found');
} else {
    console.log(`\n✨ Cleaned ${deletedCount} item(s)`);
}

console.log('\n💡 Run "npm run build" to regenerate optimized files\n');
