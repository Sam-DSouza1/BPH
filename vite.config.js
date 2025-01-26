import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['@tensorflow/tfjs'],
  },
  build: {
    commonjsOptions: {
      include: ["@tensorflow/tfjs", /node_modules/],
    },
  },
  plugins: [
  ],
})