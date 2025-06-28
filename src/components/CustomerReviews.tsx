
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  date: string;
  review: string;
  avatar: string;
  helpful: number;
  notHelpful: number;
};

type CustomerReviewsProps = {
  productId: string;
};

const CustomerReviews = ({ productId }: CustomerReviewsProps) => {
  // Mock reviews data - in a real app, this would come from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      productId: productId,
      userId: "u1",
      userName: "Alex Johnson",
      rating: 5,
      date: "2025-04-01",
      review: "This sofa is absolutely gorgeous! The mid-century design fits perfectly in my apartment, and it's very comfortable. Delivery was quick and the seller was responsive.",
      avatar: "https://i.pravatar.cc/150?img=1",
      helpful: 12,
      notHelpful: 2
    },
    {
      id: "r2",
      productId: productId,
      userId: "u2",
      userName: "Sarah Miller",
      rating: 4,
      date: "2025-03-28",
      review: "Great quality for the price. The color is slightly different than pictured, but still looks nice in my living room. Comfortable and sturdy.",
      avatar: "https://i.pravatar.cc/150?img=2",
      helpful: 8,
      notHelpful: 1
    },
    {
      id: "r3",
      productId: productId,
      userId: "u3",
      userName: "Michael Brown",
      rating: 5,
      date: "2025-03-15",
      review: "Excellent condition for a used piece. Looks almost new! Very satisfied with this purchase.",
      avatar: "https://i.pravatar.cc/150?img=3",
      helpful: 15,
      notHelpful: 0
    }
  ]);
  
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  const [notHelpfulReviews, setNotHelpfulReviews] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest" | "helpful">("newest");
  
  // Calculate average rating and percentages
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  
  const getRatingPercentage = (rating: number) => {
    const count = reviews.filter(review => review.rating === rating).length;
    return reviews.length ? Math.round((count / reviews.length) * 100) : 0;
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userRating) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }
    
    if (reviewText.trim().length < 10) {
      toast({
        title: "Review Required",
        description: "Please write a review with at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new review
    const newReview: Review = {
      id: `r${Date.now()}`,
      productId: productId,
      userId: "current-user",
      userName: "You",
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      review: reviewText,
      avatar: "https://i.pravatar.cc/150?img=8",
      helpful: 0,
      notHelpful: 0
    };
    
    // Add new review to the beginning of the array
    setReviews([newReview, ...reviews]);
    
    // Reset form
    setUserRating(0);
    setReviewText("");
    
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your feedback!",
    });
  };
  
  const markHelpful = (reviewId: string) => {
    if (helpfulReviews[reviewId]) return;
    
    // Update helpfulness count
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));
    
    // Mark as voted
    setHelpfulReviews({ ...helpfulReviews, [reviewId]: true });
    
    // Remove from not helpful if previously marked
    if (notHelpfulReviews[reviewId]) {
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, notHelpful: review.notHelpful - 1 } 
          : review
      ));
      
      const updatedNotHelpful = { ...notHelpfulReviews };
      delete updatedNotHelpful[reviewId];
      setNotHelpfulReviews(updatedNotHelpful);
    }
  };
  
  const markNotHelpful = (reviewId: string) => {
    if (notHelpfulReviews[reviewId]) return;
    
    // Update not helpful count
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, notHelpful: review.notHelpful + 1 } 
        : review
    ));
    
    // Mark as voted
    setNotHelpfulReviews({ ...notHelpfulReviews, [reviewId]: true });
    
    // Remove from helpful if previously marked
    if (helpfulReviews[reviewId]) {
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful - 1 } 
          : review
      ));
      
      const updatedHelpful = { ...helpfulReviews };
      delete updatedHelpful[reviewId];
      setHelpfulReviews(updatedHelpful);
    }
  };
  
  const sortedReviews = () => {
    switch (sortBy) {
      case "newest":
        return [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "highest":
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...reviews].sort((a, b) => a.rating - b.rating);
      case "helpful":
        return [...reviews].sort((a, b) => b.helpful - a.helpful);
      default:
        return reviews;
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Average Rating */}
          <div className="md:w-1/4 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    parseFloat(averageRating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={parseFloat(averageRating) >= star ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-foreground/70">{reviews.length} reviews</span>
          </div>
          
          {/* Rating Breakdown */}
          <div className="md:w-3/4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center mb-2">
                <div className="flex items-center w-20">
                  <span className="text-sm mr-1">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 mx-3">
                  <Progress value={getRatingPercentage(rating)} className="h-2" />
                </div>
                <span className="text-sm w-10 text-right">{getRatingPercentage(rating)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Write a Review Section */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(rating)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(rating)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || userRating) >= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                    fill={(hoverRating || userRating) >= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="review" className="block mb-2 text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="review"
              rows={4}
              className="resize-none"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
            />
            <p className="mt-1 text-sm text-foreground/70">
              Minimum 10 characters required
            </p>
          </div>
          
          <Button type="submit">
            Submit Review
          </Button>
        </form>
      </div>
      
      {/* Reviews List */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </h3>
        
        <div className="flex items-center">
          <span className="text-sm mr-2">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "highest" | "lowest" | "helpful")}
            className="text-sm p-2 rounded-md border border-border bg-background"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedReviews().length > 0 ? (
          sortedReviews().map((review) => (
            <div key={review.id} className="glass-card rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start">
                <div className="flex items-center sm:w-48 mb-4 sm:mb-0">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={review.avatar} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <p className="text-sm text-foreground/70">{formatDate(review.date)}</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 mr-1 ${
                          review.rating >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill={review.rating >= star ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  
                  <p className="text-foreground/90 mb-4">{review.review}</p>
                  
                  <div className="flex items-center text-sm">
                    <span className="mr-4">Was this review helpful?</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`mr-2 ${helpfulReviews[review.id] ? "bg-primary/10" : ""}`}
                      onClick={() => markHelpful(review.id)}
                      disabled={helpfulReviews[review.id] || notHelpfulReviews[review.id]}
                    >
                      Yes ({review.helpful})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={notHelpfulReviews[review.id] ? "bg-primary/10" : ""}
                      onClick={() => markNotHelpful(review.id)}
                      disabled={helpfulReviews[review.id] || notHelpfulReviews[review.id]}
                    >
                      No ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-foreground/70">
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
