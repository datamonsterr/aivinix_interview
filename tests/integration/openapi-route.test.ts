import { describe, expect, it } from 'vitest'
import { GET } from '../../src/app/api/openapi/route'

describe('GET /api/openapi', () => {
  it('documents paths, params, and error responses', async () => {
    const response = await GET()
    const body = await response.json()

    expect(body.openapi).toBe('3.1.0')
    expect(body.paths['/api/items'].get.responses['200'].content['application/json'].example).toEqual([1, 2, 3])
    expect(body.paths['/api/items/{id}'].get.parameters).toEqual([
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'integer', minimum: 1 },
      },
    ])
    expect(body.paths['/api/items/{id}'].get.responses['404'].description).toBe('Item not found')
    expect(body.paths['/api/items/{id}'].get.responses['502'].description).toBe('Upstream failure')
  })
})
