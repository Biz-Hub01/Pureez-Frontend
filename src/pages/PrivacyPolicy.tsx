
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
                    <span className="ml-1 text-sm font-medium text-primary">Privacy Policy</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <div className="glass-card p-8 rounded-xl animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-sm text-foreground/60 mb-4">Last Updated: April 15, 2025</p>
              
              <p className="mb-6 text-foreground/80">
                At Declutter at Pureez, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Data Collection</h2>
                  <p className="text-foreground/80">
                    We collect the following information:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Personal data (name, email, phone, ID/passport copy for verification)</li>
                    <li>Transaction details (payment information, item descriptions)</li>
                    <li>Technical data (IP address, device information)</li>
                    <li>User credentials (usernames, passwords)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Profile information (profile picture, preferences)</li>
                    <li>Transaction history</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Use of Data</h2>
                  <p className="text-foreground/80">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Facilitating transactions and verifying identities</li>
                    <li>Communicating updates and resolving disputes</li>
                    <li>Improving services and complying with legal obligations (e.g., tax laws)</li>
                    <li>Providing, operating, and maintaining our platform</li>
                    <li>Improving, personalizing, and expanding our platform</li>
                    <li>Understanding and analyzing how you use our platform</li>
                    <li>Developing new products, services, features, and functionality</li>
                    <li>Sending you technical notices, updates, security alerts, and support messages</li>
                    <li>Communicating with you about products, services, offers, and promotions</li>
                    <li>Preventing fraudulent transactions and monitoring against theft</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
                  <p className="text-foreground/80">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li><strong>Third Parties:</strong> Payment processors, delivery partners, and regulators (as required by law)</li>
                    <li><strong>Between Buyers and Sellers:</strong> To facilitate transactions, we share limited contact and shipping information between parties involved in a transaction</li>
                    <li><strong>Business Transfers:</strong> We may share information in connection with a merger, sale of company assets, financing, or acquisition</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information where required to comply with applicable law, governmental requests, or legal process</li>
                  </ul>
                  <p className="mt-3 text-foreground/80">
                    <strong>No Sale:</strong> Your data is not sold to external marketers.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                  <p className="text-foreground/80">
                    We implement appropriate technical and organizational measures to protect your data, including:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Encryption (SSL/TLS) for data transmission</li>
                    <li>Restricted access to sensitive information</li>
                    <li>Regular audits for compliance with Kenya Data Protection Act 2019</li>
                  </ul>
                  <p className="mt-3 text-foreground/80">
                    However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. User Rights</h2>
                  <p className="text-foreground/80">
                    Under the Data Protection Act 2019, you have the right to:
                  </p>
                  <ul className="list-disc pl-8 mt-2 text-foreground/80 space-y-1">
                    <li>Access, correct, or delete your personal information</li>
                    <li>Withdraw consent (may affect service access)</li>
                    <li>Lodge complaints with the Office of the Data Protection Commissioner (ODPC)</li>
                    <li>Request restriction of processing of your personal information</li>
                    <li>Object to certain processing of your personal information</li>
                  </ul>
                  <p className="mt-3 text-foreground/80">
                    To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Retention Period</h2>
                  <p className="text-foreground/80">
                    Data is retained for 5 years post-account closure or as required by law.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking Technologies</h2>
                  <p className="text-foreground/80">
                    We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
                  <p className="text-foreground/80">
                    Our platform is not intended for individuals under the age of 18. We do not knowingly collect or solicit personal information from children. If we learn we have collected personal information from a child under 18, we will delete that information.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Updates to This Privacy Policy</h2>
                  <p className="text-foreground/80">
                    Policy changes will be notified via email or Platform notifications. Continued use implies acceptance. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
                  <p className="text-foreground/80">
                    If you have questions or concerns about this Privacy Policy, please contact us at:
                  </p>
                  <p className="mt-3 text-foreground/80">
                    Email: privacy@declutteratpureez.com<br />
                    Phone: +254-555-123-4567<br />
                    Address: Nairobi, Kenya
                  </p>
                </section>
              </div>
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg text-center">
                <p className="text-foreground/80">
                  By using Declutter at Pureez, you acknowledge that you have read and understood this Privacy Policy.
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

export default PrivacyPolicy;
