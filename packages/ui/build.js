const { build } = require("esbuild");
const { dependencies } = require("./package.json");

const entryFile = "src/index.ts";
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external: ["react", "react-dom", ...Object.keys(dependencies)],
  logLevel: "info",
  minify: true,
  sourcemap: true,
};

build({
  ...shared,
  format: "esm",
  outfile: "./dist/index.esm.js",
  target: ["esnext", "node18"],
});

build({
  ...shared,
  format: "cjs",
  outfile: "./dist/index.cjs.js",
  target: ["esnext", "node18"],
});
