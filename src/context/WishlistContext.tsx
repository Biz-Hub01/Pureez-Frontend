
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: string;
  inStock: boolean;
};

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  wishlistItemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  useEffect(() => {
    // Load wishlist from localStorage on mount
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage and wishlist count when wishlistItems changes
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    setWishlistItemCount(wishlistItems.length);
  }, [wishlistItems]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prevItems => {
      // Check if item already exists in wishlist
      if (prevItems.some(wishlistItem => wishlistItem.id === item.id)) {
        return prevItems;
      }
      
      // Add new item to wishlist
      return [...prevItems, item];
    });
    
    toast({
      title: "Added to Wishlist",
      description: `${item.name} has been added to your wishlist.`,
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist,
      isInWishlist,
      wishlistItemCount 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
