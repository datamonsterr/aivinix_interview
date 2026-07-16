import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    openapi: '3.1.0',
    info: { title: 'Public API Cache Service', version: '0.1.0' },
    paths: {
      '/api/items': {
        get: {
          summary: 'List item IDs',
          responses: {
            200: { description: 'Item IDs', content: { 'application/json': { schema: { type: 'array', items: { type: 'integer' } }, example: [1, 2, 3] } } },
            502: { description: 'Upstream failure' },
          },
        },
      },
      '/api/items/{id}': {
        get: {
          summary: 'Get item details',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', minimum: 1 } }],
          responses: {
            200: { description: 'Item details', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, description: { type: 'string' } } } } } },
            400: { description: 'Invalid item id' },
            404: { description: 'Item not found' },
            502: { description: 'Upstream failure' },
          },
        },
      },
    },
  })
}
