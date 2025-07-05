import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Users, 
  Package, 
  Search,
  Tag,
  DollarSign,
  BarChart,
  UserCheck,
  PlusCircle,
  ArrowRight,
  Gavel,
  ShoppingBag,
  MessageCircle,
  PlusIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import MessageResponse from "@/components/admin/MessageResponse";
import { supabase } from "@/integrations/supabase/client";
import CreateAuctionDialog from "@/components/auctions/CreateAuctionDialog";

type ProductListing = {
  id: string;
  title: string;
  price: number;
  category: string;
  created_at: string;
  images: string[];
  description: string;
  condition: string;
  location: string;
  room?: string;
  used_for?: string;
  stock: number;
  videos: string[];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [auctionDialogOpen, setAuctionDialogOpen] = useState(false);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin-login');
        return;
      }

      // Check if user is admin
      const adminEmail = 'admin@declutteratpureez.com';
      if (user.email !== adminEmail) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      setUser(user);
      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/admin-login');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleCreateAuction = async (auctionData: {
  //   productId: string;
  //   title: string;
  //   description: string;
  //   startingPrice: number;
  //   endDate: string;
  // }) => {
  //   try {
  //     // Convert to Kenya timezone (UTC+3)
  //     const endDateTime = new Date(`${auctionData.endDate}T23:59:59+03:00`);
      
  //     const { error } = await supabase
  //       .from('auctions')
  //       .insert({
  //         product_id: auctionData.productId,
  //         title: auctionData.title,
  //         description: auctionData.description,
  //         starting_price: auctionData.startingPrice,
  //         end_date: endDateTime.toISOString(),
  //         status: 'active'
  //       });
      
  //     if (error) throw error;
      
  //     toast({
  //       title: "Auction Created",
  //       description: "Auction has been successfully created",
  //     });
      
  //     setAuctionDialogOpen(false);
  //   } catch (error) {
  //     console.error("Error creating auction:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to create auction",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // ADD THIS FUNCTION: Delete Product Handler
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted",
      });
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };
  
  const getFilteredProducts = () => {
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleViewAnalytics = () => {
    navigate("/admin-sales-analytics");
  };

  const handleVerifySellers = () => {
    navigate("/seller-verification");
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);
  
  // If not admin or still checking, show loading or redirect
  if (!isAdmin || loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/70">Checking admin access...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const activeListings = products.length;

  // Calculate total sales value from approved products
  const totalSalesValue = products.reduce((total, product) => total + Number(product.price), 0);

  function formatPrice(price: number): string {
  // Check if the price is a whole number
  if (price % 1 === 0) {
    return price.toLocaleString('en-KE');
  }
  return price.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-foreground/70 mb-8">Manage product listings, sellers, and sales</p>

        <div className="stats-overview grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card p-4 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500/10 mr-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground/70">Active Listings</p>
                  <h3 className="text-2xl font-bold">{activeListings}</h3>
                </div>
                <div className="ml-auto">
                  <Link to="/admin-post-product">
                  <Button 
                    size="sm" 
                    variant="ghost"
                  >
                    Add Item <PlusIcon className="ml-1 h-4 w-4" />
                  </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card p-4 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground/70">Total Inventory Value</p>
                  <h3 className="text-2xl font-bold">KES {totalSalesValue.toLocaleString()}</h3>
                </div>
                <div className="ml-auto">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleViewAnalytics}
                  >
                    Analytics <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card p-4 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500/10 mr-4">
                  <Gavel className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-foreground/70">Create Auction</p>
                  <h3 className="text-2xl font-bold">New</h3>
                </div>
                <div className="ml-auto">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setAuctionDialogOpen(true)}
                  >
                    Create <PlusIcon className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Product Listings</h2>
            <Link to="/admin-post-product">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-foreground/70">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/70">No products found. Create your first listing!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-2">Image</th>
                    <th className="text-left py-4 px-2">Item</th>
                    <th className="text-left py-4 px-2">Price</th>
                    <th className="text-left py-4 px-2">Category</th>
                    <th className="text-left py-4 px-2">Location</th>
                    <th className="text-left py-4 px-2">Listed On</th>
                    <th className="text-left py-4 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border">
                      <td className="py-3 px-2">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="w-16 h-16 object-cover rounded-md" 
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{product.title}</div>
                      </td>
                      <td className="py-3 px-2">KES {product.price.toLocaleString()}</td>
                      <td className="py-3 px-2">{product.category}</td>
                      <td className="py-3 px-2">{product.location}</td>
                      <td className="py-3 px-2">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          <Link to={`/admin-edit-product/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-4 w-4" /> Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive border-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* <CreateAuctionDialog 
        open={auctionDialogOpen}
        onClose={() => setAuctionDialogOpen(false)}
        onSubmit={handleCreateAuction}
        products={products}
      /> */}
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
