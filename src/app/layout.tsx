import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Banana Bomb',
  description: '1v1 banana grid battle',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
