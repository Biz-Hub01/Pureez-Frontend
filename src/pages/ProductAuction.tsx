import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, 
  ArrowLeft, 
  User, 
  DollarSign, 
  Gavel, 
  Tag, 
  ShoppingBag,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

type Bid = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
};

type AuctionItem = {
  id: string;
  title: string;
  description: string;
  condition: string;
  usedFor: string;
  startingPrice: number;
  currentBid: number;
  buyNowPrice: number;
  minimumBidIncrement: number;
  imageUrl: string;
  additionalImages: string[];
  endTime: Date;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  bids: Bid[];
  status: "active" | "ended" | "sold";
  category: string;
};

const sampleAuction: AuctionItem = {
  id: "a1",
  title: "Vintage Mid-Century Modern Lounge Chair",
  description: "Authentic mid-century modern lounge chair from the 1960s. Featuring original teak wood frame with newly reupholstered olive green fabric. This piece adds character and comfort to any living space. Minor signs of wear consistent with age, but overall excellent condition.",
  condition: "Good",
  usedFor: "5 years",
  startingPrice: 150,
  currentBid: 220,
  buyNowPrice: 450,
  minimumBidIncrement: 10,
  imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  additionalImages: [
    "https://images.unsplash.com/photo-1565814329452-e1efa11f5cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579656450812-5b1da79e2474?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  endTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
  seller: {
    id: "s1",
    name: "Vintage Treasures",
    rating: 4.8
  },
  bids: [
    {
      id: "b1",
      userId: "u1",
      userName: "JaneDoe",
      amount: 220,
      timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000)
    },
    {
      id: "b2",
      userId: "u2",
      userName: "JohnSmith",
      amount: 210,
      timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000)
    },
    {
      id: "b3",
      userId: "u3",
      userName: "AlexK",
      amount: 200,
      timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000)
    },
    {
      id: "b4",
      userId: "u4",
      userName: "MikeT",
      amount: 180,
      timestamp: new Date(new Date().getTime() - 12 * 60 * 60 * 1000)
    },
    {
      id: "b5",
      userId: "u5",
      userName: "SarahJ",
      amount: 160,
      timestamp: new Date(new Date().getTime() - 18 * 60 * 60 * 1000)
    }
  ],
  status: "active",
  category: "Furniture"
};

const ProductAuction = () => {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [bidInputValue, setBidInputValue] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showBuyNowDialog, setShowBuyNowDialog] = useState(false);
  const [bidHistoryExpanded, setBidHistoryExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();
  const { formatPrice, currentCurrency } = useCurrency();

  useEffect(() => {
    setAuction(sampleAuction);
    setCurrentBid(sampleAuction.currentBid);
    setSelectedImage(sampleAuction.imageUrl);
    setBidInputValue(sampleAuction.currentBid + sampleAuction.minimumBidIncrement);
  }, [id]);

  useEffect(() => {
    if (auction) {
      const updateTimer = () => {
        const now = new Date();
        const end = new Date(auction.endTime);
        const distance = end.getTime() - now.getTime();
        
        if (distance <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(intervalRef.current || undefined);
          setAuction({ ...auction, status: "ended" });
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          setTimeLeft({ days, hours, minutes, seconds });
        }
      };
      
      updateTimer();
      
      intervalRef.current = setInterval(updateTimer, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [auction]);

  const handleBidIncrement = () => {
    if (auction) {
      const newBid = bidInputValue + auction.minimumBidIncrement;
      setBidInputValue(newBid);
    }
  };

  const handleBidDecrement = () => {
    if (auction && bidInputValue > auction.currentBid + auction.minimumBidIncrement) {
      const newBid = bidInputValue - auction.minimumBidIncrement;
      setBidInputValue(newBid);
    }
  };

  const handlePlaceBid = () => {
    if (!auction) return;
    
    if (bidInputValue <= auction.currentBid) {
      toast({
        title: "Bid Too Low",
        description: `Your bid must be higher than the current bid of $${auction.currentBid.toFixed(2)}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (bidInputValue < auction.currentBid + auction.minimumBidIncrement) {
      toast({
        title: "Minimum Increment Not Met",
        description: `Minimum bid increment is $${auction.minimumBidIncrement}. Please bid at least $${(auction.currentBid + auction.minimumBidIncrement).toFixed(2)}.`,
        variant: "destructive"
      });
      return;
    }
    
    const newBid: Bid = {
      id: `b${auction.bids.length + 1}`,
      userId: "current-user",
      userName: "You",
      amount: bidInputValue,
      timestamp: new Date()
    };
    
    const updatedBids = [newBid, ...auction.bids];
    const updatedAuction = {
      ...auction,
      bids: updatedBids,
      currentBid: bidInputValue
    };
    
    setAuction(updatedAuction);
    setCurrentBid(bidInputValue);
    setShowBidDialog(false);
    
    toast({
      title: "Bid Placed Successfully",
      description: `You are now the highest bidder at $${bidInputValue.toFixed(2)}.`,
    });
    
    setBidInputValue(bidInputValue + auction.minimumBidIncrement);
  };

  const handleBuyNow = () => {
    if (!auction) return;
    
    const updatedAuction = {
      ...auction,
      status: "sold" as "active" | "ended" | "sold"
    };
    
    setAuction(updatedAuction);
    setShowBuyNowDialog(false);
    
    addToCart({
      id: auction.id,
      title: auction.title,
      price: auction.buyNowPrice,
      image: auction.imageUrl,
      seller: auction.seller.name
    });
    
    toast({
      title: "Purchase Successful",
      description: `${auction.title} has been added to your cart.`,
    });
  };

  if (!auction || !timeLeft) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-secondary rounded-full mx-auto mb-4"></div>
            <div className="h-4 w-32 bg-secondary rounded-full mx-auto"></div>
          </div>
          <p className="mt-8">Loading auction details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-6">
          <Link to="/catalog" className="flex items-center text-foreground/70 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={selectedImage} 
                alt={auction.title} 
                className="w-full h-96 object-cover" 
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div 
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                  selectedImage === auction.imageUrl ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(auction.imageUrl)}
              >
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title} 
                  className="w-full h-20 object-cover" 
                />
              </div>
              {auction.additionalImages.map((img, index) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedImage === img ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${auction.title} ${index + 1}`} 
                    className="w-full h-20 object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Badge className="mr-2 bg-primary">{auction.category}</Badge>
                <Badge variant="outline">{auction.condition}</Badge>
                <Badge variant="outline" className="ml-2">Used for {auction.usedFor}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
              <div className="flex items-center text-foreground/70">
                <User className="h-4 w-4 mr-1" />
                <span>Seller: {auction.seller.name}</span>
                <span className="mx-2">•</span>
                <span>Rating: {auction.seller.rating}/5</span>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-foreground/70 text-sm">Current Bid</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(currentBid)}</p>
                    <p className="text-sm">
                      {auction.bids.length > 0 ? `${auction.bids.length} bid${auction.bids.length > 1 ? 's' : ''}` : 'No bids yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-sm">Buy Now Price</p>
                    <p className="text-2xl font-bold">{formatPrice(auction.buyNowPrice)}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-semibold">Time Remaining</h3>
                  </div>
                  
                  {auction.status === "active" ? (
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-secondary/30 p-2 rounded-md text-center">
                        <p className="text-2xl font-bold">{timeLeft.days}</p>
                        <p className="text-xs">Days</p>
                      </div>
                      <div className="bg-secondary/30 p-2 rounded-md text-center">
                        <p className="text-2xl font-bold">{timeLeft.hours}</p>
                        <p className="text-xs">Hours</p>
                      </div>
                      <div className="bg-secondary/30 p-2 rounded-md text-center">
                        <p className="text-2xl font-bold">{timeLeft.minutes}</p>
                        <p className="text-xs">Minutes</p>
                      </div>
                      <div className="bg-secondary/30 p-2 rounded-md text-center">
                        <p className="text-2xl font-bold">{timeLeft.seconds}</p>
                        <p className="text-xs">Seconds</p>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="destructive" className="mt-2">Auction Ended</Badge>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setShowBidDialog(true)}
                    className="flex-1 flex items-center justify-center"
                    disabled={auction.status !== "active"}
                  >
                    <Gavel className="mr-2 h-5 w-5" />
                    Place Bid
                  </Button>
                  <Button
                    onClick={() => setShowBuyNowDialog(true)}
                    className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700"
                    disabled={auction.status !== "active"}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now: {formatPrice(auction.buyNowPrice)}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Bid History</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setBidHistoryExpanded(!bidHistoryExpanded)}
                  >
                    {bidHistoryExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={`${bidHistoryExpanded ? '' : 'max-h-32 overflow-hidden'}`}>
                {auction.bids.length > 0 ? (
                  <div className="space-y-4">
                    {auction.bids.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-foreground/70" />
                          <span className="font-medium">{bid.userName}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold">{formatPrice(bid.amount)}</span>
                          <span className="ml-3 text-xs text-foreground/70">
                            {new Date(bid.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-foreground/70">No bids placed yet. Be the first!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="glass-card p-6 rounded-xl">
            <p className="mb-4">{auction.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Item Details</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32">Condition:</span>
                    <span>{auction.condition}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Used For:</span>
                    <span>{auction.usedFor}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Category:</span>
                    <span>{auction.category}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Auction Information</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32">Starting Bid:</span>
                    <span>{formatPrice(auction.startingPrice)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Current Bid:</span>
                    <span>{formatPrice(currentBid)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Min. Increment:</span>
                    <span>{formatPrice(auction.minimumBidIncrement)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Buy Now Price:</span>
                    <span>{formatPrice(auction.buyNowPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Your Bid</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Current Highest Bid:</span>
                <span className="font-semibold">{formatPrice(currentBid)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Minimum Bid:</span>
                <span className="font-semibold">{formatPrice(currentBid + auction.minimumBidIncrement)}</span>
              </div>
              
              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium mb-2">
                  Your Bid Amount
                </label>
                <div className="flex items-center">
                  <span className="bg-secondary px-3 py-2 rounded-l-md border border-r-0 border-border">
                    <DollarSign className="h-5 w-5 text-foreground/50" />
                  </span>
                  <Input
                    type="number"
                    value={bidInputValue}
                    onChange={(e) => setBidInputValue(Number(e.target.value))}
                    className="rounded-l-none"
                    min={currentBid + auction.minimumBidIncrement}
                    step={auction.minimumBidIncrement}
                  />
                  <div className="flex flex-col ml-2">
                    <button 
                      className="p-1 text-foreground/70 hover:text-foreground"
                      onClick={handleBidIncrement}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1 text-foreground/70 hover:text-foreground"
                      onClick={handleBidDecrement}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-foreground/70">
                  <Info className="h-4 w-4 mr-1" />
                  Minimum bid increment is {formatPrice(auction.minimumBidIncrement)}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowBidDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePlaceBid}
                disabled={bidInputValue < currentBid + auction.minimumBidIncrement}
              >
                <Gavel className="mr-2 h-4 w-4" />
                Confirm Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showBuyNowDialog} onOpenChange={setShowBuyNowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy Now</DialogTitle>
              <DialogDescription>
                You are about to purchase this item at the Buy Now price.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Item:</span>
                <span className="font-semibold">{auction.title}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Buy Now Price:</span>
                <span className="font-bold text-xl">{formatPrice(auction.buyNowPrice)}</span>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Skip the auction</p>
                  <p className="text-sm text-foreground/70">Pay now and get this item immediately without waiting for the auction to end.</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowBuyNowDialog(false)}
              >
                Cancel
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleBuyNow}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Buy Now: {formatPrice(auction.buyNowPrice)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Item will be added to your cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default ProductAuction;
