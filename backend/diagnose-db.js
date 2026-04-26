import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

console.log('=== MongoDB Connection Diagnostic ===\n');

if (!uri) {
    console.log('❌ MONGO_URI is NOT SET in backend/.env');
    console.log('   Add this line to backend/.env:');
    console.log('   MONGO_URI=mongodb+srv://username:password@cluster...');
    process.exit(1);
}

// Mask password for safe display
const maskedUri = uri.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@)/, '$1****$3');
console.log('✅ MONGO_URI is set');
console.log('   URI:', maskedUri);
console.log('');

// Check for common issues
const issues = [];

if (uri.includes(' ')) {
    issues.push('❌ URI contains spaces - remove them');
}

if (uri.includes('"') || uri.includes("'")) {
    issues.push('❌ URI contains quotes - remove them from .env file');
}

if (uri.includes('\n')) {
    issues.push('❌ URI contains newlines - keep it on one line');
}

const hasSpecialChars = /:[^@]*[@:!\/\?#\[\]$&'()*+,;=]/.test(uri);
if (hasSpecialChars) {
    issues.push('⚠️  URI may contain unescaped special characters in password');
    issues.push('   If your password has @ : / ? # [ ] ! $ & \' ( ) * + , ; =');
    issues.push('   you MUST URL-encode them. Example: @ -> %40');
}

if (issues.length > 0) {
    console.log('Issues found:');
    issues.forEach(i => console.log('  ' + i));
    console.log('');
}

// Test actual connection
console.log('Attempting to connect...\n');

try {
    const mongoose = await import('mongoose');
    await mongoose.default.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB Connected Successfully!');
    await mongoose.default.disconnect();
    process.exit(0);
} catch (err) {
    console.log('❌ Connection failed:');
    console.log('   Error:', err.message);
    console.log('   Code:', err.code || 'N/A');
    console.log('   CodeName:', err.codeName || 'N/A');
    console.log('');

    if (err.message.includes('bad auth')) {
        console.log('→ This is an AUTHENTICATION error.');
        console.log('  1. Check your password in MongoDB Atlas (Database Access)');
        console.log('  2. Make sure special chars in password are URL-encoded');
        console.log('  3. Verify your Atlas cluster is active (not paused)');
        console.log('  4. Check Network Access - add your current IP: 0.0.0.0/0');
    }

    if (err.message.includes('IP')) {
        console.log('→ This is a NETWORK ACCESS error.');
        console.log('  Go to Atlas → Network Access → Add Current IP Address');
    }

    process.exit(1);
}

