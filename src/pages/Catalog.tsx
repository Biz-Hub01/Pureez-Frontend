
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  category: string;
  location: string;
  created_at: string;
  room?: string;
  used_for?: string;
};

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    condition: true,
    location: true,
    price: true
  });

  const categories = [
    "Furniture", 
    "Electronics", 
    "Kitchenware", 
    "Home Décor", 
    "Appliances", 
    "Lighting",
    "Textiles",
    "Storage",
    "Outdoor",
    "Office",
    "Art & Collectibles"
  ];

  const conditions = [
    "New with tags", 
    "New without tags", 
    "Excellent used condition", 
    "Good used condition", 
    "Fair condition"
  ];

  const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"];

  // Fetch search suggestions
  const fetchSuggestions = useCallback(debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('title')
        .ilike('title', `%${query}%`)
        .limit(5);

      if (error) throw error;

      setSearchSuggestions(data.map(item => item.title));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300), []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCondition, selectedLocation, priceRange, sortBy, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, fetchSuggestions]);

  useEffect(() => {
    // Update active filters
    const filters = [];
    if (selectedCategory !== "all") filters.push(selectedCategory);
    if (selectedCondition !== "all") filters.push(selectedCondition);
    if (selectedLocation !== "all") filters.push(selectedLocation);
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        filters.push(`KES ${min.toLocaleString()} - ${max.toLocaleString()}`);
      } else {
        filters.push(`Over KES ${min.toLocaleString()}`);
      }
    }
    setActiveFilters(filters);
  }, [selectedCategory, selectedCondition, selectedLocation, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'approved'); // Only show approved products

      // Apply filters
      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (selectedCondition !== "all") {
        query = query.eq('condition', selectedCondition);
      }

      if (selectedLocation !== "all") {
        query = query.ilike('location', `%${selectedLocation}%`);
      }

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          query = query.order('price', { ascending: true });
          break;
        case "price-high":
          query = query.order('price', { ascending: false });
          break;
        case "oldest":
          query = query.order('created_at', { ascending: true });
          break;
        default: // newest
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newSearchParams.set("search", searchQuery);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSelectedLocation("all");
    setPriceRange("all");
    setSortBy("newest");
    setSearchQuery("");
    setSearchParams({});
  };

  const removeFilter = (filter: string) => {
    if (categories.includes(filter)) {
      setSelectedCategory("all");
    } else if (conditions.includes(filter)) {
      setSelectedCondition("all");
    } else if (locations.includes(filter)) {
      setSelectedLocation("all");
    } else if (filter.startsWith("KES")) {
      setPriceRange("all");
    }
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Product Catalog</h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Discover quality pre-loved items at amazing prices. Shop sustainably and save!
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6 relative">
          <div className="flex gap-4 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10 py-5 text-base"
              />

              {searchSuggestions.length > 0 && showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-border">
                  {searchSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 hover:bg-secondary cursor-pointer"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

            </div>
            <Button type="submit" className="py-5 px-6 text-base">Search</Button>
            
            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 py-5 px-6 text-base"
            >
              <SlidersHorizontal size={20} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </form>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-foreground/70">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <div 
                key={index}
                className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm"
              >
                <span>{filter}</span>
                <button 
                  type="button"
                  className="ml-2 text-foreground/50 hover:text-foreground"
                  onClick={() => removeFilter(filter)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              className="text-primary hover:underline text-sm"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
            <div className="lg:w-1/4 glass-card p-6 rounded-xl h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-3"
                  onClick={() => toggleFilterSection("category")}
                >
                  <h3 className="font-medium">Category</h3>
                  {expandedFilters.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedFilters.category && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="category-all"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="mr-2"
                      />
                      <label htmlFor="category-all" className="cursor-pointer">All Categories</label>
                    </div>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2"
                        />
                        <label htmlFor={`category-${category}`} className="cursor-pointer">{category}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Condition Filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-3"
                  onClick={() => toggleFilterSection("condition")}
                >
                  <h3 className="font-medium">Condition</h3>
                  {expandedFilters.condition ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedFilters.condition && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="condition-all"
                        name="condition"
                        checked={selectedCondition === "all"}
                        onChange={() => setSelectedCondition("all")}
                        className="mr-2"
                      />
                      <label htmlFor="condition-all" className="cursor-pointer">All Conditions</label>
                    </div>
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center">
                        <input
                          type="radio"
                          id={`condition-${condition}`}
                          name="condition"
                          checked={selectedCondition === condition}
                          onChange={() => setSelectedCondition(condition)}
                          className="mr-2"
                        />
                        <label htmlFor={`condition-${condition}`} className="cursor-pointer">{condition}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Location Filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-3"
                  onClick={() => toggleFilterSection("location")}
                >
                  <h3 className="font-medium">Location</h3>
                  {expandedFilters.location ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedFilters.location && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="location-all"
                        name="location"
                        checked={selectedLocation === "all"}
                        onChange={() => setSelectedLocation("all")}
                        className="mr-2"
                      />
                      <label htmlFor="location-all" className="cursor-pointer">All Locations</label>
                    </div>
                    {locations.map((location) => (
                      <div key={location} className="flex items-center">
                        <input
                          type="radio"
                          id={`location-${location}`}
                          name="location"
                          checked={selectedLocation === location}
                          onChange={() => setSelectedLocation(location)}
                          className="mr-2"
                        />
                        <label htmlFor={`location-${location}`} className="cursor-pointer">{location}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer mb-3"
                  onClick={() => toggleFilterSection("price")}
                >
                  <h3 className="font-medium">Price Range</h3>
                  {expandedFilters.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedFilters.price && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-all"
                        name="price"
                        checked={priceRange === "all"}
                        onChange={() => setPriceRange("all")}
                        className="mr-2"
                      />
                      <label htmlFor="price-all" className="cursor-pointer">All Prices</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-0-1000"
                        name="price"
                        checked={priceRange === "0-1000"}
                        onChange={() => setPriceRange("0-1000")}
                        className="mr-2"
                      />
                      <label htmlFor="price-0-1000" className="cursor-pointer">Under KES 1,000</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-1000-5000"
                        name="price"
                        checked={priceRange === "1000-5000"}
                        onChange={() => setPriceRange("1000-5000")}
                        className="mr-2"
                      />
                      <label htmlFor="price-1000-5000" className="cursor-pointer">KES 1,000 - 5,000</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-5000-10000"
                        name="price"
                        checked={priceRange === "5000-10000"}
                        onChange={() => setPriceRange("5000-10000")}
                        className="mr-2"
                      />
                      <label htmlFor="price-5000-10000" className="cursor-pointer">KES 5,000 - 10,000</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-10000-20000"
                        name="price"
                        checked={priceRange === "10000-20000"}
                        onChange={() => setPriceRange("10000-20000")}
                        className="mr-2"
                      />
                      <label htmlFor="price-10000-20000" className="cursor-pointer">KES 10,000 - 20,000</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-20000"
                        name="price"
                        checked={priceRange === "20000"}
                        onChange={() => setPriceRange("20000")}
                        className="mr-2"
                      />
                      <label htmlFor="price-20000" className="cursor-pointer">Over KES 20,000</label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sort By */}
              <div className="mb-4">
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={clearFilters} className="w-full mt-4">
                Clear All Filters
              </Button>
            </div>
          )}

        {/* Products Section */}
        <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            {/* View Toggle & Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-foreground/70">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

        {/* Products Grid */}
        {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="glass-card p-4 rounded-xl animate-pulse">
                    <div className="aspect-square bg-secondary rounded-lg mb-4"></div>
                    <div className="h-4 bg-secondary rounded mb-2"></div>
                    <div className="h-4 bg-secondary rounded mb-2 w-2/3"></div>
                    <div className="h-6 bg-secondary rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {products.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      imageSrc={product.images[0]}
                      condition={product.condition}
                      location={product.location}
                      room={product.room}
                      usedFor={product.used_for}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary/30 flex items-center justify-center">
                    <Search size={48} className="text-foreground/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-foreground/70 mb-6">
                    Try adjusting your search criteria or browse our categories
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      <Footer />
    </>
  );
};

export default Catalog;
