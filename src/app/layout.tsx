import type { Metadata, Viewport } from 'next'; // Aggiunto Viewport
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Questa parte dice al browser di che colore colorare la barra superiore del telefono
export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Forno Artigianale',
  description: 'Ordina i migliori prodotti da forno.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Forno App',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon-180x180.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* Questo rimuove il "simbolo del browser" su alcuni vecchi dispositivi Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}