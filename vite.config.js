import { defineConfig } from 'vite'
// 1. Ubah impor ke plugin-react-swc
import react from '@vitejs/plugin-react-swc' 
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // 2. Gunakan plugin 'react()' yang sudah diimpor dari swc
  plugins: [
    react(), 
    tailwindcss()
  ], 
})
