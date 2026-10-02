import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// base "./" makes the build work on GitHub Pages under ANY repo name
const singlefile = process.env.SINGLEFILE === "1";

export default defineConfig({
  base: "./",
  plugins: [react(), ...(singlefile ? [viteSingleFile()] : [])],
  build: singlefile
    ? { assetsInlineLimit: 100000000, cssCodeSplit: false, outDir: "dist-preview" }
    : {},
});
