
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

const AdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Check for admin credentials
        const userEmail = session.user?.email;
        console.log("Checking admin status for email:", userEmail);
        
        const isAdminUser = userEmail === 'admin@declutteratpureez.com';
        
        console.log("Is admin user:", isAdminUser);
        setIsAdmin(Boolean(isAdminUser));
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === 'admin@declutteratpureez.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p>Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to admin login page instead of showing access denied
    return <Navigate to="/admin-login" replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
};

export default AdminAuth;
