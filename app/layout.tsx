import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Thai_Looped, Mali } from 'next/font/google';
import './globals.css';
import { THEME_INIT } from '@/components/ThemeToggle';

// Body: looped Thai reads clearly at small sizes. Titles and numbers: Mali, rounded and soft. Both are OFL.
const body = IBM_Plex_Sans_Thai_Looped({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });
const display = Mali({ subsets: ['thai', 'latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'Pawlune — More Than Adoption. A Better Bond.',
  description: 'บันทึกวันละ 10 วินาที แล้วดูว่าเวลาแบบไหนกับน้อง ไปด้วยกันกับวันดีของคุณ',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#F3EADC',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint — no flash of the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
