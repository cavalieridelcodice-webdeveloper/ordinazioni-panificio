import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forno Artigianale - Ordini Online',
  description: 'Ordina i migliori prodotti da forno.',
  icons: {
    icon: '/favicon.ico', // Questo cerca il file public/favicon.ico
    apple: '/apple-icon-180x180.png', // Aggiungi anche questo per sicurezza
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}