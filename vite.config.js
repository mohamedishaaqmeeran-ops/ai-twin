import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5173,
  },

  build: {
    sourcemap: false,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) {
              return "router";
            }

            if (id.includes("react-redux")) {
              return "redux";
            }

            if (id.includes("@reduxjs")) {
              return "redux";
            }

            if (id.includes("lucide-react")) {
              return "icons";
            }

            if (id.includes("react-toastify")) {
              return "toast";
            }

            return "vendor";
          }
        },
      },
    },
  },
});