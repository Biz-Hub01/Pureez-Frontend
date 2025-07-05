// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { 
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus, AlertCircle, CheckCircle, Clock, Package, DollarSign, Edit, Trash2, Eye, Tag, Gavel } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { toast } from "@/hooks/use-toast";
// import { useCurrency } from "@/context/CurrencyContext";
// import { supabase } from "@/integrations/supabase/client";
// import CreateOfferDialog from "@/components/offers/CreateOfferDialog";
// import CreateAuctionDialog from "@/components/auctions/CreateAuctionDialog";

// type ProductStatus = "pending" | "approved" | "rejected";

// type SellerProduct = {
//   id: string;
//   title: string;
//   price: number;
//   category: string;
//   status: ProductStatus;
//   created_at: string;
//   images: string[];
// };

// type SellerOffer = {
//   id: string;
//   title: string;
//   productId: string;
//   productTitle: string;
//   discountPercentage: number;
//   startDate: string;
//   endDate: string;
//   description: string | null;
// };

// type SellerAuction = {
//   id: string;
//   title: string;
//   productId: string;
//   productTitle: string;
//   startingPrice: number;
//   currentBid: number | null;
//   startDate: string;
//   endDate: string;
//   status: string;
//   description: string | null;
// };

// type SaleType = {
//   id: string;
//   productId: string;
//   productTitle: string;
//   buyer: string;
//   date: string;
//   amount: number;
//   status: string;
//   address: string;
//   phone: string;
//   email: string;
//   itemsOrdered: number;
//   paymentMethod: string;
// };

// const SellerDashboard = () => {
//   const navigate = useNavigate();
//   const { formatPrice } = useCurrency();
//   const [products, setProducts] = useState<SellerProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);
//   const [sales, setSales] = useState<SaleType[]>([]);
//   const [offers, setOffers] = useState<SellerOffer[]>([]);
//   const [auctions, setAuctions] = useState<SellerAuction[]>([]);
//   const [selectedSale, setSelectedSale] = useState<SaleType | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<string | null>(null);
//   const [offerDialogOpen, setOfferDialogOpen] = useState(false);
//   const [auctionDialogOpen, setAuctionDialogOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("listings");

//   useEffect(() => {
//     // Check if user is authenticated
//     const checkAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) {
//         toast({
//           title: "Authentication Required",
//           description: "Please log in to access the seller dashboard",
//           variant: "destructive",
//         });
//         navigate("/login");
//         return;
//       }
//       setUser(session.user);
//       fetchProducts(session.user.id);
//       fetchSales(session.user.id);
//       setupRealtimeSubscriptions(session.user.id);
//     };

//     checkAuth();

//     return () => {
//       // Clean up subscriptions when component unmounts
//       supabase.removeAllChannels();
//     };
//   }, [navigate]);


//   const setupRealtimeSubscriptions = (sellerId: string) => {
//     // Products subscription
//     const productsChannel = supabase
//       .channel('products')
//       .on('postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'products',
//         filter: `seller_id=eq.${sellerId}`
//       }, (payload) => {
//         handleProductChange(payload);
//       })
//       .subscribe();

//     // Offers subscription
//     const offersChannel = supabase
//       .channel('offers')
//       .on('postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'seller_offers',
//         filter: `seller_id=eq.${sellerId}`
//       }, (payload) => {
//         handleOfferChange(payload);
//       })
//       .subscribe();

//     // Auctions subscription
//     const auctionsChannel = supabase
//       .channel('auctions')
//       .on('postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'seller_auctions',
//         filter: `seller_id=eq.${sellerId}`
//       }, (payload) => {
//         handleAuctionChange(payload);
//       })
//       .subscribe();

//     // Sales subscription
//     const salesChannel = supabase
//       .channel('sales')
//       .on('postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'sales',
//         filter: `seller_id=eq.${sellerId}`
//       }, (payload) => {
//         handleSaleChange(payload);
//       })
//       .subscribe();
//   };

//   const handleProductChange = (payload) => {
//     if (payload.eventType === 'INSERT') {
//       const newProduct = formatProduct(payload.new);
//       setProducts(prev => [...prev, newProduct]);
//     } else if (payload.eventType === 'UPDATE') {
//       setProducts(prev => 
//         prev.map(product => 
//           product.id === payload.new.id ? formatProduct(payload.new) : product
//         )
//       );
//     } else if (payload.eventType === 'DELETE') {
//       setProducts(prev => prev.filter(product => product.id !== payload.old.id));
//     }
//   };

//   const handleOfferChange = (payload) => {
//     if (payload.eventType === 'INSERT') {
//       const newOffer = formatOffer(payload.new);
//       setOffers(prev => [...prev, newOffer]);
//     } else if (payload.eventType === 'UPDATE') {
//       setOffers(prev => 
//         prev.map(offer => 
//           offer.id === payload.new.id ? formatOffer(payload.new) : offer
//         )
//       );
//     } else if (payload.eventType === 'DELETE') {
//       setOffers(prev => prev.filter(offer => offer.id !== payload.old.id));
//     }
//   };

//   const handleAuctionChange = (payload) => {
//     if (payload.eventType === 'INSERT') {
//       const newAuction = formatAuction(payload.new);
//       setAuctions(prev => [...prev, newAuction]);
//     } else if (payload.eventType === 'UPDATE') {
//       setAuctions(prev => 
//         prev.map(auction => 
//           auction.id === payload.new.id ? formatAuction(payload.new) : auction
//         )
//       );
//     } else if (payload.eventType === 'DELETE') {
//       setAuctions(prev => prev.filter(auction => auction.id !== payload.old.id));
//     }
//   };

//   const handleSaleChange = (payload) => {
//     if (payload.eventType === 'INSERT') {
//       const newSale = formatSale(payload.new);
//       setSales(prev => [...prev, newSale]);
//     } else if (payload.eventType === 'UPDATE') {
//       setSales(prev => 
//         prev.map(sale => 
//           sale.id === payload.new.id ? formatSale(payload.new) : sale
//         )
//       );
//     } else if (payload.eventType === 'DELETE') {
//       setSales(prev => prev.filter(sale => sale.id !== payload.old.id));
//     }
//   };

//   const formatProduct = (product): SellerProduct => ({
//     id: product.id,
//     title: product.title,
//     price: product.price,
//     category: product.category,
//     status: product.status as ProductStatus,
//     created_at: new Date(product.created_at).toLocaleDateString(),
//     images: product.images || []
//   });

//   const formatOffer = (offer): SellerOffer => ({
//     id: offer.id,
//     title: offer.title,
//     productId: offer.product_id,
//     productTitle: products.find(p => p.id === offer.product_id)?.title || "Unknown Product",
//     discountPercentage: offer.discount_percentage,
//     startDate: new Date(offer.start_date).toLocaleDateString(),
//     endDate: new Date(offer.end_date).toLocaleDateString(),
//     description: offer.description
//   });

//   const formatAuction = (auction): SellerAuction => ({
//     id: auction.id,
//     title: auction.title,
//     productId: auction.product_id,
//     productTitle: products.find(p => p.id === auction.product_id)?.title || "Unknown Product",
//     startingPrice: Number(auction.starting_price),
//     currentBid: auction.current_bid ? Number(auction.current_bid) : null,
//     startDate: new Date(auction.start_date).toLocaleDateString(),
//     endDate: new Date(auction.end_date).toLocaleDateString(),
//     status: auction.status,
//     description: auction.description
//   });

//   const formatSale = (sale): SaleType => ({
//     id: sale.id,
//     productId: sale.product_id,
//     productTitle: sale.product_title || "Unknown Product",
//     buyer: sale.buyer_name || "Unknown Buyer",
//     date: new Date(sale.created_at).toLocaleDateString(),
//     amount: sale.amount,
//     status: sale.status,
//     address: sale.address || "",
//     phone: sale.phone || "",
//     email: sale.email || "",
//     itemsOrdered: sale.items_ordered || 1,
//     paymentMethod: sale.payment_method || "Unknown"
//   });

//   const fetchProducts = async (sellerId: string) => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('products')
//         .select('*')
//         .eq('seller_id', sellerId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       if (data) {
//         const formattedProducts = data.map(formatProduct);
//         setProducts(formattedProducts);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load products",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSales = async (sellerId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('sales')
//         .select('*')
//         .eq('seller_id', sellerId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       if (data) {
//         const formattedSales = data.map(formatSale);
//         setSales(formattedSales);
//       }
//     } catch (error) {
//       console.error('Error fetching sales:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load sales history",
//         variant: "destructive",
//       });
//     }
//   };
  
//   // Fetch offers and auctions from Supabase
//   useEffect(() => {
//     if (!user) return;

//     const fetchOffers = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('seller_offers')
//           .select('*')
//           .eq('seller_id', user.id);
        
//         if (error) throw error;
        
//         if (data) {
//           const mappedOffers = data.map(formatOffer);
//           setOffers(mappedOffers);
//         }
//       } catch (error) {
//         console.error('Error fetching offers:', error);
//       }
//     };

//     const fetchAuctions = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('seller_auctions')
//           .select('*')
//           .eq('seller_id', user.id);
        
//         if (error) throw error;
        
//         if (data) {
//           const mappedAuctions = data.map(formatAuction);
//           setAuctions(mappedAuctions);
//         }
//       } catch (error) {
//         console.error('Error fetching auctions:', error);
//       }
//     };

//     fetchOffers();
//     fetchAuctions();
//   }, [user, products]);

//   const getStatusBadge = (status: ProductStatus) => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
//       case "pending":
//         return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
//       case "rejected":
//         return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   const getAuctionStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
//       case "pending":
//         return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
//       case "completed":
//         return <Badge className="bg-blue-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
//       case "cancelled":
//         return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   const handleEditProduct = (productId: string) => {
//     navigate(`/seller-list-item?edit=${productId}`);
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setProductToDelete(productId);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDeleteProduct = async () => {
//     if (productToDelete && user) {
//       try {
//         const { error } = await supabase
//           .from('products')
//           .delete()
//           .eq('id', productToDelete)
//           .eq('seller_id', user.id);

//         if (error) throw error;

//         setProducts(products.filter(product => product.id !== productToDelete));
//         toast({
//           title: "Product Removed",
//           description: "The product has been successfully removed.",
//         });
//       } catch (error) {
//         console.error('Error deleting product:', error);
//         toast({
//           title: "Error",
//           description: "Failed to remove product",
//           variant: "destructive",
//         });
//       }
      
//       setDeleteDialogOpen(false);
//       setProductToDelete(null);
//     }
//   };

//   const viewSaleDetails = (sale: SaleType) => {
//     setSelectedSale(sale);
//   };

//   const handleNewListing = () => {
//     navigate("/seller-list-item");
//   };

//   const handleCreateOffer = async (offer: { 
//     productId: string; 
//     title: string; 
//     description: string; 
//     discountPercentage: number; 
//     endDate: string; 
//   }) => {
//     if (!user) return;

//     try {
//       const { data, error } = await supabase
//         .from('seller_offers')
//         .insert({
//           product_id: offer.productId,
//           title: offer.title,
//           description: offer.description,
//           discount_percentage: offer.discountPercentage,
//           end_date: offer.endDate,
//           seller_id: user.id
//         })
//         .select();
      
//       if (error) throw error;

//       if (data && data[0]) {
//         const product = products.find(p => p.id === offer.productId);
//         const newOffer: SellerOffer = {
//           id: data[0].id,
//           title: offer.title,
//           productId: offer.productId,
//           productTitle: product?.title || "Unknown Product",
//           discountPercentage: offer.discountPercentage,
//           startDate: new Date().toLocaleDateString(),
//           endDate: new Date(offer.endDate).toLocaleDateString(),
//           description: offer.description
//         };

//         setOffers([...offers, newOffer]);
//         toast({
//           title: "Offer Created",
//           description: "Your special offer has been successfully created.",
//         });
//       }
//     } catch (error) {
//       console.error('Error creating offer:', error);
//       toast({
//         title: "Error",
//         description: "There was a problem creating your offer. Please try again.",
//         variant: "destructive"
//       });
//     }
    
//     setOfferDialogOpen(false);
//   };

//   const handleCreateAuction = async (auction: {
//     productId: string;
//     title: string;
//     description: string;
//     startingPrice: number;
//     endDate: string;
//   }) => {
//     if (!user) return;

//     try {
//       const { data, error } = await supabase
//         .from('seller_auctions')
//         .insert({
//           product_id: auction.productId,
//           title: auction.title,
//           description: auction.description,
//           starting_price: auction.startingPrice,
//           end_date: auction.endDate,
//           seller_id: user.id
//         })
//         .select();
      
//       if (error) throw error;

//       if (data && data[0]) {
//         const product = products.find(p => p.id === auction.productId);
//         const newAuction: SellerAuction = {
//           id: data[0].id,
//           title: auction.title,
//           productId: auction.productId,
//           productTitle: product?.title || "Unknown Product",
//           startingPrice: auction.startingPrice,
//           currentBid: null,
//           startDate: new Date().toLocaleDateString(),
//           endDate: new Date(auction.endDate).toLocaleDateString(),
//           status: 'pending',
//           description: auction.description
//         };

//         setAuctions([...auctions, newAuction]);
//         toast({
//           title: "Auction Created",
//           description: "Your auction has been successfully created and is pending approval.",
//         });
//       }
//     } catch (error) {
//       console.error('Error creating auction:', error);
//       toast({
//         title: "Error",
//         description: "There was a problem creating your auction. Please try again.",
//         variant: "destructive"
//       });
//     }
    
//     setAuctionDialogOpen(false);
//   };

//   if (!user) {
//     return null; // Will redirect to login
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-24">
//         <div className="flex flex-col md:flex-row justify-between items-start mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Seller Dashboard</h1>
//             <p className="text-foreground/70">Manage your listings and track your sales</p>
//           </div>
//           <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
//             <Button onClick={handleNewListing}>
//               <Plus className="mr-2 h-4 w-4" /> List New Item
//             </Button>
//             <Button variant="outline" onClick={() => setOfferDialogOpen(true)}>
//               <Tag className="mr-2 h-4 w-4" /> Create Offer
//             </Button>
//             <Button variant="outline" onClick={() => setAuctionDialogOpen(true)}>
//               <Gavel className="mr-2 h-4 w-4" /> Create Auction
//             </Button>
//           </div>
//         </div>

//         <div className="stats-overview grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="glass-card p-4 rounded-xl">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-primary/10 mr-4">
//                 <Package className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <p className="text-foreground/70">Active Listings</p>
//                 <h3 className="text-2xl font-bold">{products.filter(p => p.status === "approved").length}</h3>
//               </div>
//             </div>
//           </div>
//           <div className="glass-card p-4 rounded-xl">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-primary/10 mr-4">
//                 <DollarSign className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <p className="text-foreground/70">Total Sales</p>
//                 <h3 className="text-2xl font-bold">
//                   {formatPrice(sales.reduce((acc, sale) => acc + sale.amount, 0))}
//                 </h3>
//               </div>
//             </div>
//           </div>
//           <div className="glass-card p-4 rounded-xl">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-primary/10 mr-4">
//                 <Clock className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <p className="text-foreground/70">Pending Approval</p>
//                 <h3 className="text-2xl font-bold">{products.filter(p => p.status === "pending").length}</h3>
//               </div>
//             </div>
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="mb-8">
//             <TabsTrigger value="listings">My Listings</TabsTrigger>
//             <TabsTrigger value="offers">My Offers</TabsTrigger>
//             <TabsTrigger value="auctions">My Auctions</TabsTrigger>
//             <TabsTrigger value="sales">Sales History</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="listings">
//             <div className="glass-card p-6 rounded-xl">
//               {loading ? (
//                 <div className="text-center py-8">
//                   <p className="text-foreground/70">Loading your products...</p>
//                 </div>
//               ) : products.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-foreground/70">You haven't listed any products yet.</p>
//                   <Button onClick={handleNewListing} className="mt-4">
//                     <Plus className="mr-2 h-4 w-4" /> List Your First Product
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-border">
//                         <th className="text-left py-4 px-2">Image</th>
//                         <th className="text-left py-4 px-2">Item</th>
//                         <th className="text-left py-4 px-2">Price</th>
//                         <th className="text-left py-4 px-2">Category</th>
//                         <th className="text-left py-4 px-2">Status</th>
//                         <th className="text-left py-4 px-2">Listed On</th>
//                         <th className="text-left py-4 px-2">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {products.map((product) => (
//                         <tr key={product.id} className="border-b border-border">
//                           <td className="py-3 px-2">
//                             <img 
//                               src={product.images[0]} 
//                               alt={product.title} 
//                               className="w-16 h-16 object-cover rounded-md" 
//                             />
//                           </td>
//                           <td className="py-3 px-2">
//                             <div className="font-medium">{product.title}</div>
//                           </td>
//                           <td className="py-3 px-2">{formatPrice(product.price)}</td>
//                           <td className="py-3 px-2">{product.category}</td>
//                           <td className="py-3 px-2">
//                             {getStatusBadge(product.status)}
//                           </td>
//                           <td className="py-3 px-2">{product.created_at}</td>
//                           <td className="py-3 px-2">
//                             <div className="flex space-x-2">
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 onClick={() => handleEditProduct(product.id)}
//                               >
//                                 <Edit size={14} className="mr-1" /> Edit
//                               </Button>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="text-destructive border-destructive"
//                                 onClick={() => handleRemoveProduct(product.id)}
//                               >
//                                 <Trash2 size={14} className="mr-1" /> Remove
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="offers">
//             <div className="glass-card p-6 rounded-xl">
//               {offers.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-foreground/70">You haven't created any offers yet.</p>
//                   <Button onClick={() => setOfferDialogOpen(true)} className="mt-4">
//                     <Plus className="mr-2 h-4 w-4" /> Create Your First Offer
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-border">
//                         <th className="text-left py-4 px-2">Title</th>
//                         <th className="text-left py-4 px-2">Product</th>
//                         <th className="text-left py-4 px-2">Discount</th>
//                         <th className="text-left py-4 px-2">Start Date</th>
//                         <th className="text-left py-4 px-2">End Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {offers.map((offer) => (
//                         <tr key={offer.id} className="border-b border-border">
//                           <td className="py-3 px-2">{offer.title}</td>
//                           <td className="py-3 px-2">{offer.productTitle}</td>
//                           <td className="py-3 px-2">{offer.discountPercentage}%</td>
//                           <td className="py-3 px-2">{offer.startDate}</td>
//                           <td className="py-3 px-2">{offer.endDate}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="auctions">
//             <div className="glass-card p-6 rounded-xl">
//               {auctions.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-foreground/70">You haven't created any auctions yet.</p>
//                   <Button onClick={() => setAuctionDialogOpen(true)} className="mt-4">
//                     <Plus className="mr-2 h-4 w-4" /> Create Your First Auction
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-border">
//                         <th className="text-left py-4 px-2">Title</th>
//                         <th className="text-left py-4 px-2">Product</th>
//                         <th className="text-left py-4 px-2">Starting Price</th>
//                         <th className="text-left py-4 px-2">Current Bid</th>
//                         <th className="text-left py-4 px-2">End Date</th>
//                         <th className="text-left py-4 px-2">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {auctions.map((auction) => (
//                         <tr key={auction.id} className="border-b border-border">
//                           <td className="py-3 px-2">{auction.title}</td>
//                           <td className="py-3 px-2">{auction.productTitle}</td>
//                           <td className="py-3 px-2">{formatPrice(auction.startingPrice)}</td>
//                           <td className="py-3 px-2">
//                             {auction.currentBid ? formatPrice(auction.currentBid) : "No bids yet"}
//                           </td>
//                           <td className="py-3 px-2">{auction.endDate}</td>
//                           <td className="py-3 px-2">
//                             {getAuctionStatusBadge(auction.status)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </TabsContent>
          
//           <TabsContent value="sales">
//             <div className="glass-card p-6 rounded-xl">
//               {sales.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-foreground/70">No sales history found.</p>
//             </div>
//           ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-border">
//                       <th className="text-left py-4 px-2">Item</th>
//                       <th className="text-left py-4 px-2">Buyer</th>
//                       <th className="text-left py-4 px-2">Date</th>
//                       <th className="text-left py-4 px-2">Amount</th>
//                       <th className="text-left py-4 px-2">Status</th>
//                       <th className="text-left py-4 px-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {sales.map((sale) => (
//                       <tr key={sale.id} className="border-b border-border">
//                         <td className="py-3 px-2">{sale.productTitle}</td>
//                         <td className="py-3 px-2">{sale.buyer}</td>
//                         <td className="py-3 px-2">{sale.date}</td>
//                         <td className="py-3 px-2">{formatPrice(sale.amount)}</td>
//                         <td className="py-3 px-2">
//                           <Badge className={sale.status === "delivered" ? "bg-green-500" : "bg-blue-500"}>
//                             {sale.status === "delivered" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Package className="w-3 h-3 mr-1" />} 
//                             {sale.status === "delivered" ? "Delivered" : "Shipped"}
//                           </Badge>
//                         </td>
//                         <td className="py-3 px-2">
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => viewSaleDetails(sale)}
//                           >
//                             <Eye size={14} className="mr-1" /> Details
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//           )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Sale Details Dialog */}
//       <Dialog open={selectedSale !== null} onOpenChange={(open) => !open && setSelectedSale(null)}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Sale Details</DialogTitle>
//             <DialogDescription>
//               Order information for {selectedSale?.productTitle}
//             </DialogDescription>
//           </DialogHeader>
          
//           {selectedSale && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">Order Information</h3>
//                 <div className="space-y-2">
//                   <div>
//                     <span className="text-sm text-foreground/70">Order Date:</span>
//                     <p>{selectedSale.date}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Order Status:</span>
//                     <p className="capitalize">{selectedSale.status}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Items Ordered:</span>
//                     <p>{selectedSale.itemsOrdered}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Payment Method:</span>
//                     <p>{selectedSale.paymentMethod}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Total Amount:</span>
//                     <p className="font-semibold">{formatPrice(selectedSale.amount)}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">Buyer Information</h3>
//                 <div className="space-y-2">
//                   <div>
//                     <span className="text-sm text-foreground/70">Name:</span>
//                     <p>{selectedSale.buyer}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Email:</span>
//                     <p>{selectedSale.email}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Phone:</span>
//                     <p>{selectedSale.phone}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-foreground/70">Shipping Address:</span>
//                     <p>{selectedSale.address}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button onClick={() => setSelectedSale(null)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to remove this product? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={confirmDeleteProduct}>Delete</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Create Offer Dialog */}
//       <CreateOfferDialog 
//         open={offerDialogOpen} 
//         onClose={() => setOfferDialogOpen(false)} 
//         onSubmit={handleCreateOffer}
//         products={products.filter(p => p.status === "approved")}
//       />

//       {/* Create Auction Dialog */}
//       <CreateAuctionDialog 
//         open={auctionDialogOpen} 
//         onClose={() => setAuctionDialogOpen(false)} 
//         onSubmit={handleCreateAuction}
//         products={products.filter(p => p.status === "approved")}
//       />

//       <Footer />
//     </>
//   );
// };

// export default SellerDashboard;
