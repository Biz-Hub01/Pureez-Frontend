
import { useState } from "react";
import { 
  Calendar, 
  Image as ImageIcon, 
  Percent, 
  Tag, 
  Trash2, 
  ArrowLeft,
  Clock,
  Check,
  X,
  Search,
  Gavel,
  DollarSign,
  Home,
  Sofa,
  Utensils,
  Bed,
  Bath,
  BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  room?: string;
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

const roomCategories: Category[] = [
  { id: "living", name: "Living Room", icon: <Sofa className="mr-2 h-4 w-4" /> },
  { id: "kitchen", name: "Kitchen", icon: <Utensils className="mr-2 h-4 w-4" /> },
  { id: "bedroom", name: "Bedroom", icon: <Bed className="mr-2 h-4 w-4" /> },
  { id: "bathroom", name: "Bathroom", icon: <Bath className="mr-2 h-4 w-4" /> },
  { id: "office", name: "Home Office", icon: <BookOpen className="mr-2 h-4 w-4" /> },
  { id: "all", name: "All Rooms", icon: <Home className="mr-2 h-4 w-4" /> },
];

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Vintage Wooden Chair",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1561431521-3a5750c4ad77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    room: "living"
  },
  {
    id: "p2",
    name: "Mid-Century Modern Sofa",
    price: 599.99,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    room: "living"
  },
  {
    id: "p3",
    name: "Minimalist Desk Lamp",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Lighting",
    room: "office"
  },
  {
    id: "p4",
    name: "Ergonomic Office Chair",
    price: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1505657435995-a2dd2a4b9b1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    room: "office"
  },
  {
    id: "p5",
    name: "Ceramic Vase Set",
    price: 35.99,
    imageUrl: "https://images.unsplash.com/photo-1602728113720-ce4a4342be32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Decor",
    room: "living"
  },
  {
    id: "p6",
    name: "Vintage Record Player",
    price: 189.99,
    imageUrl: "https://images.unsplash.com/photo-1593078166039-c9878df5c520?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    room: "living"
  }
];

const AdminOfferCreate = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [offerType, setOfferType] = useState<"discount" | "auction">("discount");
  
  // Shared fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishStatus, setPublishStatus] = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  
  // Discount offer fields
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Auction fields
  const [startingBid, setStartingBid] = useState(0);
  const [buyNowPrice, setBuyNowPrice] = useState(0);
  const [minBidIncrement, setMinBidIncrement] = useState(5);
  const [condition, setCondition] = useState("new");
  const [usedForPeriod, setUsedForPeriod] = useState("");
  const [category, setCategory] = useState("");
  
  // UI state
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRoom, setFilterRoom] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setCouponCode(result);
  };

  const handleAddProduct = (product: Product) => {
    if (!selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const getFilteredProducts = () => {
    return sampleProducts.filter(product => {
      // Filter by room if not 'all'
      if (filterRoom !== 'all' && product.room !== filterRoom) return false;
      
      // Filter by category if not 'all'
      if (filterCategory !== 'all' && product.category !== filterCategory) return false;
      
      // Filter by search term
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Don't show products that are already selected
      if (selectedProducts.some(p => p.id === product.id)) return false;
      
      return true;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation for both types
    if (!title || !description || !validUntil || !imageUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Type-specific validation
    if (offerType === "discount") {
      if (discountPercentage <= 0 || !couponCode || selectedProducts.length === 0) {
        toast({
          title: "Missing Discount Information",
          description: "Please fill in all discount offer fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
    } else { // auction
      if (startingBid <= 0 || !category) {
        toast({
          title: "Missing Auction Information",
          description: "Please fill in all auction listing fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would send the data to your API
      toast({
        title: offerType === "discount" ? "Offer Created Successfully" : "Auction Created Successfully",
        description: offerType === "discount" 
          ? "The special offer has been published and is now live."
          : "The auction listing has been published and is now live.",
      });
      
      setIsSubmitting(false);
      // Redirect back to admin dashboard
      navigate("/admin-dashboard");
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Link to="/admin-dashboard" className="flex items-center text-foreground/70 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto">Create New {offerType === "discount" ? "Offer" : "Auction"}</h1>
          <div className="ml-auto"></div>
        </div>
        
        <Tabs value={offerType} onValueChange={(value) => setOfferType(value as "discount" | "auction")} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="discount" className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              Discount Offer
            </TabsTrigger>
            <TabsTrigger value="auction" className="flex items-center">
              <Gavel className="mr-2 h-4 w-4" />
              Auction Listing
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{offerType === "discount" ? "Offer Details" : "Auction Details"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Common fields for both offer types */}
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={offerType === "discount" ? "e.g. Spring Clearance Sale" : "e.g. Vintage Mid-Century Chair"}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the offer and what makes it special..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="validUntil" className="block text-sm font-medium">
                        {offerType === "discount" ? "Valid Until" : "Auction Ends On"} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="validUntil"
                          type="date"
                          value={validUntil}
                          onChange={(e) => setValidUntil(e.target.value)}
                          className="pl-8"
                          min={new Date().toISOString().split('T')[0]} // Set min to today
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Calendar className="h-4 w-4 text-foreground/50" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="imageUrl" className="block text-sm font-medium">
                        Image URL <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="imageUrl"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="pl-8"
                          required
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <ImageIcon className="h-4 w-4 text-foreground/50" />
                        </div>
                      </div>
                      <p className="text-xs text-foreground/70">Enter a URL for an image that represents this {offerType === "discount" ? "offer" : "item"}.</p>
                    </div>
                    
                    {/* Room category selection for both offer types */}
                    <div className="space-y-2">
                      <label htmlFor="roomCategory" className="block text-sm font-medium">
                        Room Category
                      </label>
                      <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room category" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomCategories.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              <div className="flex items-center">
                                {room.icon}
                                {room.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Discount-specific fields */}
                    {offerType === "discount" && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="discountPercentage" className="block text-sm font-medium">
                            Discount Percentage <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              id="discountPercentage"
                              type="number"
                              min="1"
                              max="99"
                              value={discountPercentage || ""}
                              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                              className="pl-8"
                              required
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <Percent className="h-4 w-4 text-foreground/50" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="couponCode" className="block text-sm font-medium">
                            Coupon Code <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="couponCode"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SPRING25"
                                className="pl-8 uppercase"
                                required
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Tag className="h-4 w-4 text-foreground/50" />
                              </div>
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={generateCouponCode}
                            >
                              Generate
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium">
                              Products in this Offer <span className="text-red-500">*</span>
                            </label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowProductSelector(true)}
                            >
                              Add Products
                            </Button>
                          </div>
                          
                          {selectedProducts.length > 0 ? (
                            <div className="space-y-2">
                              {selectedProducts.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                                  <div className="flex items-center">
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name} 
                                      className="w-10 h-10 rounded object-cover mr-3" 
                                    />
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-foreground/70">{formatPrice(product.price)}</div>
                                    </div>
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-foreground/70" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 border border-dashed border-border rounded-md text-center text-foreground/70">
                              No products selected yet. Click "Add Products" to select items for this offer.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Auction-specific fields */}
                    {offerType === "auction" && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="startingBid" className="block text-sm font-medium">
                              Starting Bid <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Input
                                id="startingBid"
                                type="number"
                                min="1"
                                step="0.01"
                                value={startingBid || ""}
                                onChange={(e) => setStartingBid(Number(e.target.value))}
                                className="pl-8"
                                required
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <DollarSign className="h-4 w-4 text-foreground/50" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="buyNowPrice" className="block text-sm font-medium">
                              Buy Now Price <span className="text-muted-foreground">(Optional)</span>
                            </label>
                            <div className="relative">
                              <Input
                                id="buyNowPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={buyNowPrice || ""}
                                onChange={(e) => setBuyNowPrice(Number(e.target.value))}
                                className="pl-8"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <DollarSign className="h-4 w-4 text-foreground/50" />
                              </div>
                            </div>
                            <p className="text-xs text-foreground/70">Leave at 0 for auction-only with no buy now option</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="minBidIncrement" className="block text-sm font-medium">
                            Minimum Bid Increment
                          </label>
                          <div className="relative">
                            <Input
                              id="minBidIncrement"
                              type="number"
                              min="1"
                              step="1"
                              value={minBidIncrement || ""}
                              onChange={(e) => setMinBidIncrement(Number(e.target.value))}
                              className="pl-8"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <DollarSign className="h-4 w-4 text-foreground/50" />
                            </div>
                          </div>
                          <p className="text-xs text-foreground/70">The minimum amount a new bid must exceed the current bid</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="condition" className="block text-sm font-medium">
                              Condition <span className="text-red-500">*</span>
                            </label>
                            <Select value={condition} onValueChange={setCondition}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="like-new">Like New</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="worn">Worn</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-medium">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Furniture">Furniture</SelectItem>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Lighting">Lighting</SelectItem>
                                <SelectItem value="Decor">Decor</SelectItem>
                                <SelectItem value="Kitchenware">Kitchenware</SelectItem>
                                <SelectItem value="Art">Art</SelectItem>
                                <SelectItem value="Collectibles">Collectibles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="usedForPeriod" className="block text-sm font-medium">
                            Used For <span className="text-muted-foreground">(e.g., "6 months" if applicable)</span>
                          </label>
                          <Input
                            id="usedForPeriod"
                            value={usedForPeriod}
                            onChange={(e) => setUsedForPeriod(e.target.value)}
                            placeholder="e.g. 6 months, 2 years"
                          />
                          <p className="text-xs text-foreground/70">Leave blank for new items</p>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4 border-t border-border flex justify-end gap-2">
                      <Button 
                        type="submit" 
                        className="gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Processing..."
                        ) : (
                          <>
                            <Check className="h-4 w-4" /> Create {offerType === "discount" ? "Offer" : "Auction"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-secondary/40 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-foreground/30" />
                    </div>
                  )}
                  
                  {offerType === "discount" ? (
                    discountPercentage > 0 && (
                      <div className="bg-primary text-primary-foreground px-4 py-2 font-semibold text-center -mt-10 relative z-10">
                        {discountPercentage}% OFF
                      </div>
                    )
                  ) : (
                    startingBid > 0 && (
                      <div className="bg-purple-600 text-white px-4 py-2 font-semibold text-center -mt-10 relative z-10">
                        AUCTION
                      </div>
                    )
                  )}
                </div>
                
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">
                    {title || (offerType === "discount" ? "Offer Title" : "Auction Title")}
                  </h2>
                  <p className="mt-2 text-foreground/80">
                    {description || "Description will appear here."}
                  </p>
                  
                  {selectedRoom !== "all" && (
                    <div className="mt-2 flex items-center">
                      <span className="text-sm font-semibold">Room: </span>
                      <span className="ml-2 bg-secondary/50 px-2 py-1 rounded text-xs">
                        {roomCategories.find(r => r.id === selectedRoom)?.name || "Any Room"}
                      </span>
                    </div>
                  )}
                  
                  {offerType === "discount" ? (
                    <>
                      {couponCode && (
                        <div className="mt-4 flex items-center">
                          <span className="text-sm font-semibold">Use code: </span>
                          <span className="ml-2 bg-primary/10 text-primary px-3 py-1 rounded-md font-mono text-sm">
                            {couponCode}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h3 className="font-medium text-sm mb-2">Includes {selectedProducts.length} Products:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducts.slice(0, 3).map(product => (
                            <div key={product.id} className="w-16 h-16 relative">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded" 
                              />
                            </div>
                          ))}
                          {selectedProducts.length > 3 && (
                            <div className="w-16 h-16 bg-secondary/50 rounded flex items-center justify-center text-foreground/70">
                              +{selectedProducts.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {startingBid > 0 && (
                        <div className="mt-4 flex items-center">
                          <span className="text-sm font-semibold">Starting Bid: </span>
                          <span className="ml-2 bg-purple-500/10 text-purple-700 px-3 py-1 rounded-md font-mono text-sm">
                            {formatPrice(startingBid)}
                          </span>
                        </div>
                      )}
                      
                      {buyNowPrice > 0 && (
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-semibold">Buy Now: </span>
                          <span className="ml-2 bg-green-500/10 text-green-700 px-3 py-1 rounded-md font-mono text-sm">
                            {formatPrice(buyNowPrice)}
                          </span>
                        </div>
                      )}
                      
                      {condition && (
                        <div className="mt-4 flex items-center">
                          <span className="text-sm font-semibold">Condition: </span>
                          <span className="ml-2 bg-secondary/50 px-3 py-1 rounded-md text-sm">
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                          </span>
                        </div>
                      )}
                      
                      {usedForPeriod && (
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-semibold">Used for: </span>
                          <span className="ml-2 text-sm text-foreground/70">
                            {usedForPeriod}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {validUntil && (
                    <div className="mt-4 flex items-center text-foreground/70">
                      <Clock className="mr-2" size={18} />
                      <span className="text-sm">
                        {offerType === "discount" ? "Valid until" : "Auction ends"} {new Date(validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Publish Status</label>
                    <Select value={publishStatus} onValueChange={setPublishStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Featured</label>
                    <Switch 
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Product Selector Dialog */}
        <Dialog open={showProductSelector} onOpenChange={setShowProductSelector}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Products for Offer</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
                </div>
                
                <Select 
                  value={filterCategory} 
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Lighting">Lighting</SelectItem>
                    <SelectItem value="Decor">Decor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 overflow-x-auto py-2">
                {roomCategories.map(room => (
                  <Button
                    key={room.id}
                    variant={filterRoom === room.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRoom(room.id)}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    {room.icon}
                    {room.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-1">
              {getFilteredProducts().map(product => (
                <div 
                  key={product.id}
                  className="flex border border-border rounded-lg overflow-hidden hover:border-primary cursor-pointer transition-all"
                  onClick={() => handleAddProduct(product)}
                >
                  <div className="w-20 h-20">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-1">
                    <div className="font-medium line-clamp-1">{product.name}</div>
                    <div className="text-sm text-foreground/70">{formatPrice(product.price)}</div>
                    <div className="flex gap-1 mt-1">
                      <div className="text-xs bg-secondary/50 px-2 py-0.5 rounded w-fit">
                        {product.category}
                      </div>
                      {product.room && (
                        <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded w-fit">
                          {roomCategories.find(r => r.id === product.room)?.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {getFilteredProducts().length === 0 && (
                <div className="col-span-2 text-center py-8 text-foreground/70">
                  <X className="h-8 w-8 mx-auto mb-2" />
                  <p>No matching products found.</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <div className="flex justify-between w-full">
                <div>
                  <span className="text-sm text-foreground/70">
                    Selected: {selectedProducts.length} products
                  </span>
                </div>
                <Button 
                  onClick={() => setShowProductSelector(false)}
                >
                  Done
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default AdminOfferCreate;
