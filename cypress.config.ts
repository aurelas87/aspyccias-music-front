import { defineConfig } from 'cypress'
import viteConfig from './vite.config'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    env: {
      mode: viteConfig.mode,
    },
  }
})
