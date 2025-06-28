
import { useState, useEffect } from "react";
import { Star, ThumbsUp, User, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Review = {
  id: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  isVerified?: boolean;
  images?: string[];
};

type ReviewSectionProps = {
  productId: string;
  productName: string;
};

const ReviewSection = ({ productId, productName }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "review1",
      username: "John D.",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      date: "March 15, 2025",
      content: "This is exactly what I was looking for! The quality exceeded my expectations and it looks even better in person. Highly recommend!",
      helpful: 12,
      isVerified: true
    },
    {
      id: "review2",
      username: "Sarah M.",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      rating: 4,
      date: "March 10, 2025",
      content: "Great product overall. The only reason I'm not giving 5 stars is because the delivery took a bit longer than expected. But the quality is excellent.",
      helpful: 8,
      isVerified: true
    },
    {
      id: "review3",
      username: "Robert K.",
      rating: 5,
      date: "March 3, 2025",
      content: "Absolutely love it! Perfect addition to my living room.",
      helpful: 5
    },
    {
      id: "review4",
      username: "Emily W.",
      avatarUrl: "https://i.pravatar.cc/150?img=9",
      rating: 3,
      date: "February 28, 2025",
      content: "The product is good but not great. It's a bit smaller than I expected based on the photos.",
      helpful: 2,
      isVerified: true,
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
      ]
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
    name: "",
    email: "",
    images: [] as string[],
    isVerified: false
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sort, setSort] = useState<"newest" | "highest" | "lowest" | "helpful">("newest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  
  const { toast } = useToast();

  useEffect(() => {
    // Apply filters and sorting
    let result = [...reviews];
    
    // Filter by rating
    if (filterRating !== "all") {
      result = result.filter(review => review.rating === filterRating);
    }
    
    // Apply sorting
    switch (sort) {
      case "newest":
        result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "highest":
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        result = result.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        result = result.sort((a, b) => b.helpful - a.helpful);
        break;
    }
    
    setFilteredReviews(result);
  }, [reviews, filterRating, sort]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getStarCount = (rating: number) => {
    return reviews.filter(review => review.rating === rating).length;
  };

  const getStarPercentage = (rating: number) => {
    if (reviews.length === 0) return 0;
    return (getStarCount(rating) / reviews.length) * 100;
  };

  const handleSubmitReview = () => {
    if (!newReview.content.trim() || !newReview.name.trim()) {
      toast({
        title: "Error",
        description: "Please provide your name and review content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReviewObj: Review = {
        id: `review${Date.now()}`,
        username: newReview.name,
        rating: newReview.rating,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        content: newReview.content,
        helpful: 0,
        isVerified: newReview.isVerified,
        images: newReview.images.length > 0 ? [...newReview.images] : undefined
      };

      setReviews([newReviewObj, ...reviews]);
      setNewReview({ 
        rating: 5, 
        content: "",
        name: "",
        email: "",
        images: [],
        isVerified: false
      });
      setDialogOpen(false);
      setIsSubmitting(false);
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });
    }, 1500);
  };

  const markAsHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));

    toast({
      description: "You marked this review as helpful"
    });
  };

  const handleAddImage = () => {
    if (imageURL.trim() && newReview.images.length < 3) {
      setNewReview({
        ...newReview,
        images: [...newReview.images, imageURL]
      });
      setImageURL("");
    } else if (newReview.images.length >= 3) {
      toast({
        description: "You can add up to 3 images",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...newReview.images];
    updatedImages.splice(index, 1);
    setNewReview({
      ...newReview,
      images: updatedImages
    });
  };

  const averageRating = calculateAverageRating();
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                />
              ))}
            </div>
            <div className="text-sm text-foreground/70 mb-4">Based on {reviews.length} reviews</div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Review {productName}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating*</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= newReview.rating 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-gray-300"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name*</label>
                    <Input 
                      placeholder="Enter your name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email (not published)</label>
                    <Input 
                      type="email"
                      placeholder="Enter your email"
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review*</label>
                    <Textarea 
                      placeholder="Share your experience with this product..."
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      className="h-32"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Images (optional)</label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Enter image URL"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddImage} variant="outline">
                        Add
                      </Button>
                    </div>
                    {newReview.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newReview.images.map((img, i) => (
                          <div key={i} className="relative w-16 h-16 group">
                            <img src={img} alt="Review" className="w-full h-full object-cover rounded" />
                            <button
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded transition-opacity"
                              onClick={() => removeImage(i)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-foreground/70 mt-1">
                      You can add up to 3 images
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="verified" 
                      checked={newReview.isVerified}
                      onCheckedChange={(checked) => 
                        setNewReview({...newReview, isVerified: checked === true})
                      }
                    />
                    <label htmlFor="verified" className="text-sm">
                      I purchased this product (verified buyer)
                    </label>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitReview} 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <div className="w-10 text-sm">{rating} star</div>
                <div className="flex-1 mx-4">
                  <Progress value={getStarPercentage(rating)} className="h-2" />
                </div>
                <div className="w-10 text-sm text-right">
                  {getStarCount(rating)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div>
              <label className="text-sm font-medium block mb-1">Filter by</label>
              <Select 
                value={String(filterRating)} 
                onValueChange={(value) => setFilterRating(value === "all" ? "all" : Number(value))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Sort by</label>
              <Select 
                value={sort} 
                onValueChange={(value) => setSort(value as any)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Newest first" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="highest">Highest rating</SelectItem>
                  <SelectItem value="lowest">Lowest rating</SelectItem>
                  <SelectItem value="helpful">Most helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No reviews match your selected filter. Try a different rating filter.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {filteredReviews.map(review => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-start">
                <div className="mr-4">
                  {review.avatarUrl ? (
                    <img 
                      src={review.avatarUrl} 
                      alt={review.username} 
                      className="w-12 h-12 rounded-full" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-6 h-6 text-secondary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="font-medium">
                      {review.username}
                      {review.isVerified && (
                        <span className="inline-block ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    
                    <div className="flex ml-auto">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-foreground/70 mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {review.date}
                  </div>
                  
                  <p className="mb-4">{review.content}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={img} 
                          alt="Review" 
                          className="w-20 h-20 object-cover rounded" 
                        />
                      ))}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => markAsHelpful(review.id)}
                    className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
