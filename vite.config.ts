import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import downloadAssetsPlugin from './vite-plugin-download-assets'; // <- import it

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    downloadAssetsPlugin(),
    react()
  ],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});