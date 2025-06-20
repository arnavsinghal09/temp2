import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FireStories',
  description: 'Share your favorite moments from any streaming service with FireStories'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
