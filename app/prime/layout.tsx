import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Header from "./components/layout/Header"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "PrimeClone - Stream Movies & TV Shows",
    template: "%s | PrimeClone",
  },
  description: "Watch thousands of movies and TV shows with PrimeClone - Your premium streaming destination",
  keywords: ["streaming", "movies", "tv shows", "prime video", "entertainment"],
  authors: [{ name: "PrimeClone" }],
  creator: "PrimeClone",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://primeclone.vercel.app",
    title: "PrimeClone - Stream Movies & TV Shows",
    description: "Watch thousands of movies and TV shows with PrimeClone",
    siteName: "PrimeClone",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeClone - Stream Movies & TV Shows",
    description: "Watch thousands of movies and TV shows with PrimeClone",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0F171E] text-white antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
