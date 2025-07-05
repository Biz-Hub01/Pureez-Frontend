// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   Form, 
//   FormControl, 
//   FormField, 
//   FormItem, 
//   FormLabel, 
//   FormMessage 
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   Camera, 
//   Save, 
//   X, 
//   Loader2,
//   VideoIcon
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { toast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";

// // Form validation schema
// const productSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   price: z.coerce.number().positive("Price must be positive"),
//   description: z.string().min(20, "Description must be at least 20 characters"),
//   condition: z.string().min(1, "Please select a condition"),
//   category: z.string().min(1, "Please select a category"),
//   room: z.string().optional(),
//   location: z.string().min(1, "Please enter a location"),
//   usedFor: z.string().optional(),
// });

// type ProductFormValues = z.infer<typeof productSchema>;

// const SellerListItem = () => {
//   const navigate = useNavigate();
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [videoFiles, setVideoFiles] = useState<File[]>([]);
//   const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isProcessingImages, setIsProcessingImages] = useState(false);
//   const [isProcessingVideos, setIsProcessingVideos] = useState(false);
//   const [user, setUser] = useState(null);
//   const imageInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   const checkUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     setUser(user);
//   };
  
//   // Form handling
//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: "",
//       price: 0,
//       description: "",
//       condition: "",
//       category: "",
//       room: "",
//       location: "Nairobi, Kenya",
//       usedFor: "",
//     },
//   });
  
//   const onSubmit = async (data: ProductFormValues) => {
//     if (imageFiles.length === 0) {
//       toast({
//         title: "Error",
//         description: "Please upload at least one product image",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!user) {
//       toast({
//         title: "Error",
//         description: "You must be logged in to list a product",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Upload media files and get URLs
//       const imageUrls = await Promise.all(
//         imageFiles.map(file => uploadFile(file, 'images'))
//       );
      
//       const videoUrls = videoFiles.length > 0
//         ? await Promise.all(videoFiles.map(file => uploadFile(file, 'videos')))
//         : [];

//       // Create the product in the database (pending approval)
//       const { data: product, error } = await supabase
//         .from('products')
//         .insert({
//           title: data.title,
//           description: data.description,
//           price: Number(data.price),
//           condition: data.condition,
//           category: data.category,
//           room: data.room || null,
//           location: data.location,
//           used_for: data.usedFor || null,
//           images: imageUrls,
//           videos: videoUrls,
//           seller_id: user.id,
//           status: 'pending'
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error('Database error:', error);
//         throw error;
//       }

//       console.log('Product created successfully:', product);

//       toast({
//         title: "Product Submitted Successfully",
//         description: "Your product has been submitted for review. You'll be notified once it's approved.",
//       });
      
//       // Reset form
//       form.reset();
//       setImageFiles([]);
//       setImagePreviews([]);
//       setVideoFiles([]);
//       setVideoPreviews([]);
      
//       // Redirect to seller dashboard
//       navigate("/seller-dashboard");
      
//     } catch (error) {
//       console.error("Error submitting product:", error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to submit product. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const uploadFile = async (file: File, type: 'images' | 'videos'): Promise<string> => {
//     if (!user) throw new Error("User not authenticated");
    
//     const bucketName = 'product-media';

//     const fileName = `${user.id}/${type}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .upload(fileName, file);
    
//     if (error) {
//       console.error(`Error uploading ${type}:`, error);
//       throw new Error(`Failed to upload ${type}: ${error.message}`);
//     }
    
//     const { data: { publicUrl } } = supabase.storage
//       .from(bucketName)
//       .getPublicUrl(data.path);
    
//     return publicUrl;
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
    
//     const newFiles = Array.from(files);
//     const newPreviews: string[] = [];

//     setIsProcessingImages(true);
    
//     let processed = 0;
//     const totalFiles = newFiles.length;
    
//     newFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         if (event.target?.result) {
//           newPreviews.push(event.target.result as string);
//           processed++;
          
//           if (processed === totalFiles) {
//             setImageFiles(prev => [...prev, ...newFiles]);
//             setImagePreviews(prev => [...prev, ...newPreviews]);
//             if (imageInputRef.current) imageInputRef.current.value = "";
//             setIsProcessingImages(false);
//           }
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };
  
//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;
    
//     const newFiles = Array.from(files);
//     const newPreviews: string[] = [];
    
//     setIsProcessingVideos(true);
    
//     let processed = 0;
//     const totalFiles = newFiles.length;
    
//     newFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         if (event.target?.result) {
//           newPreviews.push(event.target.result as string);
//           processed++;
          
//           if (processed === totalFiles) {
//             setVideoFiles(prev => [...prev, ...newFiles]);
//             setVideoPreviews(prev => [...prev, ...newPreviews]);
//             if (videoInputRef.current) videoInputRef.current.value = "";
//             setIsProcessingVideos(false);
//           }
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };
  
//   const removeImage = (index: number) => {
//     setImageFiles(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };
  
//   const removeVideo = (index: number) => {
//     setVideoFiles(prev => prev.filter((_, i) => i !== index));
//     setVideoPreviews(prev => prev.filter((_, i) => i !== index));
//   };
  
//   const conditions = [
//     "New with tags", 
//     "New without tags", 
//     "Excellent used condition", 
//     "Good used condition", 
//     "Fair condition"
//   ];
  
//   const categories = [
//     "Furniture", 
//     "Electronics", 
//     "Kitchenware", 
//     "Home Décor", 
//     "Appliances", 
//     "Lighting",
//     "Textiles",
//     "Storage",
//     "Outdoor",
//     "Office",
//     "Art & Collectibles"
//   ];
  
//   const rooms = [
//     "Living Room",
//     "Bedroom", 
//     "Kitchen", 
//     "Bathroom", 
//     "Dining Room", 
//     "Office",
//     "Outdoor",
//     "Kids Room",
//     "Hallway",
//     "Utility"
//   ];

//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto px-4 py-24">
//           <div className="flex justify-center items-center min-h-[400px]">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//               <p className="text-foreground/70">Checking authentication...</p>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-24">
//         <div className="max-w-4xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">List Your Item</h1>
//             <p className="text-foreground/70">Submit your product for approval and get it listed on our marketplace</p>
//           </div>
          
//           <div className="glass-card p-8 rounded-xl shadow-sm">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 {/* Combined Media Upload Section */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-medium mb-3">Product Media</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Images Column */}
//                     <div>
//                       <h4 className="font-medium mb-2 flex items-center">
//                         <Camera className="h-5 w-5 mr-2 text-primary" />
//                         Images
//                       </h4>
                      
//                       <div className="grid grid-cols-3 gap-4 mb-4">
//                         {imagePreviews.map((preview, index) => (
//                           <div key={index} className="relative aspect-square">
//                             <img 
//                               src={preview} 
//                               alt={`Preview ${index + 1}`}
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeImage(index)}
//                               className="absolute top-2 right-2 p-1 bg-foreground/10 backdrop-blur-sm rounded-full"
//                             >
//                               <X size={16} className="text-white" />
//                             </button>
//                           </div>
//                         ))}
                        
//                         <button
//                           type="button"
//                           onClick={() => imageInputRef.current?.click()}
//                           className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md hover:bg-background/50 transition-colors"
//                           disabled={isProcessingImages}
//                         >
//                           {isProcessingImages ? (
//                             <Loader2 className="h-6 w-6 animate-spin text-primary" />
//                           ) : (
//                             <>
//                               <Camera className="h-6 w-6 mb-2 text-foreground/70" />
//                               <span className="text-sm text-foreground/70">Add Image</span>
//                             </>
//                           )}
//                         </button>
                        
//                         <input
//                           ref={imageInputRef}
//                           type="file"
//                           accept="image/*"
//                           multiple
//                           className="hidden"
//                           onChange={handleImageUpload}
//                         />
//                       </div>
//                       <p className="text-sm text-foreground/70">
//                         Upload up to 8 images. First image will be the cover image.
//                       </p>
//                     </div>
                    
//                     {/* Videos Column */}
//                     <div>
//                       <h4 className="font-medium mb-2 flex items-center">
//                         <VideoIcon className="h-5 w-5 mr-2 text-primary" />
//                         Videos
//                       </h4>
                      
//                       <div className="grid grid-cols-1 gap-4 mb-4">
//                         {videoPreviews.map((preview, index) => (
//                           <div key={index} className="relative aspect-video">
//                             <video 
//                               src={preview} 
//                               controls
//                               className="w-full h-full object-cover rounded-md"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeVideo(index)}
//                               className="absolute top-2 right-2 p-1 bg-foreground/10 backdrop-blur-sm rounded-full"
//                             >
//                               <X size={16} className="text-white" />
//                             </button>
//                           </div>
//                         ))}
                        
//                         <button
//                           type="button"
//                           onClick={() => videoInputRef.current?.click()}
//                           className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md hover:bg-background/50 transition-colors"
//                           disabled={isProcessingVideos}
//                         >
//                           {isProcessingVideos ? (
//                             <Loader2 className="h-6 w-6 animate-spin text-primary" />
//                           ) : (
//                             <>
//                               <VideoIcon className="h-6 w-6 mb-2 text-foreground/70" />
//                               <span className="text-sm text-foreground/70">Add Video</span>
//                             </>
//                           )}
//                         </button>
                        
//                         <input
//                           ref={videoInputRef}
//                           type="file"
//                           accept="video/*"
//                           multiple
//                           className="hidden"
//                           onChange={handleVideoUpload}
//                         />
//                       </div>
//                       <p className="text-sm text-foreground/70">
//                         Upload up to 3 videos showing product features and condition.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Product Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="space-y-6">
//                     <FormField
//                       control={form.control}
//                       name="title"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product Title</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g. Vintage Wooden Coffee Table" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="price"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Price (KES)</FormLabel>
//                           <FormControl>
//                             <Input type="text" min="0" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="condition"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Condition</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select condition" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {conditions.map((condition) => (
//                                 <SelectItem key={condition} value={condition}>
//                                   {condition}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="usedFor"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Used For (optional)</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g. 6 months, 2 years" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
                  
//                   <div className="space-y-6">
//                     <FormField
//                       control={form.control}
//                       name="category"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Category</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select category" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {categories.map((category) => (
//                                 <SelectItem key={category} value={category}>
//                                   {category}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="room"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Room (optional)</FormLabel>
//                           <Select onValueChange={field.onChange} defaultValue={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select room" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {rooms.map((room) => (
//                                 <SelectItem key={room} value={room}>
//                                   {room}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="location"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Location</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g. Nairobi, Kenya" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
                
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product Description</FormLabel>
//                       <FormControl>
//                         <Textarea 
//                           placeholder="Describe your product in detail..." 
//                           rows={6}
//                           {...field} 
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
                
//                 <div className="flex justify-end space-x-4 pt-4">
//                   <Button 
//                     type="button" 
//                     variant="outline"
//                     onClick={() => navigate("/seller-dashboard")}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </Button>
//                   <Button 
//                     type="submit" 
//                     className="flex gap-2"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 size={18} className="animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Save size={18} />
//                         Submit for Approval
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default SellerListItem;