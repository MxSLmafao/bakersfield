import type { Metadata, Viewport } from 'next';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/700.css';
import '@fontsource-variable/dm-sans/index.css';
import './globals.css';
import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Bakersfield',
  description: 'Bakersfield is a bakery. Follow the croissant from flour to oven.',
  // Favicon and Apple icon come from src/app/icon.png and src/app/apple-icon.png.
  appleWebApp: {
    title: 'Bakersfield',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f6e7ca',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
