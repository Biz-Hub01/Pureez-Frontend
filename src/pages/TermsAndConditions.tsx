
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-primary">
                    <Home size={16} className="mr-2" />
                    Home
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-foreground/40 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-primary">Terms & Conditions</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <div className="glass-card p-8 rounded-xl animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
              <p className="text-sm text-foreground/60 mb-4">Last Updated: April 15, 2025</p>
              
              <p className="mb-6 text-foreground/80">
                Welcome to Declutter at Pureez. These terms and conditions outline the rules and regulations for the use of our Platform.
              </p>
              
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                  <p className="text-foreground/80">
                    By accessing or using Declutter at Pureez ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree, please refrain from accessing the Platform. We reserve the right to modify these Terms at any time, with changes effective immediately upon posting.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">2. User Responsibilities</h2>
                  <p className="text-foreground/80">
                    <strong>Buyers and Sellers:</strong> All users must provide accurate, current, and complete information when using our platform.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. Notify us immediately of any unauthorized use of your account.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Fraud Prevention:</strong> Users must not engage in fraudulent activities, including:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Misrepresenting item conditions</li>
                    <li>Making false claims (e.g., non-delivery of items)</li>
                    <li>Identity theft or impersonation</li>
                    <li>Chargeback abuse</li>
                    <li>Listing prohibited or illegal items</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Prohibited Conduct</h2>
                  <p className="text-foreground/80">
                    Users must not:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Violate Kenyan laws (e.g., Consumer Protection Act 2012, Computer Misuse and Cybercrimes Act 2018)</li>
                    <li>Manipulate transactions or interfere with other users</li>
                    <li>Introduce malware or spam</li>
                    <li>Circumvent Platform fees or engage in off-platform transactions</li>
                    <li>Illegal items or services</li>
                    <li>Counterfeit or replica items</li>
                    <li>Recalled items</li>
                    <li>Hazardous materials</li>
                    <li>Weapons, firearms, ammunition</li>
                    <li>Drugs, alcohol, tobacco products</li>
                    <li>Adult content or services</li>
                    <li>Personal information</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Transactions & Payments</h2>
                  <p className="text-foreground/80">
                    <strong>Secure Payments:</strong> All transactions are processed via Kenyan law-compliant third-party gateways (e.g., M-Pesa, card processors).
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Escrow Service:</strong> Funds are held securely until buyer confirms item receipt.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Refunds:</strong> Buyers may request refunds within 3 days if items are misrepresented. Sellers must cooperate in investigations.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Platform Fee:</strong> Declutter at Pureez charges a platform fee of 5% on all transactions. Shipping fees may apply depending on the item and delivery method. Payment must be made through the platform's secure payment system.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Dispute Resolution</h2>
                  <p className="text-foreground/80">
                    <strong>Mediation:</strong> Disputes will be resolved via Platform-facilitated mediation.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Escalation:</strong> Unresolved disputes will be referred to arbitration under Kenyan Arbitration Act 1995.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    <strong>Legal Action:</strong> Users may pursue claims in Kenyan courts.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                  <p className="text-foreground/80">
                    <strong>Platform Liability:</strong> Declutter at Pureez is not liable for:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>User misconduct or third-party actions</li>
                  </ul>
                  <p className="mt-3 text-foreground/80">
                    <strong>Maximum Liability:</strong> Limited to total fees paid by the user in the preceding 12 months.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                  <p className="text-foreground/80">
                    We may suspend or terminate accounts for breaches of these Terms, fraud, or legal violations. Users will be notified via email or SMS.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
                  <p className="text-foreground/80">
                    The Declutter at Pureez name, logo, and all related content are the exclusive property of our company. Users may not use our intellectual property without express written permission.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Shipping and Delivery</h2>
                  <p className="text-foreground/80">
                    Sellers are responsible for shipping items in a timely manner and providing tracking information when applicable. Buyers are responsible for providing accurate shipping information.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">10. Returns and Refunds</h2>
                  <p className="text-foreground/80">
                    Return and refund policies may vary by seller. In general, if an item arrives damaged or significantly different from its description, buyers may be eligible for a refund. Disputes will be handled by our customer service team.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
                  <p className="text-foreground/80">
                    These Terms are governed by Kenyan law. Disputes are subject to the exclusive jurisdiction of Kenyan courts.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">12. Fraud Mitigation</h2>
                  <p className="text-foreground/80">
                    To protect all users, we implement the following measures:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Mandatory ID verification for high-value transactions</li>
                    <li>Transaction monitoring for suspicious patterns</li>
                    <li>Collaboration with Kenyan authorities on investigations</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
                  <p className="text-foreground/80">
                    For questions about these Terms and Conditions, please contact us at support@declutteratpureez.com.
                  </p>
                </section>
              </div>
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg text-center">
                <p className="text-foreground/80">
                  By using Declutter at Pureez, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
