import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: 'ADU Pulse | Real-Time Permit Data for Massachusetts',
  description: 'Track permits across Massachusetts, compare local bylaws to state law, and see which provisions are consistent. Real data, no guesswork.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon-192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="QBGy7R5DcEfbYLKiHrkEp24Ha6tRDMmF4uf74SbvAGY" />
      </head>
      <body className="min-h-screen bg-void">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C22JP3HEV8" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C22JP3HEV8');
          `}
        </Script>
        <ClerkProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  )
}
