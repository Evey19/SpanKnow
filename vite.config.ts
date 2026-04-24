import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: './', // 确保静态资源路径使用相对路径
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://snapknow-api-250345-7-1332603592.sh.run.tcloudbase.com',
        changeOrigin: true,
      },
    },
  },
})
