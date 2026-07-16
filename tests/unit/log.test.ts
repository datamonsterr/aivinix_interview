import { describe, expect, it } from 'vitest'
import { log } from '../../src/lib/server/log'

describe('log', () => {
  it('writes structured json line', () => {
    let output = ''
    const write = process.stdout.write
    process.stdout.write = ((chunk: string | Uint8Array) => {
      output += String(chunk)
      return true
    }) as typeof process.stdout.write

    try {
      log.info('cache_hit', { cache: 'HIT', route: '/api/items' })
    } finally {
      process.stdout.write = write
    }

    const line = JSON.parse(output.trim())
    expect(line.level).toBe('info')
    expect(line.event).toBe('cache_hit')
    expect(line.cache).toBe('HIT')
    expect(line.route).toBe('/api/items')
    expect(line.ts).toBeTypeOf('string')
  })
})
