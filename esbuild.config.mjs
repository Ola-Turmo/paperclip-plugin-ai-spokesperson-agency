import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

async function buildAll() {
  await esbuild.build({
    entryPoints: ["src/manifest.ts"],
    bundle: false,
    outfile: "dist/manifest.js",
    format: "esm",
    platform: "node",
    target: "node18",
  });

  await esbuild.build({
    entryPoints: ["src/worker.ts"],
    bundle: true,
    outfile: "dist/worker.js",
    format: "esm",
    platform: "node",
    target: "node18",
    external: ["react", "react-dom"],
    logLevel: "info",
  });

  await esbuild.build({
    entryPoints: ["src/ui/index.tsx"],
    bundle: true,
    outdir: "dist/ui",
    format: "esm",
    platform: "browser",
    target: "chrome120",
    jsx: "automatic",
    external: ["react", "react-dom"],
    loader: { ".tsx": "tsx", ".ts": "ts", ".js": "js" },
    logLevel: "info",
  });

  console.log("Build complete");
}

if (watch) {
  await buildAll();
  const manifestCtx = await esbuild.context({
    entryPoints: ["src/manifest.ts"],
    bundle: false,
    outfile: "dist/manifest.js",
    format: "esm",
    platform: "node",
    target: "node18",
    logLevel: "info",
  });
  const workerCtx = await esbuild.context({
    entryPoints: ["src/worker.ts"],
    bundle: true,
    outfile: "dist/worker.js",
    format: "esm",
    platform: "node",
    target: "node18",
    external: ["react", "react-dom"],
    logLevel: "info",
  });
  const uiCtx = await esbuild.context({
    entryPoints: ["src/ui/index.tsx"],
    bundle: true,
    outdir: "dist/ui",
    format: "esm",
    platform: "browser",
    target: "chrome120",
    jsx: "automatic",
    external: ["react", "react-dom"],
    loader: { ".tsx": "tsx", ".ts": "ts", ".js": "js" },
    logLevel: "info",
  });
  await Promise.all([manifestCtx.watch(), workerCtx.watch(), uiCtx.watch()]);
  await new Promise(() => {});
} else {
  buildAll().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

