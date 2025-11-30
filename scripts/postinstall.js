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
} else if (process.env.RAILWAY_ENVIRONMENT) {
  console.log('Detected Railway environment.');
  console.log('Installing BACKEND dependencies...');
  try {
    execSync('npm install --prefix packages/backend', { stdio: 'inherit' });
    console.log('Backend dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install backend dependencies');
    process.exit(1);
  }
} else {
  console.log('Detected Local environment.');
  console.log('Installing BOTH Frontend and Backend dependencies...');
  try {
    console.log('--- Backend ---');
    execSync('npm install --prefix packages/backend', { stdio: 'inherit' });
    console.log('--- Frontend ---');
    execSync('npm install --prefix packages/frontend --legacy-peer-deps', { stdio: 'inherit' });
    console.log('All dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install dependencies');
    process.exit(1);
  }
}
