import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// 读取 package.json 获取版本号
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/allcare-system/',
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version)
  },
  build: {
    // 生成内容哈希的文件名
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 每次构建前清除目录
    emptyOutDir: true
  }
})
