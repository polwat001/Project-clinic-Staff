import type { Metadata } from 'next'
import { Noto_Sans_Thai, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansThai = Noto_Sans_Thai({ subsets: ['thai', 'latin'], variable: '--font-noto-sans-thai' })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Carbon Magic - Manufacturing Dashboard',
  description: 'Real-time factory monitoring and production management system',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/iconmeme.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/iconmeme.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/iconmeme.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
