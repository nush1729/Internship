import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // REASON: This is the correct way to set up the API proxy in Vite. It tells the frontend
    // development server to forward any request starting with '/api' to your backend server on port 5000.
    // This is the fix for your login/registration and data fetching failures.
    proxy: {
  '/api': {
    target: 'http://localhost:5001', // Change this to 5001
    changeOrigin: true,
  },
  },
  },
})