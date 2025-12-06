import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 關鍵設定：使用相對路徑，確保在 GitHub Pages 子目錄下能正確讀取資源
  base: './',
  define: {
    // 讓 process.env 在瀏覽器中可被讀取 (用於 API Key)
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});