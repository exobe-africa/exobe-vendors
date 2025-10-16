import { Card } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction and Acceptance</h2>
              <p className="text-gray-700 mb-4">
                Welcome to the eXobe Vendor Portal. These Terms and Conditions (&quot;Terms&quot;) govern your use of the eXobe vendor platform and services. By accessing or using the platform, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700">
                If you do not agree with these Terms, you must not use the platform. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>&quot;Platform&quot;</strong> refers to the eXobe Vendor Portal and all related services</li>
                <li><strong>&quot;Vendor&quot;</strong> or <strong>&quot;You&quot;</strong> refers to the seller using the platform</li>
                <li><strong>&quot;Customer&quot;</strong> refers to end users purchasing from vendors</li>
                <li><strong>&quot;Products&quot;</strong> refers to goods or services listed by vendors</li>
                <li><strong>&quot;eXobe&quot;</strong>, <strong>&quot;We&quot;</strong>, or <strong>&quot;Us&quot;</strong> refers to eXobe (Pty) Ltd</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Vendor Registration and Account</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Eligibility</h3>
              <p className="text-gray-700 mb-4">
                To use the platform, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into contracts</li>
                <li>Operate a legitimate business registered in South Africa</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your login credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Vendor Obligations</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Product Listings</h3>
              <p className="text-gray-700 mb-4">You must ensure that:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>All product information is accurate, complete, and up-to-date</li>
                <li>Product descriptions and images are not misleading</li>
                <li>Prices are clearly displayed and include all applicable taxes</li>
                <li>Products comply with South African laws and regulations</li>
                <li>You have the right to sell all listed products</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Prohibited Items</h3>
              <p className="text-gray-700 mb-4">You may not sell:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Illegal goods or services</li>
                <li>Counterfeit or unauthorized products</li>
                <li>Stolen goods</li>
                <li>Weapons, explosives, or hazardous materials</li>
                <li>Drugs or controlled substances</li>
                <li>Adult content or services</li>
                <li>Items that violate intellectual property rights</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Order Fulfillment</h3>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Process orders within 24-48 hours</li>
                <li>Ship products within the stated timeframe</li>
                <li>Provide tracking information when available</li>
                <li>Maintain adequate inventory levels</li>
                <li>Handle customer inquiries professionally</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Fees and Payments</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Commission Structure</h3>
              <p className="text-gray-700 mb-4">
                eXobe charges a commission on each sale. Commission rates vary by category and will be communicated to you upon registration. We reserve the right to modify commission rates with 30 days&apos; notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Payment Processing</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Payments are processed within 7-14 business days after order delivery</li>
                <li>You must provide valid bank account details</li>
                <li>All payments are subject to our verification process</li>
                <li>We may withhold payments for suspected fraud or policy violations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Taxes</h3>
              <p className="text-gray-700">
                You are responsible for all applicable taxes, including VAT. You must ensure your tax registration is current and provide valid tax documentation when required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                You must comply with South African consumer protection laws regarding returns and refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Accept returns for defective or damaged products</li>
                <li>Process refunds within 14 days of receiving returned items</li>
                <li>Clearly communicate your return policy to customers</li>
                <li>Bear the cost of return shipping for defective items</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of your product listings, images, and descriptions. By uploading content, you grant eXobe a non-exclusive, worldwide license to use, display, and distribute your content on the platform.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Platform Content</h3>
              <p className="text-gray-700">
                All platform features, design, code, and trademarks are owned by eXobe. You may not copy, modify, or distribute any platform content without written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Protection and Privacy</h2>
              <p className="text-gray-700 mb-4">
                We process personal data in accordance with our Privacy Policy and POPIA (Protection of Personal Information Act). You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Handle customer data responsibly</li>
                <li>Comply with data protection laws</li>
                <li>Not share or sell customer information</li>
                <li>Implement appropriate security measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Account Suspension and Termination</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 By eXobe</h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Receive excessive customer complaints</li>
                <li>Fail to fulfill orders</li>
                <li>Provide false information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 By You</h3>
              <p className="text-gray-700">
                You may close your account at any time with 30 days&apos; notice. You remain responsible for fulfilling pending orders and outstanding obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>eXobe is not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the fees paid by you in the past 12 months</li>
                <li>We do not guarantee uninterrupted or error-free platform operation</li>
                <li>You are solely responsible for your products and customer interactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold eXobe harmless from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of the platform</li>
                <li>Your products or services</li>
                <li>Violation of these Terms</li>
                <li>Infringement of third-party rights</li>
                <li>Customer disputes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes will be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Good faith negotiation between parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Arbitration under South African law as a last resort</li>
              </ul>
              <p className="text-gray-700">
                These Terms are governed by the laws of South Africa, and you submit to the exclusive jurisdiction of South African courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. General Provisions</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.1 Modifications</h3>
              <p className="text-gray-700 mb-4">
                We may modify these Terms at any time. Continued use of the platform after changes constitutes acceptance.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.2 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and eXobe.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.3 Severability</h3>
              <p className="text-gray-700">
                If any provision is found invalid, the remaining provisions remain in full effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>eXobe (Pty) Ltd</strong></p>
                <p className="text-gray-700 mb-2">Email: legal@exobe.co.za</p>
                <p className="text-gray-700 mb-2">Phone: +27 12 345 6789</p>
                <p className="text-gray-700 mb-2">Address: Cape Town, South Africa</p>
                <p className="text-gray-700">Support: support@exobe.co.za</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
      </div>
      <Footer variant="simple" />
    </div>
  );
}

