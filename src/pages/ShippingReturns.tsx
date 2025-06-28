
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, ArrowLeft, ArrowRight, Check, Info, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ShippingReturns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Shipping & Returns Policy</h1>
            <p className="text-lg text-foreground/70">
              Our policies are designed to ensure a smooth and satisfying shopping experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Shipping Policy */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Shipping Policy</CardTitle>
                </div>
                <CardDescription>How we deliver your products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Processing Time</h3>
                  <p className="text-sm">Orders are typically processed within 1-2 business days.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Shipping Methods & Times</h3>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    <li>Standard Shipping: 3-5 business days</li>
                    <li>Express Shipping: 1-2 business days (additional fee)</li>
                    <li>Local Pickup: Available in select locations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Shipping Costs</h3>
                  <ul className="list-disc pl-5 text-sm space-y-2">
                    <li>Orders over $50: FREE standard shipping</li>
                    <li>Orders under $50: $8.99 standard shipping fee</li>
                    <li>Express Shipping: Additional $15.00</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Tracking</h3>
                  <p className="text-sm">
                    Once your order ships, you will receive a confirmation email with tracking information.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Returns Policy */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <ArrowLeft className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Returns Policy</CardTitle>
                </div>
                <CardDescription>Our hassle-free return process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Return Window</h3>
                  <p className="text-sm">
                    We accept returns within 14 days of delivery. Items must be unused, undamaged, and in their original packaging.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Return Process</h3>
                  <ol className="list-decimal pl-5 text-sm space-y-2">
                    <li>Contact our customer service through the "Contact Us" page</li>
                    <li>Receive a return authorization and shipping instructions</li>
                    <li>Pack the item securely in its original packaging if possible</li>
                    <li>Ship the item back using the method specified in the instructions</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Refund Process</h3>
                  <p className="text-sm">
                    Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Return Shipping Costs</h3>
                  <p className="text-sm">
                    Return shipping costs are the responsibility of the buyer unless the item was defective or damaged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                  What if my item arrives damaged?
                </h3>
                <p className="mt-2 text-sm">
                  Please contact our customer service immediately and provide photos of the damaged items and packaging. We'll arrange for a replacement or refund.
                </p>
              </div>
              
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                  Do you ship internationally?
                </h3>
                <p className="mt-2 text-sm">
                  Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please note that international orders may be subject to customs fees and taxes, which are the responsibility of the buyer.
                </p>
              </div>
              
              <div className="border border-border p-4 rounded-lg">
                <h3 className="font-semibold flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                  How can I change my delivery address?
                </h3>
                <p className="mt-2 text-sm">
                  If your order hasn't shipped yet, you can contact our customer service team to update your delivery address. Once an order has shipped, we cannot change the delivery address.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-secondary/20 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Need More Help?</h2>
            </div>
            <p className="mb-4">
              If you have any questions about our shipping or return policies, our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center"
              >
                Contact Us
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link 
                to="/support" 
                className="bg-secondary px-6 py-2 rounded-lg flex items-center justify-center"
              >
                FAQ & Support
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShippingReturns;
