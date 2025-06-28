
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import TrendingProducts from "@/components/TrendingProducts";
import SellerCTA from "@/components/SellerCTA";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <FeaturedCategories />
        <TrendingProducts />
        <SellerCTA />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
