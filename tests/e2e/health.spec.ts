import { test, expect } from '@playwright/test'

test('health endpoint', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()
  await expect(response.json()).resolves.toEqual({ ok: true })
})
