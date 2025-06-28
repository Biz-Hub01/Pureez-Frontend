
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Heart, Share, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
  description: string;
  features: string[];
  images: string[];
  sellerInfo: {
    name: string;
    joinedDate: string;
  };
  videos: string[];
  stock: number;
  created_at: string;
  category: string;
  room?: string;
  used_for?: string;
}

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [listingsCount, setListingsCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId, location.pathname]);
  
  const fetchProduct = async () => {
    setLoading(true);
    try {
      if (!productId) {
        throw new Error("Product ID is missing");
      }

      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError || !productData) {
        throw productError || new Error("Product not found");
      }

      // Fetch seller info
      const { data: sellerData, error: sellerError } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', productData.seller_id)
        .single();

      if (sellerError) {
        console.error("Error fetching seller:", sellerError);
      }

      // Fetch seller's listings count
      let listings = 0;
      if (productData.seller_id) {
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .eq('seller_id', productData.seller_id);
        
        if (!countError && count !== null) {
          listings = count;
        }
      }

      const formattedProduct: Product = {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        condition: productData.condition,
        location: productData.location,
        description: productData.description,
        features: [
          `Condition: ${productData.condition}`,
          `Category: ${productData.category}`,
          productData.room && `Room: ${productData.room}`,
          productData.used_for && `Used for: ${productData.used_for}`
        ].filter(Boolean) as string[],
        images: productData.images,
        sellerInfo: {
          name: sellerData?.business_name || "Unknown Seller",
          joinedDate: new Date(sellerData?.created_at || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        },
        videos: productData.videos || [],
        stock: productData.stock || 1,
        created_at: productData.created_at,
        category: productData.category,
        room: productData.room,
        used_for: productData.used_for
      };

      setProduct(formattedProduct);
      setListingsCount(listings);

      // Fetch related products
      const { data: relatedData, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .eq('category', productData.category)
        .neq('id', productId)
        .limit(4);

      if (!relatedError && relatedData) {
        setRelatedProducts(relatedData.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          condition: p.condition,
          location: p.location.split(',')[0],
          imageSrc: p.images[0],
          stock: p.stock
        })));
      }
    } catch (err) {
      setError(err.message || "Failed to load product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const addToCartHandler = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      seller: product.sellerInfo.name,
      stock: product.stock
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const buyNowHandler = () => {
    if (!product) return;
    
    addToCartHandler();
    navigate("/checkout");
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from Wishlist" : "Added to Wishlist",
      description: isSaved 
        ? `${product?.title} has been removed from your wishlist.` 
        : `${product?.title} has been added to your wishlist.`,
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/product/${productId}`;
    
    if (navigator.share) {
      navigator.share({
        title: product?.title || "Product",
        text: `Check out this product: ${product?.title}`,
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
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link Copied!",
            description: "Product link has been copied to clipboard.",
          });
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to clipboard.",
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary/30 flex items-center justify-center">
              <ShoppingCart size={48} className="text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Product Not Found</h3>
            <p className="text-foreground/70 mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/catalog")}>Browse Products</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-foreground/70 mb-6">
            <Link to="/" className="hover:underline">Home</Link> 
            <span className="mx-2">/</span>
            <Link to="/catalog" className="hover:underline">Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full lg:w-1/2">
              <div className="sticky top-24">
                <div className="aspect-square bg-secondary rounded-xl overflow-hidden mb-4">
                  <img 
                    src={product.images[activeImage]} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      className={cn(
                        "aspect-square rounded-md overflow-hidden border-2",
                        activeImage === index ? "border-primary" : "border-transparent"
                      )}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                {product.videos && product.videos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Product Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.videos.map((video, index) => (
                        <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                          <video 
                            src={video}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Product Info */}
            <div className="w-full lg:w-1/2">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-primary/10 text-primary">
                      {product.condition}
                    </Badge>
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <p className="text-2xl font-semibold text-primary mt-2">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShare}
                    >
                      <Share size={18} />
                    </Button>
                    <Button 
                      variant={isSaved ? "default" : "outline"} 
                      size="icon"
                      onClick={toggleSave}
                    >
                      <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
                    Category: {product.category}
                  </div>
                  {product.room && (
                    <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
                      Room: {product.room}
                    </div>
                  )}
                  {product.used_for && (
                    <div className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
                      Used for: {product.used_for}
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-2">Description</h3>
                  <p className="text-foreground/80 whitespace-pre-line">{product.description}</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-2">Features</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 glass-card p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-3">Seller Information</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="font-medium">{product.sellerInfo.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.sellerInfo.name}</p>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <span>{listingsCount} listings</span>
                        <span>•</span>
                        <span>Joined {product.sellerInfo.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Contact Seller
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={addToCartHandler}
                      className="flex-1 py-6"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2" size={18} />
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={buyNowHandler}
                      className="flex-1 py-6"
                      disabled={product.stock === 0}
                    >
                      Buy Now
                    </Button>
                  </div>
                  
                  {product.stock !== undefined && (
                    <div className={`mt-3 text-center font-medium ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {product.stock === 0 ? (
                        'Out of stock'
                      ) : product.stock === 1 ? (
                        'Last one!'
                      ) : (
                        `${product.stock} in stock`
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl mt-6">
                <h3 className="font-medium text-lg mb-3">Shipping & Returns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TruckIcon />
                    </div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-foreground/70">On orders over KES 5,000</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <RefreshIcon />
                    </div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-foreground/70">30-day satisfaction guarantee</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-secondary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ShieldIcon />
                    </div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-foreground/70">100% secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link to="/catalog" className="text-primary font-medium hover:underline flex items-center">
                View more
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  condition={product.condition}
                  location={product.location}
                  imageSrc={product.imageSrc}
                  stock={product.stock}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Icon components
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3m11 0h4m-4 0V9h4l-3 6v2h-1"></path>
    <circle cx="7" cy="17" r="2"></circle>
    <circle cx="17" cy="17" r="2"></circle>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M8 16H3v5"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
  </svg>
);

export default ProductDetail;