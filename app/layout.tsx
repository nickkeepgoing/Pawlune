import type { Metadata, Viewport } from 'next';
import { Anuphan, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { THEME_INIT } from '@/components/ThemeToggle';

const anuphan = Anuphan({ subsets: ['thai', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-anuphan', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });

export const metadata: Metadata = {
  title: 'Pawlune — More Than Adoption. A Better Bond.',
  description: 'บันทึกวันละ 10 วินาที แล้วดูว่าเวลาแบบไหนกับน้อง ไปด้วยกันกับวันดีของคุณ',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EADC' },
    { media: '(prefers-color-scheme: dark)', color: '#191310' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${anuphan.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint — no flash of the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
