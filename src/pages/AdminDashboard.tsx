import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
  MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import MessageResponse from "@/components/admin/MessageResponse";
import { supabase } from "@/integrations/supabase/client";

type ProductStatus = "pending" | "approved" | "rejected";

type ProductListing = {
  id: string;
  title: string;
  seller_id: string;
  price: number;
  category: string;
  status: ProductStatus;
  created_at: string;
  images: string[];
  description: string;
  condition: string;
  location: string;
  room?: string;
  used_for?: string;
  stock: number;
  updated_at: string;
  videos: string[];
};

type SellerProfile = {
  id: string;
  user_id: string;
  business_name: string | null;
  phone: string | null;
  address: string | null;
  verified: boolean;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

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

  const fetchPendingProducts = async () => {
  setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Cast status to ProductStatus type
      const productsWithStatus = (data || []).map(product => ({
        ...product,
        status: product.status as ProductStatus
      }));
      
      setProducts(productsWithStatus);

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

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Cast status to ProductStatus type
      const productsWithStatus = (data || []).map(product => ({
        ...product,
        status: product.status as ProductStatus
      }));
      
      setProducts(productsWithStatus);
    } catch (error) {
      console.error('Error fetching all products:', error);
      toast({
        title: "Error",
        description: "Failed to load all products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setSellers(data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast({
        title: "Error",
        description: "Failed to load seller profiles",
        variant: "destructive",
      });
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setContactMessages(data);
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
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


  const getUnreadMessages = () => {
    return contactMessages.filter(message => !message.read);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingProducts();
      fetchSellers();
      fetchContactMessages();
    }
  }, [isAdmin]);

    const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'pending') fetchPendingProducts();
    else if (tab === 'all') fetchAllProducts();
  };

  const approveProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product Approved",
        description: "The product has been approved and is now visible in the catalog."
      });

    // Refresh products after approval
      if (activeTab === 'pending') {
        fetchPendingProducts();
      } else {
        fetchAllProducts();
      }  
      
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive",
      });
    }
  };

  const rejectProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product Rejected",
        description: "The product has been rejected."
      });

    // Refresh products after rejection
      if (activeTab === 'pending') {
        fetchPendingProducts();
      } else {
        fetchAllProducts();
      }  
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: "Error",
        description: "Failed to reject product",
        variant: "destructive",
      });
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setContactMessages(contactMessages.map(message => 
        message.id === id ? { ...message, read: true } : message
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleViewAnalytics = () => {
    navigate("/admin-sales-analytics");
  };

  const handleVerifySellers = () => {
    navigate("/seller-verification");
  };

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

  const pendingApprovals = products.filter(p => p.status === "pending").length;
  const totalSellers = sellers.length;
  const activeListings = products.filter(p => p.status === "approved").length;
  const totalOffers = 4; // This would come from seller_offers table
  const unreadMessages = contactMessages.filter(m => !m.read).length;

  // Calculate total sales value from approved products
  const totalSalesValue = products
    .filter(p => p.status === "approved")
    .reduce((total, product) => total + Number(product.price), 0);

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

        {/* Debug Info - Remove this in production
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
          <p className="text-yellow-700">Total Products: {products.length}</p>
          <p className="text-yellow-700">Pending: {products.filter(p => p.status === "pending").length}</p>
          <p className="text-yellow-700">Approved: {products.filter(p => p.status === "approved").length}</p>
          <p className="text-yellow-700">Rejected: {products.filter(p => p.status === "rejected").length}</p>
        </div> */}

        <div className="stats-overview grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card p-4 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500/10 mr-4">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-foreground/70">Pending Approvals</p>
                  <h3 className="text-2xl font-bold">{pendingApprovals}</h3>
                </div>
                <div className="ml-auto">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setActiveTab("pending")}
                  >
                    Manage <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
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
                  <h3 className="text-2xl font-bold">KES {(totalSalesValue/1000).toFixed(1)}</h3>
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
                <div className="p-3 rounded-full bg-primary/10 mr-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground/70">Active Listings</p>
                  <h3 className="text-2xl font-bold">{activeListings}</h3>
                </div>
                <div className="ml-auto">
                  <Link to="/admin-post-product">
                    <Button size="sm" variant="ghost">
                      Add <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card p-4 rounded-xl">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500/10 mr-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-foreground/70">Total Sellers</p>
                  <h3 className="text-2xl font-bold">{totalSellers}</h3>
                </div>
                <div className="ml-auto">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleVerifySellers}
                  >
                    Manage <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
            <input 
              type="text" 
              placeholder="Search by product or category..." 
              className="w-full pl-10 py-2 pr-4 border border-border rounded-lg bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="pending">
              Pending Products {pendingApprovals > 0 && (
                <Badge className="ml-2 bg-yellow-500">{pendingApprovals}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Listings ({products.length})</TabsTrigger>
            <TabsTrigger value="messages">
              Messages {unreadMessages > 0 && (
                <Badge className="ml-2 bg-yellow-500">{unreadMessages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="glass-card p-6 rounded-xl">
              {getFilteredProducts().length > 0 ? (
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
                      {getFilteredProducts().map((product) => (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-3 px-2">
                            <img 
                              src={product.images[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                              alt={product.title} 
                              className="w-16 h-16 object-cover rounded-md" 
                            />
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-medium">{product.title}</div>
                            <div className="text-sm text-foreground/70">{product.condition}</div>
                          </td>
                          <td className="py-3 px-2">KES {formatPrice(product.price)}</td>
                          <td className="py-3 px-2">{product.category}</td>
                          <td className="py-3 px-2">{product.location}</td>
                          <td className="py-3 px-2">{new Date(product.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => approveProduct(product.id)}
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 border-green-600 hover:bg-green-600/10"
                              >
                                <CheckCircle className="mr-1 h-4 w-4" /> Approve
                              </Button>
                              <Button 
                                onClick={() => rejectProduct(product.id)}
                                variant="outline" 
                                size="sm" 
                                className="text-destructive border-destructive"
                              >
                                <XCircle className="mr-1 h-4 w-4" /> Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Pending Approvals</h3>
                  <p className="text-foreground/70">All product listings have been reviewed</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="glass-card p-6 rounded-xl">
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-2">Image</th>
                        <th className="text-left py-4 px-2">Item</th>
                        <th className="text-left py-4 px-2">Price</th>
                        <th className="text-left py-4 px-2">Status</th>
                        <th className="text-left py-4 px-2">Listed On</th>
                        <th className="text-left py-4 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredProducts().map((product) => (
                        <tr key={product.id} className="border-b border-border">
                          <td className="py-3 px-2">
                            <img 
                              src={product.images[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                              alt={product.title} 
                              className="w-16 h-16 object-cover rounded-md" 
                            />
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-medium">{product.title}</div>
                            <div className="text-sm text-foreground/70">{product.condition}</div>
                          </td>
                          <td className="py-3 px-2">KES {formatPrice(product.price)}</td>
                          <td className="py-3 px-2">
                            {product.status === "approved" && <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>}
                            {product.status === "pending" && <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                            {product.status === "rejected" && <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                          </td>
                          <td className="py-3 px-2">{new Date(product.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <Link to={`/product/${product.id}`}>
                              <Button variant="outline" size="sm">
                                <ShieldAlert className="mr-1 h-4 w-4" /> Details
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Products Found</h3>
                  <p className="text-foreground/70">No products have been submitted yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="glass-card p-6 rounded-xl">
              {contactMessages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-2">Status</th>
                        <th className="text-left py-4 px-2">Name</th>
                        <th className="text-left py-4 px-2">Email</th>
                        <th className="text-left py-4 px-2">Subject</th>
                        <th className="text-left py-4 px-2">Date</th>
                        <th className="text-left py-4 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map((message) => (
                        <tr 
                          key={message.id} 
                          className={`border-b border-border ${!message.read ? "bg-primary/5" : ""}`}
                        >
                          <td className="py-3 px-2">
                            {!message.read ? 
                              <Badge className="bg-yellow-500">New</Badge> :
                              <Badge variant="outline">Read</Badge>
                            }
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-medium">{message.name}</div>
                          </td>
                          <td className="py-3 px-2">{message.email}</td>
                          <td className="py-3 px-2">{message.subject}</td>
                          <td className="py-3 px-2">{new Date(message.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <MessageCircle className="mr-1 h-4 w-4" /> View & Respond
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">No Messages</h3>
                  <p className="text-foreground/70">No contact messages have been received</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <MessageResponse
            messageId={selectedMessage.id}
            customerName={selectedMessage.name}
            customerEmail={selectedMessage.email}
            subject={selectedMessage.subject}
            originalMessage={selectedMessage.message}
            onClose={() => {
              setSelectedMessage(null);
              markMessageAsRead(selectedMessage.id);
            }}
          />
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
