import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { globSync } from "glob";

export default defineConfig({
  build: {
    target: ['ES2015'],
    lib: {
      name: "@gwinkamp/k6-tools",
      entry: globSync("./src/**/*(*.ts|*.js)"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [new RegExp(/^(k6|https?\:\/\/)(\/.*)?/)],
      output: {
        dir: path.resolve(__dirname, "dist"),
        format: "esm",
        preserveModules: true,
        preserveModulesRoot: 'src'
      },
    },
    sourcemap: true,
    minify: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".js"],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: globSync([
            path.resolve(__dirname, "package.json"),
            path.resolve(__dirname, "README.md"),
            path.relative(__dirname, "LICENSE"),
          ]),
          dest: "",
        },
      ],
    }),
    nodeResolve(),
    dts(),
  ],
  esbuild: {
    loader: "ts",
  },
});