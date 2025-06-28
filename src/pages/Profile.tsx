
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Edit2, LogOut, Heart, ShoppingBag, Eye, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
  });
  
  // Form states for editing
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  
  // Analytics data mock
  const [analytics, setAnalytics] = useState({
    views: 245,
    wishlists: 18,
    itemsSold: 12,
    notifications: 3,
  });
  
  useEffect(() => {
    async function getUserProfile() {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        const userData = session.user;
        setUser(userData);
        
        // Set form state based on user data
        setFormState({
          name: userData.user_metadata?.full_name || "",
          email: userData.email || "",
          phone: userData.user_metadata?.phone || "",
          streetAddress: userData.user_metadata?.street_address || "",
          city: userData.user_metadata?.city || "",
          state: userData.user_metadata?.state || "",
          zipCode: userData.user_metadata?.zip_code || "",
          country: userData.user_metadata?.country || "",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading user profile:", error);
        setLoading(false);
        navigate('/login');
      }
    }
    
    getUserProfile();
  }, [navigate]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const toggleEditMode = (field: keyof typeof editMode) => {
    setEditMode({
      ...editMode,
      [field]: !editMode[field],
    });
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };
  
  const saveChanges = async (field: keyof typeof editMode) => {
    try {
      let updateData = {};
      
      switch (field) {
        case 'name':
          updateData = { full_name: formState.name };
          break;
        case 'email':
          // This requires special handling for email changes
          const { error } = await supabase.auth.updateUser({ email: formState.email });
          if (error) throw error;
          toast({
            title: "Verification email sent",
            description: "Please check your email to verify this change.",
          });
          toggleEditMode(field);
          return;
        case 'phone':
          updateData = { phone: formState.phone };
          break;
        case 'address':
          updateData = {
            street_address: formState.streetAddress,
            city: formState.city,
            state: formState.state,
            zip_code: formState.zipCode,
            country: formState.country,
          };
          break;
      }
      
      const { error } = await supabase.auth.updateUser({
        data: updateData
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: `Your ${field} has been successfully updated.`,
      });
      
      toggleEditMode(field);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left sidebar - User info */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User size={40} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{formState.name || "User"}</h2>
                  <p className="text-sm text-foreground/70 mt-1">{user?.email}</p>
                  
                  {user?.user_metadata?.is_buyer === false && (
                    <div className="mt-2 bg-orange-500/10 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                      Seller Account
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/70">Email</p>
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/70">Phone</p>
                      <p className="text-sm font-medium truncate">
                        {formState.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/70">Address</p>
                      <p className="text-sm font-medium truncate">
                        {formState.city && formState.state 
                          ? `${formState.city}, ${formState.state}` 
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
              
              {/* Seller Analytics */}
              {user?.user_metadata?.is_buyer === false && (
                <div className="glass-card p-6 rounded-xl mt-6">
                  <h3 className="font-medium mb-4">Seller Analytics</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-2">
                        <Eye size={18} />
                      </div>
                      <p className="text-2xl font-bold">{analytics.views}</p>
                      <p className="text-xs text-foreground/70">Product Views</p>
                    </div>
                    
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
                        <Heart size={18} />
                      </div>
                      <p className="text-2xl font-bold">{analytics.wishlists}</p>
                      <p className="text-xs text-foreground/70">Wishlisted</p>
                    </div>
                    
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-2">
                        <ShoppingBag size={18} />
                      </div>
                      <p className="text-2xl font-bold">{analytics.itemsSold}</p>
                      <p className="text-xs text-foreground/70">Items Sold</p>
                    </div>
                    
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-2">
                        <Bookmark size={18} />
                      </div>
                      <p className="text-2xl font-bold">{analytics.notifications}</p>
                      <p className="text-xs text-foreground/70">New Bids</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate("/seller-dashboard")}
                  >
                    View Seller Dashboard
                  </Button>
                </div>
              )}
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <Tabs defaultValue="account">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-6">
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleEditMode('name')}
                      >
                        <Edit2 size={14} className="mr-1" />
                        {editMode.name ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    
                    {editMode.name ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            value={formState.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                          />
                        </div>
                        
                        <Button onClick={() => saveChanges('name')}>Save Changes</Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-foreground/70">Name</p>
                        <p className="font-medium">{formState.name || "Not provided"}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Email Address</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleEditMode('email')}
                      >
                        <Edit2 size={14} className="mr-1" />
                        {editMode.email ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    
                    {editMode.email ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formState.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                          />
                          <p className="text-xs text-foreground/70 mt-1">
                            You'll need to verify this email if you change it.
                          </p>
                        </div>
                        
                        <Button onClick={() => saveChanges('email')}>Save Changes</Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-foreground/70">Email</p>
                        <p className="font-medium">{formState.email}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Phone Number</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleEditMode('phone')}
                      >
                        <Edit2 size={14} className="mr-1" />
                        {editMode.phone ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    
                    {editMode.phone ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formState.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                          />
                        </div>
                        
                        <Button onClick={() => saveChanges('phone')}>Save Changes</Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-foreground/70">Phone</p>
                        <p className="font-medium">{formState.phone || "Not provided"}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Address</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleEditMode('address')}
                      >
                        <Edit2 size={14} className="mr-1" />
                        {editMode.address ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                    
                    {editMode.address ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="streetAddress" className="block text-sm font-medium mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="streetAddress"
                            value={formState.streetAddress}
                            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              id="city"
                              value={formState.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium mb-1">
                              State/Province
                            </label>
                            <input
                              type="text"
                              id="state"
                              value={formState.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              id="zipCode"
                              value={formState.zipCode}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              id="country"
                              value={formState.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                            />
                          </div>
                        </div>
                        
                        <Button onClick={() => saveChanges('address')}>Save Changes</Button>
                      </div>
                    ) : (
                      <div>
                        {formState.streetAddress || formState.city ? (
                          <div>
                            <p className="text-sm text-foreground/70">Address</p>
                            <p className="font-medium">
                              {formState.streetAddress && formState.streetAddress}
                              {formState.city && formState.state && <span><br />{formState.city}, {formState.state}</span>}
                              {formState.zipCode && <span> {formState.zipCode}</span>}
                              {formState.country && <span><br />{formState.country}</span>}
                            </p>
                          </div>
                        ) : (
                          <p className="font-medium">No address provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm text-foreground/70">
                          No recent activity to display.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
