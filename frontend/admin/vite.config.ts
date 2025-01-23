import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", 
  server: {
    port: 3000,
  },
  build: {
    outDir: path.resolve(__dirname, "build"), // Build output folder
  },
  base: "/", // Set the base URL to match your deployment setup
});
