import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RezeptApp – Digitale Rezeptsammlung mit KI',
    template: '%s | RezeptApp',
  },
  description: 'Handgeschriebene Rezepte in Sekunden digitalisieren, verwalten und teilen. KI-gestützte Rezepterkennung, intelligente Portionsberechnung und rollenbasierte Zusammenarbeit. PWA für iOS & Android.',
  keywords: [
    'Rezepte digitalisieren',
    'Rezept App',
    'KI Rezepterkennung',
    'Rezeptverwaltung',
    'digitale Rezeptsammlung',
    'Kochrezepte App',
    'Rezepte scannen',
    'PWA Rezepte',
    'Portionsrechner',
    'Gastronomie Software',
    'Küche digitalisieren',
    'Rezeptbuch digital',
    'handgeschriebene Rezepte',
    'GPT Rezepte',
    'Schweiz Gastronomie',
  ],
  authors: [{ name: 'Lweb Schweiz', url: 'https://www.lweb.ch' }],
  creator: 'Lweb Schweiz',
  publisher: 'Lweb Schweiz',
  generator: 'Next.js',
  applicationName: 'RezeptApp',
  category: 'food',
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    siteName: 'RezeptApp',
    title: 'RezeptApp – Digitale Rezeptsammlung mit KI',
    description: 'Handgeschriebene Rezepte in Sekunden digitalisieren, verwalten und teilen. KI-gestützte Rezepterkennung und intelligente Portionsberechnung.',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'RezeptApp Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RezeptApp – Digitale Rezeptsammlung mit KI',
    description: 'Handgeschriebene Rezepte in Sekunden digitalisieren, verwalten und teilen. Powered by GPT.',
    images: ['/icon-512x512.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RezeptApp',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563EB',
    'msapplication-TileImage': '/icon-144x144.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
