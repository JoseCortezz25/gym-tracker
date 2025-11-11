import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: {
    default: 'Gym Tracker - Track Every Rep, Build Real Progress',
    template: '%s | Gym Tracker'
  },
  description:
    'The complete training system for serious lifters who want structured workouts, measurable results, and zero BS. Track progress, build custom routines, and achieve your fitness goals.',
  keywords: [
    'gym tracker',
    'workout tracker',
    'fitness app',
    'weightlifting tracker',
    'progressive overload',
    'workout log',
    'gym log',
    'training tracker',
    'exercise tracker',
    'strength training'
  ],
  authors: [{ name: 'Gym Tracker' }],
  creator: 'Gym Tracker',
  publisher: 'Gym Tracker',
  metadataBase: new URL('https://gymtracker.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Gym Tracker - Track Every Rep, Build Real Progress',
    description:
      'The complete training system for serious lifters. Track workouts, build custom routines, and achieve measurable results.',
    siteName: 'Gym Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gym Tracker - Workout Tracking App'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym Tracker - Track Every Rep, Build Real Progress',
    description:
      'The complete training system for serious lifters. Track workouts, build custom routines, and achieve measurable results.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
