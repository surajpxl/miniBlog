import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkmode: 'class',
  theme: {
    extend: {},
  },
  plugins: [react(), tailwindcss() ],
  server: {
  port: 5173,
  cors: true,
  open: true,
  host: true, // 👈 important
},
})
