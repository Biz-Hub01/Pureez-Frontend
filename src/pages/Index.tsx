
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import SellerCTA from "@/components/SellerCTA";

const Index = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="container mx-auto px-0 py-4 sm:py-8">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FeaturedCategories />
        <SellerCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
