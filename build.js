const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const nodeModulesDir = path.join(__dirname, 'node_modules');
const babel = require('@babel/core');

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function transpile(srcFile, outFile){
  const code = fs.readFileSync(srcFile, 'utf8');
  const result = babel.transformSync(code, {
    presets: ['@babel/preset-react']
  });
  fs.writeFileSync(outFile, result.code);
}

fs.rmSync(distDir, { recursive: true, force: true });
copyRecursive(srcDir, distDir);

// select environment configuration
const appEnv = process.env.APP_ENV || 'dev';
const envFile = `config.${appEnv}.js`;
const distEnvPath = path.join(distDir, envFile);
let finalConfig = path.join(distDir, 'config.js');

if (fs.existsSync(distEnvPath)) {
  fs.renameSync(distEnvPath, finalConfig);
} else {
  const fallback = path.join(distDir, 'config.dev.js');
  fs.renameSync(fallback, finalConfig);
}

for (const f of fs.readdirSync(distDir)) {
  if (/^config\.(dev|rec|pro)\.js$/.test(f) && f !== 'config.js') {
    fs.rmSync(path.join(distDir, f));
  }
}

// transpile JSX files
transpile(path.join(srcDir, 'js', 'components.jsx'), path.join(distDir, 'js', 'components.js'));
transpile(path.join(srcDir, 'js', 'app.jsx'), path.join(distDir, 'js', 'app.js'));
fs.rmSync(path.join(distDir, 'js', 'components.jsx'));
fs.rmSync(path.join(distDir, 'js', 'app.jsx'));

// copy runtime packages so dist is self-contained
const packages = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  '@remix-run/router',
  'flag-icons',
  '@fontsource/cinzel',
  '@fortawesome/fontawesome-free'
];
for(const pkg of packages){
  const pkgPath = path.join(nodeModulesDir, pkg);
  copyRecursive(pkgPath, path.join(distDir, 'node_modules', pkg));
}

// rewrite index.html for production
const indexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/..\/node_modules\//g, 'node_modules/');
indexHtml = indexHtml.replace(/<script src=".*@babel\/standalone\/babel.min.js"><\/script>\s*/, '');
indexHtml = indexHtml.replace(/<script type="text\/babel" src="js\/components.jsx"><\/script>/, '<script src="js/components.js"></script>');
indexHtml = indexHtml.replace(/<script type="text\/babel" src="js\/app.jsx"><\/script>/, '<script src="js/app.js"></script>');
fs.writeFileSync(indexPath, indexHtml);

console.log(`Built dist to ${distDir}`);
