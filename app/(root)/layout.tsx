import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QRMenu.dj - Menu QR Code pour Restaurants',
  description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
  keywords: ['restaurant', 'menu', 'QR code', 'Djibouti', 'SaaS'],
  authors: [{ name: 'QRMenu.dj' }],
  creator: 'QRMenu.dj',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://qrmenu.dj',
    title: 'QRMenu.dj - Menu QR Code pour Restaurants',
    description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
    siteName: 'QRMenu.dj',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRMenu.dj - Menu QR Code pour Restaurants',
    description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}