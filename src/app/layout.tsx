import './globals.css'
import type { Metadata } from 'next'

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
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
