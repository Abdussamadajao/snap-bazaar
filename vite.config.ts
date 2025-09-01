import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

console.log(process.env.API_URL);
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 4050,
    proxy: {
      "/api": {
        target: "https://snap-bazaar-api.onrender.com",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
});
