
import { Heart, ShoppingCart, Check, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  condition: string;
  location: string;
  className?: string;
  usedFor?: string;
  seller?: string;
  room?: string;
  category?: string;
  videos?: string[];
  originalPrice?: number;
  stock?: number;
}

const ProductCard = ({
  id,
  title,
  price,
  condition,
  location,
  imageSrc,
  className,
  usedFor,
  seller = "Unknown Seller",
  room,
  category,
  videos,
  originalPrice,
  stock
}: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isAdded, setIsAdded] = useState(false);
  
  const isSaved = isInWishlist(id);
  
  // Check if the item is in cart and update local state
  useEffect(() => {
    setIsAdded(isInCart(id));
  }, [isInCart, id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name: title,
        price,
        imageUrl: imageSrc,
        seller,
        inStock: stock ? stock > 0 : true
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdded) {
      // Remove from cart
      removeFromCart(id);
      setIsAdded(false);
      toast({
        title: "Removed from Cart",
        description: `${title} has been removed from your cart.`,
      });
    } else {
      // Add to cart
      addToCart({
        id,
        title,
        price,
        image: imageSrc,
        seller,
        stock: stock || 1
      });
      setIsAdded(true);
      toast({
        title: "Added to Cart",
        description: `${title} has been added to your cart.`,
      });
    }
  };

  const navigateToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id,
      title,
      price,
      image: imageSrc,
      seller,
      stock: stock || 1
    });
    
    window.location.href = "/checkout";
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this product: ${title}`,
        url: url
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "Product has been shared.",
        });
      })
      .catch((error) => {
        console.error("Error sharing:", error);
        // Fallback to copying to clipboard
        copyToClipboard(url);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(url);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard.",
      });
    });
  };

  // Get condition badge styles based on condition type
  const getConditionBadgeStyle = () => {
    switch(condition) {
      case 'New':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30';
      case 'Used':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-500/30';
      case 'Refurbished':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30';
      default:
        return '';
    }
  };

  return (
    <Link to={`/product/${id}`} className={cn("block", className)}>
      <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="relative">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              type="button"
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-foreground/60 hover:text-primary"
              onClick={handleShare}
            >
              <Share size={18} />
            </button>
            <button
              type="button"
              className={cn(
                "p-2 rounded-full bg-white/80 backdrop-blur-sm",
                isSaved ? "text-red-500" : "text-foreground/60"
              )}
              onClick={handleSave}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
          <Badge 
            className={cn(
              "absolute bottom-3 left-3 px-2 py-1 font-medium", 
              getConditionBadgeStyle()
            )}
          >
            {condition}
          </Badge>
          {room && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-primary/80 text-primary-foreground backdrop-blur-sm">
              {room}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{title}</h3>
          <div className="flex justify-between items-center mt-2">
            <div>
              {originalPrice ? (
                <div className="flex flex-col">
                  <p className="text-sm line-through text-red-500">{formatPrice(originalPrice)}</p>
                  <p className="text-primary font-semibold text-green-500">{formatPrice(price)}</p>
                </div>
              ) : (
                <p className="text-primary font-semibold">{formatPrice(price)}</p>
              )}
            </div>
            <p className="text-sm text-foreground/70">{location}</p>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            {usedFor && (
              <div className="text-xs text-foreground/70">
                <span className="bg-secondary/50 px-2 py-1 rounded">Used for {usedFor}</span>
              </div>
            )}
            
            {stock !== undefined && (
              <div className={`text-xs font-medium ${stock > 5 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                {stock === 0 ? (
                  'Out of stock'
                ) : stock === 1 ? (
                  'Last one!'
                ) : (
                  `${stock} in stock`
                )}
              </div>
            )}
          </div>
          
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center",
                isAdded 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
              onClick={handleAddToCart}
              disabled={stock !== undefined && stock === 0}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="inline mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart size={14} className="inline mr-1" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
              onClick={navigateToCheckout}
              disabled={stock !== undefined && stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
