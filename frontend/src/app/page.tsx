import { PropertyList } from '@/components/PropertyList';

/**
 * Home page with property listings
 */
export default function Home() {
  return (
    <main className="min-h-screen">
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
