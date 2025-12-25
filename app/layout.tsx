import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anime Filter - Transforme suas fotos',
  description: 'Aplique filtros de anime em suas fotos instantaneamente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
