
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SellerCTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20 z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Turn Your Unused Items Into Cash
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-6 sm:mb-8 px-4 leading-relaxed">
            Join thousands of sellers who have successfully decluttered their homes and earned money through our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/login"
              className="px-4 sm:px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center hover:bg-primary/90 transition-all-200 text-sm sm:text-base"
            >
              Start Selling Now <ArrowRight size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
            </Link>
            <Link
              to="/how-it-works"
              className="px-4 sm:px-6 py-3 rounded-lg bg-secondary text-foreground font-medium inline-flex items-center justify-center hover:bg-secondary/80 transition-all-200 text-sm sm:text-base"
            >
              How It Works
            </Link>
          </div>
          
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 px-4">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">10k+</p>
              <p className="text-sm sm:text-base text-foreground/70">Active Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">50k+</p>
              <p className="text-sm sm:text-base text-foreground/70">Items Sold</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">4.8/5</p>
              <p className="text-sm sm:text-base text-foreground/70">Buyer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
