import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  server: {
    port: 3000,
    hmr: true,  // Hot module replacement (optional but useful)
  },
  build: {
    outDir: path.resolve(__dirname, "build"), // Output directory for the build
    target: "esnext",
  },
  optimizeDeps: {
    exclude: [],
  },
});
