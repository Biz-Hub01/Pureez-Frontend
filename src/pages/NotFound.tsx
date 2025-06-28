
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if this is likely an admin route
  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        {isAdminRoute && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 text-left">
            <p className="text-amber-800 font-medium">Looking for admin pages?</p>
            <ul className="mt-2 text-sm text-amber-700 space-y-1">
              <li>• Admin Dashboard: <Link to="/admin-dashboard" className="underline">Go here</Link></li>
              <li>• Create Offers: <Link to="/admin-offer-create" className="underline">Go here</Link></li>
              <li>• Post Products: <Link to="/admin-post-product" className="underline">Go here</Link></li>
              <li>• Sales Analytics: <Link to="/admin-sales-analytics" className="underline">Go here</Link></li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={-1 as any} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
