
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    id: "living-room",
    title: "Living Room",
    imageSrc: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "kitchen",
    title: "Kitchen",
    imageSrc: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bedroom",
    title: "Bedroom",
    imageSrc: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bathroom",
    title: "Bathroom",
    imageSrc: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "garden",
    title: "Garden & Plants",
    imageSrc: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "electronics",
    title: "Electronics",
    imageSrc: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "vehicles",
    title: "Vehicles",
    imageSrc: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "fitness",
    title: "Fitness & Gym",
    imageSrc: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const FeaturedCategories = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
  };
  
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Browse Categories</h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto px-4">
            Discover quality pre-owned items across a variety of categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <div key={category.id} onClick={() => handleCategoryClick(category.id)} className="cursor-pointer">
              <CategoryCard
                title={category.title}
                imageSrc={category.imageSrc}
                to={`/catalog?category=${category.id}`}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 text-center">
          <Link 
            to="/catalog" 
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all-200 text-sm sm:text-base"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
