const fs = require('fs');
const path = require('path');

if (process.env.WITA_SKIP_NODE_CHECK === '1') {
  process.exit(0);
}

const [major, minor] = process.versions.node.split('.').map(Number);
const tooOld = major < 20 || (major === 20 && minor < 9);
const tooNew = major >= 25;

if (tooOld) {
  console.error('\n[WITA] Unsupported Node.js runtime for this project.');
  console.error(`[WITA] Current: v${process.versions.node}`);
  console.error('[WITA] Required: >=20.9 and <25 (recommended: Node 22 LTS).');
  console.error('\nUse:');
  console.error('  nvm install 22');
  console.error('  nvm use 22');
  console.error('\nIf nvm is not installed, use Homebrew:');
  console.error('  brew install node@22');
  console.error('  export PATH="$(brew --prefix node@22)/bin:$PATH"');
  console.error('  npm install');
  console.error('  npm run dev:clean\n');
  process.exit(1);
}

if (tooNew) {
  console.warn('\n[WITA] Warning: this project is tested on Node >=20.9 and <25.');
  console.warn(`[WITA] Current: v${process.versions.node}`);
  console.warn('[WITA] Continuing anyway, but if you see unstable dev behavior use Node 22 LTS.\n');
}

const nextBin = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
if (!fs.existsSync(nextBin)) {
  console.error('\n[WITA] Missing local Next.js binary.');
  console.error('[WITA] Run: npm install\n');
  process.exit(1);
}
