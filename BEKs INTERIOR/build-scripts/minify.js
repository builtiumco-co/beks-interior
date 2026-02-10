const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: terserMinify } = require('terser');

const PROJECT_ROOT = path.join(__dirname, '..');

/**
 * Minify CSS files
 */
async function minifyCSS() {
    console.log('\n📦 Minifying CSS...');

    const cssFile = path.join(PROJECT_ROOT, 'style.css');
    const outputFile = path.join(PROJECT_ROOT, 'style.min.css');

    try {
        const source = fs.readFileSync(cssFile, 'utf8');
        const originalSize = Buffer.byteLength(source, 'utf8');

        const result = new CleanCSS({
            level: 2,
            compatibility: 'ie11'
        }).minify(source);

        if (result.errors.length > 0) {
            console.error('❌ CSS minification errors:', result.errors);
            return;
        }

        fs.writeFileSync(outputFile, result.styles, 'utf8');
        const minifiedSize = Buffer.byteLength(result.styles, 'utf8');
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

        console.log(`   ✅ style.css → style.min.css`);
        console.log(`   📊 ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% smaller)`);

        if (result.warnings.length > 0) {
            console.log(`   ⚠️  Warnings: ${result.warnings.join(', ')}`);
        }

    } catch (error) {
        console.error('❌ Error minifying CSS:', error.message);
    }
}

/**
 * Minify JavaScript files
 */
async function minifyJS() {
    console.log('\n📦 Minifying JavaScript...');

    const jsFile = path.join(PROJECT_ROOT, 'script.js');
    const outputFile = path.join(PROJECT_ROOT, 'script.min.js');

    try {
        const source = fs.readFileSync(jsFile, 'utf8');
        const originalSize = Buffer.byteLength(source, 'utf8');

        const result = await terserMinify(source, {
            compress: {
                dead_code: true,
                drop_console: false, // Keep console for debugging
                drop_debugger: true,
                pure_funcs: ['console.log'] // Remove console.log in production
            },
            mangle: {
                toplevel: false
            },
            format: {
                comments: false
            }
        });

        if (result.error) {
            console.error('❌ JS minification error:', result.error);
            return;
        }

        fs.writeFileSync(outputFile, result.code, 'utf8');
        const minifiedSize = Buffer.byteLength(result.code, 'utf8');
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

        console.log(`   ✅ script.js → script.min.js`);
        console.log(`   📊 ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% smaller)`);

    } catch (error) {
        console.error('❌ Error minifying JavaScript:', error.message);
    }
}

/**
 * Main minification process
 */
async function main() {
    console.log('🚀 Starting minification process...');
    console.log('═══════════════════════════════════════════════════════');

    await minifyCSS();
    await minifyJS();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('\n✨ Minification complete!');
    console.log('\n💡 Minified files created:');
    console.log('   • style.min.css');
    console.log('   • script.min.js\n');
}

// Run minification
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
