import { PropertyList } from '@/components/PropertyList';
import { Building2 } from 'lucide-react';

/**
 * Home page with property listings
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real Estate App</h1>
              <p className="text-sm text-gray-600">Find your dream property</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PropertyList />
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Real Estate Company. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
