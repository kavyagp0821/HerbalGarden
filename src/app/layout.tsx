// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import FirestoreProvider from '@/components/providers/FirestoreProvider';

export const metadata: Metadata = {
  title: 'Virtual Vana: The Herbal Garden',
  description: 'Explore medicinal plants with 3D visualizations, recognition, and interactive learning tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
          <FirestoreProvider>
            {children}
          </FirestoreProvider>
          <Toaster />
      </body>
    </html>
  );
}
