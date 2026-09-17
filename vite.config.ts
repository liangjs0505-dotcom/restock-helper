import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages 项目站点需要仓库名作为公共路径
  base: command === 'build' ? '/restock-helper/' : '/',
}))
