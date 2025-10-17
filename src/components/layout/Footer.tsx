import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'simple';
  className?: string;
}

export function Footer({ variant = 'default', className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'simple') {
    return (
      <footer className={`bg-white border-t border-gray-200 py-4 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} eXobe. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-white border-t border-gray-200 py-6 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">About eXobe</h3>
            <p className="text-sm text-gray-600 mb-3">
              South Africa's premier marketplace for vendors to grow their business and reach customers nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link href={process.env.NEXT_PUBLIC_SELLER_URL || "https://exobe.africa/sell"} className="text-sm text-gray-600 hover:text-gray-900">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href={process.env.NEXT_PUBLIC_FRONTEND_URL || "https://exobe.africa"} className="text-sm text-gray-600 hover:text-gray-900">
                  Shop eXobe
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="mailto:support@exobe.co.za" className="text-sm text-gray-600 hover:text-gray-900">
                  support@exobe.co.za
                </Link>
              </li>
              <li>
                <Link href="tel:+27123456789" className="text-sm text-gray-600 hover:text-gray-900">
                  +27 12 345 6789
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-600">
                  Mon - Fri: 8:00 AM - 5:00 PM SAST
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} eXobe. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="mailto:support@exobe.co.za" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

