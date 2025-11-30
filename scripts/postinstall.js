```
const { execSync } = require('child_process');

if (process.env.VERCEL) {
  console.log('Detected Vercel environment.');
  console.log('Installing FRONTEND dependencies...');
  try {
    execSync('npm install --prefix packages/frontend --legacy-peer-deps', { stdio: 'inherit' });
    console.log('Frontend dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install frontend dependencies');
    process.exit(1);
  }
} else {
  console.log('Detected Non-Vercel environment (likely Railway/Local).');
  console.log('Installing BACKEND dependencies...');
  try {
    execSync('npm install --prefix packages/backend', { stdio: 'inherit' });
    console.log('Backend dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install backend dependencies');
    process.exit(1);
  }
}
```
