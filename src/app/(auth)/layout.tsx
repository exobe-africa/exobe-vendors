import { Store } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Store className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">eXobe</h1>
              <p className="text-xs text-gray-500">Vendor Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link 
              href="https://exobe.co.za" 
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Back to eXobe
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer variant="default" />
    </div>
  );
}

