import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Permite usar no Vercel a mesma variável pública do ecossistema Next.js.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
