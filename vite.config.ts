import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON=="true" ? './' : "/",
  server: {
    port: 3000
  }
})