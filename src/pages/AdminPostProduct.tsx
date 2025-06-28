import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Camera, 
  Save, 
  X, 
  Loader2,
  VideoIcon
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

// Form validation schema
const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  condition: z.string().min(1, "Please select a condition"),
  category: z.string().min(1, "Please select a category"),
  room: z.string().optional(),
  location: z.string().min(1, "Please enter a location"),
  usedFor: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminPostProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("images");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Form handling
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      condition: "",
      category: "",
      room: "",
      location: "Nairobi, Kenya",
      usedFor: "",
    },
  });
  
  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to post products");
      }

      // Create the product in the database
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          condition: data.condition,
          category: data.category,
          room: data.room || null,
          location: data.location,
          used_for: data.usedFor || null,
          images: images,
          videos: videos,
          seller_id: user.id, // Admin posts as seller
          status: 'approved' // Admin posts are auto-approved
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Product Posted Successfully",
        description: "Your product has been posted and is now live!",
      });
      
      // Reset form
      form.reset();
      setImages([]);
      setVideos([]);
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
      
    } catch (error: any) {
      console.error("Error posting product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // For demo purposes, we'll use FileReader to show previews
    const newImages: string[] = [];
    let processed = 0;
    
    // Process each file one by one
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          processed += 1;
          
          // When all files are processed
          if (processed === files.length) {
            setImages((prev) => [...prev, ...newImages]);
            setUploading(false);
            
            // Clear the input for future uploads
            if (imageInputRef.current) {
              imageInputRef.current.value = "";
            }
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Process videos using FileReader for preview
    const newVideos: string[] = [];
    let processed = 0;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          newVideos.push(event.target.result as string);
          processed += 1;
          
          // When all files are processed
          if (processed === files.length) {
            setVideos((prev) => [...prev, ...newVideos]);
            setUploading(false);
            
            // Clear the input for future uploads
            if (videoInputRef.current) {
              videoInputRef.current.value = "";
            }
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Define form options
  const conditions = [
    "New with tags", 
    "New without tags", 
    "Excellent used condition", 
    "Good used condition", 
    "Fair condition"
  ];
  
  const categories = [
    "Furniture", 
    "Electronics", 
    "Kitchenware", 
    "Home Décor", 
    "Appliances", 
    "Lighting",
    "Textiles",
    "Storage",
    "Outdoor",
    "Office",
    "Art & Collectibles"
  ];
  
  const rooms = [
    "Living Room",
    "Bedroom", 
    "Kitchen", 
    "Bathroom", 
    "Dining Room", 
    "Office",
    "Outdoor",
    "Kids Room",
    "Hallway",
    "Utility"
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a New Product</h1>
            <p className="text-foreground/70">List a new item as Declutter at Pureez</p>
          </div>
          
          <div className="glass-card p-8 rounded-xl shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Product Media Section with Tabs */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Product Media</h3>
                  
                  <Tabs defaultValue="images" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="images" className="pt-2">
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-foreground/10 backdrop-blur-sm rounded-full"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (imageInputRef.current) {
                              imageInputRef.current.click();
                            }
                          }}
                          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md hover:bg-background/50 transition-colors"
                          disabled={uploading}
                        >
                          {uploading && activeTab === "images" ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          ) : (
                            <>
                              <Camera className="h-6 w-6 mb-2 text-foreground/70" />
                              <span className="text-sm text-foreground/70">Add Image</span>
                            </>
                          )}
                        </button>
                        
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <p className="text-sm text-foreground/70 mt-2">
                        Upload up to 8 images. First image will be the cover image.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="videos" className="pt-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {videos.map((video, index) => (
                          <div key={index} className="relative aspect-video">
                            <video 
                              src={video} 
                              controls
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="absolute top-2 right-2 p-1 bg-foreground/10 backdrop-blur-sm rounded-full"
                            >
                              <X size={16} className="text-white" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (videoInputRef.current) {
                              videoInputRef.current.click();
                            }
                          }}
                          className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md hover:bg-background/50 transition-colors"
                          disabled={uploading}
                        >
                          {uploading && activeTab === "videos" ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          ) : (
                            <>
                              <VideoIcon className="h-6 w-6 mb-2 text-foreground/70" />
                              <span className="text-sm text-foreground/70">Add Video</span>
                            </>
                          )}
                        </button>
                        
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </div>
                      <p className="text-sm text-foreground/70 mt-2">
                        Upload up to 3 videos showing product features and condition.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Vintage Wooden Coffee Table" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (KES)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condition</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditions.map((condition) => (
                                <SelectItem key={condition} value={condition}>
                                  {condition}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="usedFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Used For (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 6 months, 2 years" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room (optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rooms.map((room) => (
                                <SelectItem key={room} value={room}>
                                  {room}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Nairobi, Kenya" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product in detail..." 
                          rows={6}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/admin-dashboard")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Post Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPostProduct;
