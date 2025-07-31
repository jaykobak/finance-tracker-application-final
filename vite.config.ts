import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    visualizer({
      filename: './dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     if (id.includes('react')) {
        //       return 'vendor_react';
        //     }
        //     if (id.includes('@radix-ui')) {
        //       return 'vendor_radix';
        //     }
        //     if (id.includes('shadcn')) {
        //       return 'vendor_shadcn';
        //     }
        //     if (id.includes('lodash')) {
        //       return 'vendor_lodash';
        //     }
        //     if (id.includes('date-fns')) {
        //       return 'vendor_datefns';
        //     }
        //     if (id.includes('recharts')) {
        //       return 'vendor_recharts';
        //     }
        //     return 'vendor_misc';
        //   }
        // }
      }
    }
  },
}));
