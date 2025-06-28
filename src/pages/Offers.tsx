
import { useState, useEffect } from "react";
import { Tag, Clock, ShoppingBag, ArrowRight, Gavel, Eye, Heart, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWishlist } from "@/context/WishlistContext";

export type AuctionItem = {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  imageUrl: string;
  endTime: string;
  status: "active" | "ended" | "sold";
};

type Offer = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  imageUrl: string;
  productIds: string[];
  couponCode: string;
  isAuction?: boolean;
  startingBid?: number;
  currentBid?: number;
  productInfo?: {
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
  };
};

// Mock product data to match with offers
const mockProducts = [
  { id: 'p1', title: 'Vintage Wooden Chair', price: 89.99, image: 'https://images.unsplash.com/photo-1561431521-3a5750c4ad77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'VintageFurnitureKE' },
  { id: 'p2', title: 'Mid-Century Modern Sofa', price: 599.99, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'RetroFindsKenya' },
  { id: 'p3', title: 'Minimalist Desk Lamp', price: 45.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'ModernLightingKE' },
  { id: 'p4', title: 'Antique Coffee Table', price: 120.00, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'ClassicHomesKE' },
  { id: 'p5', title: 'Handcrafted Ceramic Vase', price: 34.50, image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'ArtisanCraftsKenya' },
  { id: 'p6', title: 'Macrame Wall Hanging', price: 28.75, image: 'https://images.unsplash.com/photo-1594150878496-a921e5af8907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', seller: 'HandmadeDecorKE' },
];

const Offers = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "offer1",
      title: "Spring Clearance Sale",
      description: "Refresh your home with huge discounts on selected furniture.",
      discountPercentage: 25,
      validUntil: "2025-05-15",
      imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      productIds: ["p1"],
      couponCode: "SPRING25",
      productInfo: mockProducts[0]
    },
    {
      id: "offer2",
      title: "Vintage Collection",
      description: "Discover our curated collection of vintage items at special prices.",
      discountPercentage: 15,
      validUntil: "2025-06-30",
      imageUrl: "https://images.unsplash.com/photo-1529243856184-fd5465488984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      productIds: ["p2"],
      couponCode: "VINTAGE15",
      productInfo: mockProducts[1]
    },
    {
      id: "auction1",
      title: "Vintage Mid-Century Chair Auction",
      description: "Bid on this rare vintage piece and add character to your living space.",
      discountPercentage: 0,
      validUntil: "2025-04-30",
      imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      productIds: [],
      couponCode: "",
      isAuction: true,
      startingBid: 150,
      currentBid: 220,
      productInfo: {
        id: "auction-p1",
        title: "Vintage Mid-Century Chair",
        price: 220,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        seller: "VintageAuctionsKE"
      }
    },
    {
      id: "auction2",
      title: "Antique Desk Lamp Auction",
      description: "One-of-a-kind antique desk lamp from the 1920s in excellent condition.",
      discountPercentage: 0,
      validUntil: "2025-04-25",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      productIds: [],
      couponCode: "",
      isAuction: true,
      startingBid: 80,
      currentBid: 95,
      productInfo: {
        id: "auction-p2",
        title: "Antique Desk Lamp",
        price: 95,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        seller: "VintageAuctionsKE"
      }
    },
    {
      id: "offer3",
      title: "Kitchen Essentials",
      description: "Upgrade your kitchen with pre-loved essentials at amazing prices.",
      discountPercentage: 20,
      validUntil: "2025-05-01",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      productIds: ["p3"],
      couponCode: "KITCHEN20",
      productInfo: mockProducts[2]
    },
    {
      id: "offer4",
      title: "Home Office Setup",
      description: "Create your perfect home office with discounted furniture and decor.",
      discountPercentage: 30,
      validUntil: "2025-04-30",
      imageUrl: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      productIds: ["p4"],
      couponCode: "OFFICE30",
      productInfo: mockProducts[3]
    }
  ]);
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "discounts" | "auctions">("all");
  
  const calculateDaysRemaining = (dateString: string): number => {
    const today = new Date();
    const validUntil = new Date(dateString);
    const timeDiff = validUntil.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast({
        title: "Coupon Code Copied!",
        description: `${code} has been copied to your clipboard.`,
      });
      
      setTimeout(() => setCopiedCode(null), 3000);
    }).catch(err => {
      toast({
        title: "Could not copy code",
        description: "Please try again or copy it manually.",
        variant: "destructive"
      });
    });
  };

  const getFilteredOffers = () => {
    if (activeFilter === "all") return offers;
    if (activeFilter === "discounts") return offers.filter(offer => !offer.isAuction);
    if (activeFilter === "auctions") return offers.filter(offer => offer.isAuction);
    return offers;
  };

  const handleAddToCart = (e: React.MouseEvent, offer: Offer) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!offer.productInfo) return;

    const product = offer.productInfo;
    const discountedPrice = offer.isAuction ? product.price : product.price * (1 - offer.discountPercentage / 100);
    
    if (isInCart(product.id)) {
      removeFromCart(product.id);
      toast({
        title: "Removed from Cart",
        description: `${product.title} has been removed from your cart.`,
      });
    } else {
      addToCart({
        id: product.id,
        title: product.title,
        price: discountedPrice,
        image: product.image,
        seller: product.seller
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart with${offer.discountPercentage ? ` ${offer.discountPercentage}% discount` : ''}.`,
      });
    }
  };
  
  const handleToggleWishlist = (e: React.MouseEvent, offer: Offer) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!offer.productInfo) return;
    
    const product = offer.productInfo;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.title,
        price: offer.isAuction ? product.price : product.price * (1 - offer.discountPercentage / 100),
        imageUrl: product.image,
        seller: product.seller,
        inStock: true
      });
      
      toast({
        title: "Added to Wishlist",
        description: `${product.title} has been added to your wishlist.`,
      });
    }
  };
  
  const handleShopNow = (offer: Offer) => {
    if (offer.productInfo) {
      const product = offer.productInfo;
      const discountedPrice = offer.isAuction ? product.price : product.price * (1 - offer.discountPercentage / 100);
      
      addToCart({
        id: product.id,
        title: product.title,
        price: discountedPrice,
        image: product.image,
        seller: product.seller
      });
      
      toast({
        title: "Product Added to Cart",
        description: `${product.title} has been added to your cart with${offer.discountPercentage ? ` ${offer.discountPercentage}% discount` : ''}.`,
      });
      
      navigate("/cart");
    } else {
      toast({
        title: "No Products Available",
        description: "This offer doesn't have any associated products.",
        variant: "destructive"
      });
    }
  };

  const viewOfferDetails = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferDialogOpen(true);
  };

  const handlePlaceBid = (auction: Offer) => {
    if (auction.isAuction) {
      navigate(`/auction/${auction.id}`);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Special Offers & Auctions</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover exclusive deals, limited-time offers, and unique auction items. Bid on rare finds or save with special discounts on quality pre-loved items.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-secondary/30 p-1 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Offers
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "discounts" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
              onClick={() => setActiveFilter("discounts")}
            >
              Discounts
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "auctions" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
              onClick={() => setActiveFilter("auctions")}
            >
              Auctions
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {getFilteredOffers().map((offer) => {
            const daysRemaining = calculateDaysRemaining(offer.validUntil);
            const isExpiring = daysRemaining <= 7;
            const isExpired = daysRemaining <= 0;
            
            const isInCartStatus = offer.productInfo ? isInCart(offer.productInfo.id) : false;
            const isInWishlistStatus = offer.productInfo ? isInWishlist(offer.productInfo.id) : false;
            const hasProduct = !!offer.productInfo;
            
            // Calculate original and discounted prices
            let originalPrice = 0;
            let discountedPrice = 0;
            
            if (offer.productInfo) {
              originalPrice = offer.productInfo.price;
              discountedPrice = offer.isAuction ? originalPrice : originalPrice * (1 - offer.discountPercentage / 100);
            }
            
            return (
              <Card key={offer.id} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative">
                  <img 
                    src={offer.imageUrl} 
                    alt={offer.title} 
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {offer.isAuction ? (
                    <Badge className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full font-semibold">
                      AUCTION
                    </Badge>
                  ) : (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                      {offer.discountPercentage}% OFF
                    </div>
                  )}
                  
                  {/* Add Cart/Wishlist buttons */}
                  {hasProduct && (
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <button
                        type="button"
                        className={`p-2 rounded-full bg-white/80 backdrop-blur-sm ${isInWishlistStatus ? "text-red-500" : "text-foreground/60 hover:text-red-500"}`}
                        onClick={(e) => handleToggleWishlist(e, offer)}
                      >
                        <Heart size={18} fill={isInWishlistStatus ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        className={`p-2 rounded-full ${isInCartStatus ? "bg-green-500 text-white" : "bg-white/80 text-foreground/60 hover:text-primary backdrop-blur-sm"}`}
                        onClick={(e) => handleAddToCart(e, offer)}
                      >
                        {isInCartStatus ? <Check size={18} /> : <ShoppingCart size={18} />}
                      </button>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{offer.title}</h2>
                  <p className="text-foreground/80 mb-4">{offer.description}</p>
                  
                  {offer.isAuction ? (
                    <>
                      <div className="flex items-center mb-4">
                        <Gavel className="text-purple-500 mr-2" size={18} />
                        <span className="text-sm font-semibold">Current Bid: </span>
                        <span className="ml-2 bg-purple-500/10 text-purple-700 px-3 py-1 rounded-md font-mono text-sm">
                          {formatPrice(offer.currentBid || 0)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <Clock className={`mr-2 ${isExpiring && !isExpired ? "text-amber-500" : isExpired ? "text-red-500" : "text-foreground/70"}`} size={18} />
                        <span className={`text-sm ${isExpiring && !isExpired ? "text-amber-500 font-semibold" : isExpired ? "text-red-500 font-semibold" : "text-foreground/70"}`}>
                          {isExpired 
                            ? "Auction ended" 
                            : isExpiring 
                            ? `Hurry! Ends in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}` 
                            : `Auction ends on ${new Date(offer.validUntil).toLocaleDateString()}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-secondary/50">
                          Starting Bid: {formatPrice(offer.startingBid || 0)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => viewOfferDetails(offer)}
                          >
                            <Eye className="mr-2" size={16} />
                            View Details
                          </Button>
                          <Button 
                            className="flex items-center"
                            onClick={() => handlePlaceBid(offer)}
                          >
                            <Gavel className="mr-2" size={16} />
                            Place Bid <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Show original and discounted price */}
                      {hasProduct && (
                        <div className="flex items-center mb-4">
                          <Tag className="text-primary mr-2" size={18} />
                          <div className="flex flex-col">
                            <span className="text-sm line-through text-red-500">{formatPrice(originalPrice)}</span>
                            <span className="font-semibold text-green-500">{formatPrice(discountedPrice)}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center mb-4">
                        <Tag className="text-primary mr-2" size={18} />
                        <span className="text-sm font-semibold">Use code: </span>
                        <span 
                          className="ml-2 bg-primary/10 text-primary px-3 py-1 rounded-md font-mono text-sm cursor-pointer"
                          onClick={() => copyCouponCode(offer.couponCode)}
                        >
                          {offer.couponCode}
                          {copiedCode === offer.couponCode && (
                            <span className="ml-2 text-xs text-green-600">Copied!</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <Clock className={`mr-2 ${isExpiring && !isExpired ? "text-amber-500" : isExpired ? "text-red-500" : "text-foreground/70"}`} size={18} />
                        <span className={`text-sm ${isExpiring && !isExpired ? "text-amber-500 font-semibold" : isExpired ? "text-red-500 font-semibold" : "text-foreground/70"}`}>
                          {isExpired 
                            ? "Offer expired" 
                            : isExpiring 
                            ? `Hurry! Only ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left` 
                            : `Valid until ${new Date(offer.validUntil).toLocaleDateString()}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyCouponCode(offer.couponCode)}
                        >
                          Copy Code
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => viewOfferDetails(offer)}
                          >
                            <Eye className="mr-2" size={16} />
                            View Details
                          </Button>
                          <Button 
                            disabled={isExpired || !hasProduct}
                            className="flex items-center"
                            onClick={() => handleShopNow(offer)}
                          >
                            <ShoppingBag className="mr-2" size={16} />
                            Shop Now
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedOffer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-1">{selectedOffer.title}</DialogTitle>
                <DialogDescription>
                  {selectedOffer.isAuction ? 
                    `Current bid: ${formatPrice(selectedOffer.currentBid || 0)}` : 
                    `${selectedOffer.discountPercentage}% discount with code: ${selectedOffer.couponCode}`
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="rounded-lg overflow-hidden mb-6">
                  <img 
                    src={selectedOffer.imageUrl} 
                    alt={selectedOffer.title} 
                    className="w-full h-64 object-cover" 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Description</h3>
                  <p>{selectedOffer.description}</p>
                  
                  {selectedOffer.isAuction ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Starting Bid:</span>
                        <span className="font-medium">{formatPrice(selectedOffer.startingBid || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Bid:</span>
                        <span className="font-medium">{formatPrice(selectedOffer.currentBid || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auction Ends:</span>
                        <span className="font-medium">{new Date(selectedOffer.validUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-medium">{selectedOffer.discountPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">{new Date(selectedOffer.validUntil).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coupon Code:</span>
                        <span 
                          className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer"
                          onClick={() => copyCouponCode(selectedOffer.couponCode)}
                        >
                          {selectedOffer.couponCode}
                        </span>
                      </div>
                      
                      {selectedOffer.productInfo && (
                        <>
                          <div className="flex justify-between">
                            <span>Product Price:</span>
                            <span className="font-medium">{formatPrice(selectedOffer.productInfo.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discounted Price:</span>
                            <span className="font-medium text-green-600">
                              {formatPrice(selectedOffer.productInfo.price * (1 - selectedOffer.discountPercentage / 100))}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setOfferDialogOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedOffer.isAuction ? (
                    <Button 
                      onClick={() => {
                        setOfferDialogOpen(false);
                        handlePlaceBid(selectedOffer);
                      }}
                    >
                      <Gavel className="mr-2" size={16} />
                      Place Bid
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        setOfferDialogOpen(false);
                        handleShopNow(selectedOffer);
                      }}
                      disabled={calculateDaysRemaining(selectedOffer.validUntil) <= 0 || !selectedOffer.productInfo}
                    >
                      <ShoppingBag className="mr-2" size={16} />
                      Shop Now
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default Offers;
