import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";
// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env
  },
  plugins: [react()],
  esbuild: {
    loader: "jsx"
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  }
});
