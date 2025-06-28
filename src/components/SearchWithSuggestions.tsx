
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "brand" | "keyword";
  category?: string;
}

// Mock search data - in a real app this would come from your backend
const searchData: SearchSuggestion[] = [
  // Products
  { id: "1", text: "Mid-Century Modern Sofa", type: "product", category: "living-room" },
  { id: "2", text: "Stainless Steel Refrigerator", type: "product", category: "kitchen" },
  { id: "3", text: "Honda Civic", type: "product", category: "vehicles" },
  { id: "4", text: "Fiddle Leaf Fig Plant", type: "product", category: "plants" },
  { id: "5", text: "Treadmill NordicTrack", type: "product", category: "gym" },
  { id: "6", text: "Vintage Leather Armchair", type: "product", category: "living-room" },
  { id: "7", text: "KitchenAid Stand Mixer", type: "product", category: "kitchen" },
  { id: "8", text: "Yamaha Digital Piano", type: "product", category: "living-room" },
  { id: "9", text: "Herman Miller Office Chair", type: "product", category: "office" },
  { id: "10", text: "Samsung Smart TV", type: "product", category: "electronics" },
  { id: "11", text: "Espresso Machine", type: "product", category: "kitchen" },
  { id: "12", text: "Dyson Vacuum Cleaner", type: "product", category: "electronics" },
  
  // Categories
  { id: "cat-1", text: "Living Room", type: "category" },
  { id: "cat-2", text: "Kitchen", type: "category" },
  { id: "cat-3", text: "Bedroom", type: "category" },
  { id: "cat-4", text: "Bathroom", type: "category" },
  { id: "cat-5", text: "Garden & Outdoor", type: "category" },
  { id: "cat-6", text: "Plants", type: "category" },
  { id: "cat-7", text: "Vehicles", type: "category" },
  { id: "cat-8", text: "Electronics", type: "category" },
  { id: "cat-9", text: "Gym Equipment", type: "category" },
  { id: "cat-10", text: "Office", type: "category" },
  
  // Brands
  { id: "brand-1", text: "Honda", type: "brand" },
  { id: "brand-2", text: "Samsung", type: "brand" },
  { id: "brand-3", text: "KitchenAid", type: "brand" },
  { id: "brand-4", text: "Yamaha", type: "brand" },
  { id: "brand-5", text: "Herman Miller", type: "brand" },
  { id: "brand-6", text: "Dyson", type: "brand" },
  { id: "brand-7", text: "NordicTrack", type: "brand" },
  
  // Keywords
  { id: "kw-1", text: "sofa", type: "keyword" },
  { id: "kw-2", text: "chair", type: "keyword" },
  { id: "kw-3", text: "table", type: "keyword" },
  { id: "kw-4", text: "lamp", type: "keyword" },
  { id: "kw-5", text: "mirror", type: "keyword" },
  { id: "kw-6", text: "desk", type: "keyword" },
  { id: "kw-7", text: "bed", type: "keyword" },
  { id: "kw-8", text: "cabinet", type: "keyword" },
  { id: "kw-9", text: "mixer", type: "keyword" },
  { id: "kw-10", text: "vacuum", type: "keyword" },
  { id: "kw-11", text: "treadmill", type: "keyword" },
  { id: "kw-12", text: "piano", type: "keyword" },
];

interface SearchWithSuggestionsProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

const SearchWithSuggestions = ({ className, placeholder = "Search...", isMobile = false }: SearchWithSuggestionsProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = searchData
        .filter(item => 
          item.text.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "category") {
      const categoryMap: Record<string, string> = {
        "Living Room": "living-room",
        "Kitchen": "kitchen",
        "Bedroom": "bedroom",
        "Bathroom": "bathroom",
        "Garden & Outdoor": "garden",
        "Plants": "plants",
        "Vehicles": "vehicles",
        "Electronics": "electronics",
        "Gym Equipment": "gym",
        "Office": "office"
      };
      const categoryId = categoryMap[suggestion.text] || "all";
      navigate(`/catalog?category=${categoryId}`);
    } else {
      handleSearch(suggestion.text);
    }
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSuggestionClick(suggestions[selectedIndex]);
    } else {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product": return "🔍";
      case "category": return "📁";
      case "brand": return "🏷️";
      case "keyword": return "🔎";
      default: return "🔍";
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className={cn(
            "pl-8 pr-8 transition-all duration-200",
            isMobile ? "h-9 text-sm" : "h-8 text-xs",
            isOpen && suggestions.length > 0 && "rounded-b-none border-b-0"
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
        />
        
        <Search
          size={isMobile ? 16 : 14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/60 cursor-pointer"
          onClick={() => handleSearch(query)}
        />
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={isMobile ? 16 : 14} />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border border-t-0 rounded-b-md shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors flex items-center gap-2 text-sm",
                selectedIndex === index && "bg-secondary/50"
              )}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-xs">{getTypeIcon(suggestion.type)}</span>
              <span className="flex-1 truncate">{suggestion.text}</span>
              {suggestion.type === "category" && (
                <span className="text-xs text-foreground/60">Category</span>
              )}
              {suggestion.type === "brand" && (
                <span className="text-xs text-foreground/60">Brand</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
