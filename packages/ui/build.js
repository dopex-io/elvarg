const { build } = require('esbuild');
const { dependencies, peerDependencies } = require('./package.json');

const entryFile = 'src/index.tsx';
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
  logLevel: 'info',
  minify: true,
  sourcemap: true,
};

build({
  ...shared,
  format: 'esm',
  outfile: './dist/index.esm.js',
  target: ['esnext', 'node18'],
});

build({
  ...shared,
  format: 'cjs',
  outfile: './dist/index.cjs.js',
  target: ['esnext', 'node18'],
});
