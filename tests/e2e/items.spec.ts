import { test, expect } from '@playwright/test'

test('items endpoints', async ({ request }) => {
  const list = await request.get('/api/items')
  expect(list.ok()).toBeTruthy()
  expect(list.headers()['x-cache']).toBeTruthy()
  const ids = await list.json()
  expect(Array.isArray(ids)).toBeTruthy()
  expect(ids.length).toBeGreaterThan(0)

  const detail = await request.get(`/api/items/${ids[0]}`)
  expect(detail.ok()).toBeTruthy()
  await expect(detail.json()).resolves.toMatchObject({
    id: ids[0],
    name: expect.any(String),
    description: expect.any(String),
  })
})

test('invalid item id returns 400', async ({ request }) => {
  const response = await request.get('/api/items/nope')
  expect(response.status()).toBe(400)
  await expect(response.json()).resolves.toEqual({ error: 'Invalid item id' })
})
