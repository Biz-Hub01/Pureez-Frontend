
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'admin@declutteratpureez.com') {
        navigate("/admin-dashboard");
      }
    };
    checkAdminAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate admin email
    if (email.trim() !== 'admin@declutteratpureez.com') {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid admin credentials. Please check your password and try again.");
        }
        throw error;
      }

      // Double check admin status after login
      if (data.user?.email !== 'admin@declutteratpureez.com') {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }
      
      toast({
        title: "Welcome back, Admin!",
        description: "Successfully logged into admin dashboard.",
      });
      
      navigate("/admin-dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Admin Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back, Admin
            </h1>
            <p className="text-white/70">
              Access the Declutter Admin Dashboard
            </p>
          </div>

          {/* Admin Credentials Info */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-200 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Admin Credentials
            </h3>
            <div className="text-sm text-blue-100 space-y-1">
              <p><strong>Email:</strong> admin@declutteratpureez.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/60">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  className="bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="admin@declutteratpureez.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/60">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  className="bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent flex items-center justify-center transition-all duration-200 hover:from-purple-600 hover:to-blue-600 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In to Dashboard"}
              {!isLoading && <ArrowRight size={16} className="ml-2" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
