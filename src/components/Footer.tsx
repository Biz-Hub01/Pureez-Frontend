
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background pt-8 sm:pt-12 pb-6 sm:pb-8 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Declutter</h2>
            <p className="text-sm sm:text-base text-foreground/70 mb-4 leading-relaxed">
              Helping you sell pre-owned items with ease and find amazing deals on second-hand treasures.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Youtube size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/catalog" className="text-sm text-foreground/70 hover:text-primary transition-colors">Catalog</Link>
              </li>
              <li>
                <Link to="/offers" className="text-sm text-foreground/70 hover:text-primary transition-colors">Offers</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-foreground/70 hover:text-primary transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/admin-dashboard" className="text-sm text-foreground/70 hover:text-primary transition-colors flex items-center">
                  <ShieldCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-foreground/70 hover:text-primary transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/customer-support" className="text-sm text-foreground/70 hover:text-primary transition-colors">Customer Support</Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-sm text-foreground/70 hover:text-primary transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/70 hover:text-primary transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Sell with Us</h3>
            <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
              Join our community of sellers and start decluttering your home while making extra cash.
            </p>
            <Link to="/seller-verification" className="inline-block bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md font-medium text-xs sm:text-sm hover:bg-primary/90 transition-colors">
              Become a Seller
            </Link>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Declutter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
