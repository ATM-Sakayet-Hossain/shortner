import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: "https://shortner-server.vercel.app",
        changeOrigin: true,
        secure: false,
      },
      "/shorturl": {
        target: "https://shortner-server.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
