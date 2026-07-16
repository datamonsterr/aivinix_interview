import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public API Cache Service',
  description: 'PokéAPI-backed cached item service',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
