
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-10 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-24 lg:pt-44 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-background z-0" />
      
      <div className="container mx-auto px-0">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-block animate-fade-in">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-orangeBrand/10 text-orangeBrand text-xs sm:text-sm font-medium">
              A better way to buy & sell
            </span>
          </div>
          
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight animate-fade-in animate-delay-100 leading-tight">
            Declutter your space.<br />
            <span className="text-orangeBrand">Find treasures.</span>
          </h1>
          
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto animate-fade-in animate-delay-200 px-2">
            The premium marketplace for pre-loved household items, vehicles, and more. 
            Buy with confidence. Sell with ease.
          </p>
          
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in animate-delay-300 px-4">
            <Link
              to="/catalog"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-primary text-primary-foreground font-medium transition-all-200 hover:shadow-lg hover:shadow-primary/20 focus-ring text-center text-sm sm:text-base"
            >
              Browse Items
            </Link>
            <Link
              to="/seller-dashboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-foreground/20 font-medium transition-all-200 hover:bg-secondary focus-ring flex items-center justify-center text-sm sm:text-base"
            >
              Start Selling
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in animate-delay-400 px-4 sm:px-6">
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Verified Sellers</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">All sellers undergo identity verification for a trusted marketplace experience.</p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                <path d="M20.42 4.58C19.76 3.92 18.76 3.92 18.1 4.58L9.5 13.17L6.9 10.57C6.24 9.91 5.24 9.91 4.58 10.57C3.92 11.23 3.92 12.23 4.58 12.89L8.46 16.77C8.79 17.1 9.21 17.27 9.64 17.27C10.07 17.27 10.49 17.1 10.82 16.77L20.42 7.17C21.08 6.51 21.08 5.24 20.42 4.58Z" fill="currentColor" className="text-primary"/>
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">Transactions are protected with industry-leading security protocols.</p>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-2xl sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-6 sm:h-6">
                <path d="M7 9L12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                <path d="M12 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Easy Delivery</h3>
            <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">Track your purchases in real-time with our integrated delivery system.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
