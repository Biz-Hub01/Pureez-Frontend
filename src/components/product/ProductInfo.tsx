import { useState, useEffect } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  condition: "New" | "Used" | "Refurbished";
  seller?: string;
  usedFor?: string;
  features?: string[];
  stock?: number;
}

const ProductInfo = ({
  id,
  title,
  price,
  originalPrice,
  description,
  condition,
  seller = "Unknown Seller",
  usedFor,
  features = [],
  stock = 1
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { formatPrice } = useCurrency();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const isSaved = isInWishlist(id);
  
  useEffect(() => {
    setIsAdded(isInCart(id));
  }, [isInCart, id]);
  
  const incrementQuantity = () => {
    if (stock && quantity < stock) {
      setQuantity(quantity + 1);
    } else if (stock) {
      toast({
        title: "Maximum stock reached",
        description: `Only ${stock} items available.`,
      });
    } else {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleSave = () => {
    if (isSaved) {
      removeFromWishlist(id);
      toast({
        title: "Removed from Wishlist",
        description: `${title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id,
        name: title,
        price,
        imageUrl: '', // Would need a proper image URL here
        seller,
        inStock: stock > 0
      });
      toast({
        title: "Added to Wishlist",
        description: `${title} has been added to your wishlist.`,
      });
    }
  };
  
  const handleCart = () => {
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
        image: '', // Would need a proper image URL here
        seller,
        quantity: quantity,
        stock
      });
      setIsAdded(true);
      toast({
        title: "Added to Cart",
        description: `${title} has been added to your cart.`,
      });
    }
  };
  
  // Get condition badge styles based on condition type
  const getConditionBadgeStyle = () => {
    switch(condition) {
      case 'New':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'Used':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400';
      case 'Refurbished':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 px-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className={cn("font-medium", getConditionBadgeStyle())}>{condition}</Badge>
        {usedFor && <Badge variant="outline">Used for {usedFor}</Badge>}
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      
      <div className="flex items-baseline mt-4 mb-6">
        {originalPrice ? (
          <>
            <span className="text-xl md:text-2xl font-bold text-green-500">{formatPrice(price)}</span>
            <span className="ml-2 text-lg line-through text-red-500">{formatPrice(originalPrice)}</span>
          </>
        ) : (
          <span className="text-xl md:text-2xl font-bold">{formatPrice(price)}</span>
        )}
      </div>
      
      <div className="text-sm text-foreground/70 mb-2">
        Sold by <span className="text-foreground font-medium">{seller}</span>
      </div>
      
      <div className={`text-sm font-medium mb-6 ${stock > 5 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
        {stock === 0 ? (
          'Out of stock'
        ) : stock === 1 ? (
          'Only 1 item left!'
        ) : (
          `${stock} items in stock`
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="prose prose-sm max-w-none mb-6 text-foreground/80">
        <p>{description}</p>
        
        {features.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="w-full md:w-auto flex items-center border rounded-md">
          <button 
            type="button"
            className="w-12 h-12 flex items-center justify-center text-foreground/70 hover:bg-secondary/70"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <div className="flex-1 text-center font-medium">{quantity}</div>
          <button 
            type="button"
            className="w-12 h-12 flex items-center justify-center text-foreground/70 hover:bg-secondary/70"
            onClick={incrementQuantity}
            disabled={stock !== undefined && quantity >= stock}
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            variant={isAdded ? "secondary" : "default"} 
            size="lg" 
            className="w-full"
            onClick={handleCart}
            disabled={stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdded ? "Remove from Cart" : "Add to Cart"}
          </Button>
          
          <Button 
            variant={isSaved ? "secondary" : "outline"} 
            size="lg" 
            className={cn(
              "w-full", 
              isSaved && "text-red-500 border-red-500 hover:bg-red-500/10"
            )}
            onClick={handleSave}
          >
            <Heart 
              className="mr-2 h-4 w-4" 
              fill={isSaved ? "currentColor" : "none"}
            />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
