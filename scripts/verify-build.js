import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = (command) => {
  execSync(command, { stdio: 'inherit' });
};

const distDir = path.resolve(__dirname, '../dist');
const assetsDir = path.join(distDir, 'assets');
const MAX_BUNDLE_SIZE = 5 * 1024 * 1024; // 5 MB heuristic cap

try {
  run('npx vite build');

  if (!fs.existsSync(distDir)) {
    throw new Error('Build failed: dist directory not found');
  }

  let totalSize = 0;
  if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    assets.forEach((asset) => {
      const assetPath = path.join(assetsDir, asset);
      const stats = fs.statSync(assetPath);
      if (stats.isFile()) {
        totalSize += stats.size;
      }
    });
  }

  if (totalSize > MAX_BUNDLE_SIZE) {
    throw new Error(`Bundle size ${totalSize} exceeds threshold ${MAX_BUNDLE_SIZE}`);
  }

  console.log('Build verification passed. Total bundle size:', totalSize);
} catch (error) {
  console.error('Build verification failed:', error);
  process.exit(1);
}
