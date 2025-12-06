import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 自動載入 .env 檔案中的變數
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // 解決 GitHub Pages 白畫面的關鍵設定
    base: './',
    define: {
      // 將讀取到的 API_KEY 注入到程式碼中
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    }
  };
});
