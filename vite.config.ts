import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 關鍵設定：使用相對路徑，確保在 GitHub Pages 子目錄下能正確讀取資源
  base: './',
  define: {
    // 在打包時，直接將程式碼中的 process.env.API_KEY 替換成環境變數的實際值
    // JSON.stringify 是必要的，確保它被視為字串
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});