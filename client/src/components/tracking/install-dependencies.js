// This is a helper script to install the necessary dependencies for the tracking system
// Run this with node.js: node install-dependencies.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the dependencies needed for the tracking system
const dependencies = [
  '@tensorflow/tfjs',
  '@tensorflow/tfjs-backend-webgl',
  '@tensorflow-models/pose-detection',
  '@tensorflow-models/face-landmarks-detection',
  'face-api.js'
];

// Function to update package.json
function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '../../../../package.json');
  
  try {
    // Read the existing package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if dependencies already exist
    let needsUpdate = false;
    for (const dep of dependencies) {
      if (!packageJson.dependencies[dep]) {
        needsUpdate = true;
        packageJson.dependencies[dep] = "^latest";
      }
    }
    
    if (needsUpdate) {
      // Write the updated package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Updated package.json with new dependencies');
    } else {
      console.log('All dependencies already in package.json');
    }
    
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// Function to install the dependencies
function installDependencies() {
  try {
    console.log('Installing dependencies...');
    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('Dependencies installed successfully');
  } catch (error) {
    console.error('Error installing dependencies:', error);
  }
}

// Function to create the models directory
function createModelsDirectory() {
  const publicDir = path.join(__dirname, '../../../../public');
  const modelsDir = path.join(publicDir, 'models');
  
  if (!fs.existsSync(modelsDir)) {
    try {
      fs.mkdirSync(modelsDir, { recursive: true });
      console.log('Created models directory in public folder');
    } catch (error) {
      console.error('Error creating models directory:', error);
    }
  } else {
    console.log('Models directory already exists');
  }
}

// Main execution
console.log('Setting up AI tracking dependencies...');
updatePackageJson();
installDependencies();
createModelsDirectory();
console.log('Setup complete. You will need to download model files to public/models for face-api.js');
console.log('See https://github.com/justadudewhohacks/face-api.js for model files');
