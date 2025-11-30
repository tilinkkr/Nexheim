const { execSync } = require('child_process');

if (process.env.VERCEL) {
    console.log('Skipping backend install on Vercel');
    process.exit(0);
}

console.log('Installing backend dependencies...');
try {
    execSync('npm install --prefix packages/backend', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to install backend dependencies');
    process.exit(1);
}
