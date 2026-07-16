import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:8080',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://127.0.0.1:8080/api/health',
    reuseExistingServer: true,
  },
})
