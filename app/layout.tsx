import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lentera Abhesa - Menjaga Bahasa, Merawat Identitas',
  description: 'Platform digital untuk melestarikan bahasa dan budaya lokal Indonesia',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  // Tambahkan ini agar saat di-share ke WhatsApp/Sosmed logonya ikut ganti
  openGraph: {
    title: 'Lentera Abhesa - Menjaga Bahasa, Merawat Identitas',
    description: 'Platform digital untuk melestarikan bahasa dan budaya lokal Indonesia',
    url: 'https://lenteraabhesa.vercel.app',
    siteName: 'Lentera Abhesa',
    images: [
      {
        url: 'https://lenteraabhesa.vercel.app/icon.png', // Harus URL absolut/lengkap agar dibaca WhatsApp
        width: 1200,
        height: 630,
        alt: 'Lentera Abhesa App Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lentera Abhesa - Menjaga Bahasa, Merawat Identitas',
    description: 'Platform digital untuk melestarikan bahasa dan budaya lokal Indonesia',
    images: ['https://lenteraabhesa.vercel.app/icon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} bg-white`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
