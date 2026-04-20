import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.9] },
      webp: { quality: 75 }
    }),
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],

  build: {
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  }
})