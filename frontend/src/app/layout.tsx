import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real Estate App',
  description: 'Find your dream property',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Header */}
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Building2 className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Real Estate App</h1>
                  <p className="text-sm text-gray-600">Find your dream property</p>
                </div>
              </Link>
            </div>
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
