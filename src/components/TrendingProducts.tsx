
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const MOCK_PRODUCTS = [
  {
    id: "p1",
    title: "Mid-Century Modern Sofa",
    price: 450,
    originalPrice: 800,
    condition: "Used" as const,
    location: "San Francisco",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s1", name: "John D." },
    categories: ["living-room", "furniture"],
    rating: 4.8
  },
  {
    id: "p2",
    title: "Samsung 55\" Smart TV",
    price: 350,
    originalPrice: 500,
    condition: "Refurbished" as const,
    location: "Los Angeles",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s2", name: "Sarah M." },
    categories: ["electronics", "living-room"],
    rating: 4.5
  },
  {
    id: "p3",
    title: "Vintage Leather Armchair",
    price: 325,
    originalPrice: 600,
    condition: "Used" as const,
    location: "Chicago",
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s3", name: "Michael P." },
    categories: ["living-room", "furniture"],
    rating: 4.6
  },
  {
    id: "p4",
    title: "KitchenAid Stand Mixer",
    price: 180,
    originalPrice: 350,
    condition: "Used" as const,
    location: "Seattle",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s4", name: "Jennifer L." },
    categories: ["kitchen", "appliances"],
    rating: 4.9
  },
  {
    id: "p5",
    title: "Herman Miller Office Chair",
    price: 550,
    originalPrice: 1000,
    condition: "Used" as const,
    location: "New York",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s5", name: "David K." },
    categories: ["furniture", "office"],
    rating: 4.7
  },
  {
    id: "p6",
    title: "Macbook Pro 16\" 2021",
    price: 1250,
    originalPrice: 2000,
    condition: "Refurbished" as const,
    location: "Austin",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s6", name: "Alex R." },
    categories: ["electronics", "office"],
    rating: 4.9
  },
  {
    id: "p7",
    title: "Yamaha Digital Piano",
    price: 450,
    originalPrice: 700,
    condition: "Used" as const,
    location: "Denver",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s7", name: "Emma W." },
    categories: ["music", "hobbies"],
    rating: 4.4
  },
  {
    id: "p8",
    title: "Specialized Road Bike",
    price: 950,
    originalPrice: 1600,
    condition: "Used" as const,
    location: "Portland",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    seller: { id: "s8", name: "Thomas B." },
    categories: ["fitness", "outdoors"],
    rating: 4.6
  }
];

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "furniture", label: "Furniture" },
  { id: "electronics", label: "Electronics" },
  { id: "kitchen", label: "Kitchen" },
  { id: "fitness", label: "Fitness" }
];

const TrendingProducts = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  
  const filteredProducts = activeFilter === "all" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(product => product.categories.includes(activeFilter));
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Trending Items</h2>
            <p className="text-sm sm:text-base text-foreground/70 mt-1 sm:mt-2">Popular items that people are loving</p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
            {categoryFilters.map((filter) => (
              <button
                key={filter.id}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all-200 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground/80"
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => handleProductClick(product.id)} 
              className="cursor-pointer"
            >
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                condition={product.condition}
                location={product.location}
                imageSrc={product.image}
                className=""
                originalPrice={product.originalPrice}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
