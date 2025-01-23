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
    outDir: path.resolve(__dirname, "build"),
  },
});
