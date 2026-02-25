import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://shortner-azure.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix - backend routes are at /auth/login
      },
    },
  },
});
