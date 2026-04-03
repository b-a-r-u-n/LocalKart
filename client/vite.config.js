import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // server: {
  //   host: true,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:5000",
  //       changeOrigin: true,
  //       secure: false
  //     },
  //   },
  // },
  server: {
    allowedHosts: [
      "partnerships-developed-pour-election.trycloudflare.com"
    ]
  },
  plugins: [react(), tailwindcss()],
})