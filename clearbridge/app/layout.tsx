import type { Metadata } from 'next';
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import ThemeProvider from '@/components/layout/ThemeProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-header',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ClearBridge',
  description:
    'ClearBridge makes spoken and digital content accessible for people with vision or hearing disabilities. Live captions, summaries, and structured output for real learning environments.',
  keywords: ['accessibility', 'hearing disability', 'vision disability', 'live captions', 'transcription'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${plusJakarta.variable} font-sans antialiased bg-white text-gray-900 min-h-screen`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <Header />
          <main id="main-content" className="min-h-[calc(100vh-4rem)]" tabIndex={-1}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
