import './globals.css'
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'FoodFlow - Gestion de recettes',
  description: 'Application de gestion de recettes et de planning de repas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
