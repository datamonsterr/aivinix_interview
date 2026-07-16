type Fields = Record<string, unknown>

const write = (level: string, event: string, fields: Fields = {}) => {
  process.stdout.write(`${JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields })}\n`)
}

export const log = {
  info: (event: string, fields?: Fields) => write('info', event, fields),
  warn: (event: string, fields?: Fields) => write('warn', event, fields),
  error: (event: string, fields?: Fields) => write('error', event, fields),
}
