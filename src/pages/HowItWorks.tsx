
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Tag, Truck, Shield, DollarSign, Package } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How Declutter at Pureez Works</h1>
              <p className="text-lg text-foreground/70 mb-8">
                Our platform makes it easy to buy and sell pre-owned items safely and securely.
                Learn how to get started in just a few simple steps.
              </p>
            </div>
          </div>
        </section>
        
        {/* Buying Process */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Buying on Declutter at Pureez</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Find great pre-owned items at amazing prices
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Discover</h3>
                <p className="text-foreground/70">
                  Explore our wide selection of pre-owned items across various categories to find exactly what you need.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Purchase</h3>
                <p className="text-foreground/70">
                  Use our secure checkout system to pay for your items with confidence, protected by our buyer guarantee.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receive Your Items</h3>
                <p className="text-foreground/70">
                  Track your delivery and receive your items at your doorstep. Verify and confirm receipt through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Selling Process */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Selling on Declutter at Pureez</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Turn your unused items into cash quickly and easily
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-foreground/70">
                  Register as a seller with your ID verification to build trust with potential buyers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
                <p className="text-foreground/70">
                  Take photos and create detailed listings of your items. Our admin team will review and approve quality listings.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
                <p className="text-foreground/70">
                  Once your item sells and is delivered, the payment will be transferred to your account securely.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-foreground/70 mb-8">
                Join our community of buyers and sellers and start decluttering your home or finding amazing deals today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/login"
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all-200"
                >
                  Create an Account
                </a>
                <a
                  href="/catalog"
                  className="px-6 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-all-200"
                >
                  Browse Items
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
