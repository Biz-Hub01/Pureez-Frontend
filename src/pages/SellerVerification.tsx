
import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX, 
  User, 
  Star, 
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

type SellerStatus = "pending" | "approved" | "rejected";

type Seller = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: SellerStatus;
  location: string;
  description: string;
  profileImage: string;
  idVerification: string;
  documentVerification: string;
  totalProducts: number;
  ratings: number;
};

const SellerVerification = () => {
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: "s1",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2025-01-15",
      status: "approved",
      location: "San Francisco, CA",
      description: "Specializes in vintage furniture and home decor.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      idVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      documentVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      totalProducts: 15,
      ratings: 4.7
    },
    {
      id: "s2",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 987-6543",
      joinDate: "2025-02-20",
      status: "pending",
      location: "New York, NY",
      description: "Offering high-quality kitchen appliances and cookware.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      idVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      documentVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      totalProducts: 8,
      ratings: 4.2
    },
    {
      id: "s3",
      name: "Alex Johnson",
      email: "alex.j@example.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2025-03-05",
      status: "rejected",
      location: "Chicago, IL",
      description: "Selling pre-owned electronics and gadgets.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      idVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      documentVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      totalProducts: 3,
      ratings: 3.9
    },
    {
      id: "s4",
      name: "Maria Garcia",
      email: "maria.g@example.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2025-03-10",
      status: "pending",
      location: "Los Angeles, CA",
      description: "Specializes in handmade crafts and art pieces.",
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      idVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      documentVerification: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      totalProducts: 12,
      ratings: 4.8
    }
  ]);

  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SellerStatus | "all">("all");
  const [imageDialog, setImageDialog] = useState<{open: boolean, url: string, title: string}>({
    open: false,
    url: "",
    title: ""
  });
  
  const getPendingCount = () => {
    return sellers.filter(seller => seller.status === "pending").length;
  };
  
  const getFilteredSellers = () => {
    return sellers.filter(seller => {
      // Apply status filter
      if (statusFilter !== "all" && seller.status !== statusFilter) return false;
      
      // Apply search filter
      if (searchTerm && 
          !seller.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !seller.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !seller.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  };
  
  const approveSeller = (id: string) => {
    setSellers(prev => 
      prev.map(seller => 
        seller.id === id ? { ...seller, status: "approved" as SellerStatus } : seller
      )
    );
    
    toast({
      title: "Seller Approved",
      description: "Seller has been approved and notified."
    });
  };
  
  const rejectSeller = (id: string) => {
    setSellers(prev => 
      prev.map(seller => 
        seller.id === id ? { ...seller, status: "rejected" as SellerStatus } : seller
      )
    );
    
    toast({
      title: "Seller Rejected",
      description: "Seller has been rejected and notified."
    });
  };
  
  const openSellerDetails = (seller: Seller) => {
    setSelectedSeller(seller);
  };
  
  const viewImage = (url: string, title: string) => {
    setImageDialog({
      open: true,
      url,
      title
    });
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
          <h1 className="text-3xl font-bold ml-auto">Seller Verification</h1>
          <div className="ml-auto">
            <Badge variant="outline" className="ml-2 bg-yellow-500 text-yellow-950">
              {getPendingCount()} Pending Approvals
            </Badge>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
              <Input
                type="text"
                placeholder="Search sellers by name, email or location..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-60 flex items-center">
              <Filter size={18} className="mr-2 text-foreground/70" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as SellerStatus | "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="pending">
              Pending Verification {getPendingCount() > 0 && (
                <Badge className="ml-2 bg-yellow-500">{getPendingCount()}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Sellers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="glass-card p-6 rounded-xl">
              {getFilteredSellers().filter(s => s.status === "pending").length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getFilteredSellers()
                    .filter(seller => seller.status === "pending")
                    .map((seller) => (
                    <div key={seller.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center">
                          <img 
                            src={seller.profileImage} 
                            alt={seller.name} 
                            className="w-16 h-16 rounded-full object-cover mr-4" 
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{seller.name}</h3>
                            <p className="text-foreground/70">{seller.location}</p>
                          </div>
                          <Badge className="ml-auto bg-yellow-500">Pending</Badge>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-foreground/70 mb-1"><span className="font-medium">Email:</span> {seller.email}</p>
                          <p className="text-sm text-foreground/70 mb-1"><span className="font-medium">Phone:</span> {seller.phone}</p>
                          <p className="text-sm text-foreground/70 mb-3"><span className="font-medium">Joined:</span> {new Date(seller.joinDate).toLocaleDateString()}</p>
                          <p className="text-sm line-clamp-2">{seller.description}</p>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => viewImage(seller.idVerification, "ID Verification")}
                          >
                            View ID
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => viewImage(seller.documentVerification, "Document Verification")}
                          >
                            View Documents
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => openSellerDetails(seller)}
                          >
                            View Full Profile
                          </Button>
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <Button 
                            onClick={() => approveSeller(seller.id)}
                            className="flex items-center text-green-600 border-green-600 hover:bg-green-600/10"
                            variant="outline"
                          >
                            <UserCheck className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button 
                            onClick={() => rejectSeller(seller.id)}
                            className="flex items-center text-destructive border-destructive"
                            variant="outline"
                          >
                            <UserX className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Pending Verifications</h3>
                  <p className="text-foreground/70">All seller applications have been reviewed</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="glass-card p-6 rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">Seller</th>
                      <th className="text-left py-4 px-4">Contact</th>
                      <th className="text-left py-4 px-4">Join Date</th>
                      <th className="text-left py-4 px-4">Products</th>
                      <th className="text-left py-4 px-4">Status</th>
                      <th className="text-left py-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredSellers().map((seller) => (
                      <tr key={seller.id} className="border-b border-border">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img 
                              src={seller.profileImage} 
                              alt={seller.name} 
                              className="w-10 h-10 rounded-full object-cover mr-3" 
                            />
                            <div>
                              <div className="font-medium">{seller.name}</div>
                              <div className="text-sm text-foreground/70">{seller.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">{seller.email}</div>
                          <div className="text-sm text-foreground/70">{seller.phone}</div>
                        </td>
                        <td className="py-4 px-4">
                          {new Date(seller.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{seller.totalProducts}</span>
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-sm">{seller.ratings}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {seller.status === "approved" && <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>}
                          {seller.status === "pending" && <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                          {seller.status === "rejected" && <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openSellerDetails(seller)}
                            >
                              <User className="h-4 w-4 mr-1" /> Details
                            </Button>
                            {seller.status === "pending" && (
                              <>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-600/10"
                                  onClick={() => approveSeller(seller.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="border-destructive text-destructive"
                                  onClick={() => rejectSeller(seller.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Seller Details Dialog */}
        {selectedSeller && (
          <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Seller Profile</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="aspect-square overflow-hidden rounded-lg mb-4">
                    <img 
                      src={selectedSeller.profileImage} 
                      alt={selectedSeller.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{selectedSeller.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1">{selectedSeller.ratings} Rating</span>
                    </div>
                    <div>
                      <Badge 
                        className={
                          selectedSeller.status === "approved" ? "bg-green-500" : 
                          selectedSeller.status === "pending" ? "bg-yellow-500" : 
                          "bg-destructive"
                        }
                      >
                        {selectedSeller.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {selectedSeller.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {selectedSeller.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                        {selectedSeller.status.charAt(0).toUpperCase() + selectedSeller.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex">
                      <span className="font-medium w-24">Email:</span>
                      <span>{selectedSeller.email}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Phone:</span>
                      <span>{selectedSeller.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Location:</span>
                      <span>{selectedSeller.location}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Join Date:</span>
                      <span>{new Date(selectedSeller.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Products:</span>
                      <span>{selectedSeller.totalProducts} items</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-foreground/80">{selectedSeller.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Verification Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={selectedSeller.idVerification} 
                            alt="ID Verification" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">ID Verification</h4>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="mt-2"
                            onClick={() => viewImage(selectedSeller.idVerification, "ID Verification")}
                          >
                            View Full Size
                          </Button>
                        </div>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={selectedSeller.documentVerification} 
                            alt="Document Verification" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">Business Documents</h4>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="mt-2"
                            onClick={() => viewImage(selectedSeller.documentVerification, "Document Verification")}
                          >
                            View Full Size
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                {selectedSeller.status === "pending" && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        rejectSeller(selectedSeller.id);
                        setSelectedSeller(null);
                      }}
                      variant="outline"
                      className="border-destructive text-destructive"
                    >
                      <UserX className="mr-2 h-4 w-4" /> Reject Seller
                    </Button>
                    <Button 
                      onClick={() => {
                        approveSeller(selectedSeller.id);
                        setSelectedSeller(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserCheck className="mr-2 h-4 w-4" /> Approve Seller
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setSelectedSeller(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Image Dialog */}
        <Dialog open={imageDialog.open} onOpenChange={(open) => setImageDialog({...imageDialog, open})}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{imageDialog.title}</DialogTitle>
            </DialogHeader>
            <div className="overflow-hidden rounded-lg">
              <img 
                src={imageDialog.url} 
                alt={imageDialog.title}
                className="w-full object-contain max-h-[70vh]" 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default SellerVerification;
