
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Heart, Menu, X, Home, Package, Users, LogOut, Moon, Sun, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import SearchWithSuggestions from "@/components/SearchWithSuggestions";
import CurrencySelector from "@/components/CurrencySelector";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import TopBar from "./TopBar";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isAdmin = user?.email === 'admin@declutteratpureez.com';
  const cartItemsCount = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistItemsCount = wishlistItems ? wishlistItems.length : 0;

  if (loading) {
    return (
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-semibold text-foreground">
              Declutter
            </Link>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-muted rounded w-20 h-8"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50">
    <TopBar />
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button (Left) */}
            <div className="lg:hidden">
              <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>

                {/* ... mobile menu content ... */}
                <DrawerContent className="inset-x-0 left-0 right-auto h-full w-2/3 rounded-none">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                      <img 
                        src="/declutter-logo.jpg" 
                        alt="Declutter" 
                        className="h-6"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <X size={20} />
                      </Button>
                    </div>

                    {/* Currency Selector in Mobile Menu */}
                    <div className="mb-6">
                      <CurrencySelector variant="mobile" />
                    </div>
                
                  <div className="space-y-4">
                    {/* Navigation Items */}
                    <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Home className="h-5 w-5" />
                      <span>Home</span>
                    </Link>
                    <Link to="/catalog" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Package className="h-5 w-5" />
                      <span>Catalog</span>
                    </Link>
                    <Link to="/offers" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Package className="h-5 w-5" />
                      <span>Offers</span>
                    </Link>
                    <Link to="/how-it-works" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Users className="h-5 w-5" />
                      <span>How It Works</span>
                    </Link>
                    <Link to="/support" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <Users className="h-5 w-5" />
                      <span>Support</span>
                    </Link>
                    
                    {/* User Actions */}
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link to="/admin-dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                            <User className="h-5 w-5" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <button 
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }} 
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors w-full text-left"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-5 w-5" />
                          <span>Sign In</span>
                        </Link>
                        <Link to="/admin-login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <Shield className="h-5 w-5" />
                          <span>Admin Login</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
              </Drawer>
            </div>

          {/* Logo */}
          <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
                src="/declutter-logo.jpg" 
                alt="Declutter" 
                className="h-8 w-auto mr-2"
              />
            <span className="lg:block text-xl text-orange-500 font-semibold">Pureez</span>  
          </Link>
          </div>
          
          {/* Desktop Navigation Links with proper spacing */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            <Link 
              to="/catalog" 
              className={`text-sm text-muted-foreground hover:text-foreground ${
                location.pathname === "/catalog" ? "text-primary font-medium" : ""
              }`}
            >
              Catalog
            </Link>
            <Link 
              to="/offers" 
              className={`text-sm text-muted-foreground hover:text-foreground ${
                location.pathname === "/offers" ? "text-primary font-medium" : ""
              }`}
            >
              Today's Deals
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm text-muted-foreground hover:text-foreground ${
                location.pathname === "/how-it-works" ? "text-primary font-medium" : ""
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/support" 
              className={`text-sm text-muted-foreground hover:text-foreground ${
                location.pathname === "/support" ? "text-primary font-medium" : ""
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="hidden lg:block">
              <CurrencySelector variant="navbar" />
            </div>
            
            {/* Dark mode toggle */}
            <Button variant="ghost" size="sm" className="p-2" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin-dashboard">
                    <Button variant="ghost" size="sm" className="text-xs px-2">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs px-2"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <span className="text-xs text-primary hover:text-primary/80">Sign in</span>
                </Link>
                <Link to="/admin-login">
                  <span className="text-xs text-muted-foreground hover:text-foreground ml-2">Admin</span>
                </Link>
              </>
            )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1">
              <Heart className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              {wishlistItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                  {wishlistItemsCount}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-1">
              <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>

            {/* User Profile */}
            <Link to="/profile" className="p-1 lg:block">
              <User className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
