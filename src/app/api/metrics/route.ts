import { NextResponse } from 'next/server'
import { metrics } from '../../../lib/server/metrics'

export async function GET() {
  return new NextResponse(metrics.render(), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
