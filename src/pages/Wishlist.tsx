
import { Heart, Trash2, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.name,
      price: item.price,
      image: item.imageUrl,
      seller: item.seller
    });
    
    // Optionally, you could also remove the item from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          )}
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-xl">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-foreground/70 mb-6">
              Items you save to your wishlist will appear here.
            </p>
            <Button asChild>
              <a href="/catalog">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Stock Status</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {wishlistItems.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="h-20 w-20 rounded-md object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-foreground/70">Sold by {item.seller}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {item.inStock ? (
                          <span className="text-green-500 font-medium">In Stock</span>
                        ) : (
                          <span className="text-red-500 font-medium">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Package className="h-5 w-5 text-primary mr-2" />
                  <span className="text-foreground/70">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <Button asChild variant="outline">
                    <a href="/catalog">Continue Shopping</a>
                  </Button>
                  <Button asChild>
                    <a href="/cart">View Cart</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
