
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isBuyer, setIsBuyer] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password strength validation
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);
  
  // Update password requirements
  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  }, [password]);
  
  const toggleView = () => {
    setIsLogin(!isLogin);
    // Reset form when switching views
    setEmail("");
    setPassword("");
    setName("");
    setIdNumber("");
    setPhone("");
    setAcceptedTerms(false);
  };
  
  // Check if password meets requirements for sellers
  const isPasswordValid = () => {
    if (isBuyer) return password.length >= 6; // Less strict for buyers
    
    // For sellers, enforce all requirements
    return Object.values(passwordRequirements).every(Boolean);
  };
  
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

    // Additional validation for seller registration
    if (!isLogin && !isBuyer && !isPasswordValid()) {
      toast({
        title: "Password too weak",
        description: "Please meet all password requirements for seller accounts.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!isBuyer && (!idNumber || !phone))) {
      toast({
        title: "Missing seller information",
        description: "Please provide ID number and phone number for seller accounts.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !acceptedTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please check your credentials and try again.");
          }
          throw error;
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate("/");
      } else {
        // Handle signup
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name.trim(),
              is_buyer: isBuyer,
              id_number: !isBuyer ? idNumber.trim() : null,
              phone: !isBuyer ? phone.trim() : null,
            },
          },
        });
        
        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("An account with this email already exists. Please try logging in instead.");
          }
          throw error;
        }
        
        if (data.user && !data.session) {
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account before signing in.",
          });
        } else {
          toast({
            title: "Account created successfully",
            description: "Welcome to Declutter!",
          });
          navigate("/");
        }
        
        if (!data.session) {
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred with Google sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8 rounded-2xl animate-scale-in">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-2 text-foreground/70">
                  {isLogin 
                    ? "Sign in to your account to continue" 
                    : "Join Declutter at Pureez to start buying or selling"
                  }
                </p>
              </div>
              
              {!isLogin && (
                <div className="mb-6">
                  <div className="flex rounded-lg border border-border p-1 mb-4">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all-200 ${
                        isBuyer 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-transparent hover:bg-secondary"
                      }`}
                      onClick={() => setIsBuyer(true)}
                    >
                      I want to buy
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all-200 ${
                        !isBuyer 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-transparent hover:bg-secondary"
                      }`}
                      onClick={() => setIsBuyer(false)}
                    >
                      I want to sell
                    </button>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/60">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        id="name"
                        className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full pl-10 p-2.5 focus-ring"
                        placeholder="Enter your full name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/60">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full pl-10 p-2.5 focus-ring"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                {!isLogin && !isBuyer && (
                  <div className="mb-4">
                    <label htmlFor="idNumber" className="block text-sm font-medium mb-1">
                      ID Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="idNumber"
                        className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                        placeholder="Enter your ID number"
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {!isLogin && !isBuyer && (
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full p-2.5 focus-ring"
                        placeholder="Enter your phone number"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-foreground/60">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      id="password"
                      className="bg-secondary/50 border border-border text-foreground rounded-lg block w-full pl-10 p-2.5 focus-ring"
                      placeholder={isLogin ? "Enter your password" : "Create a password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  {/* Password requirements - shown for seller signup */}
                  {!isLogin && !isBuyer && (
                    <div className="mt-3 text-sm space-y-1">
                      <h4 className="font-medium text-foreground/80 mb-1">Password Requirements:</h4>
                      <div className={`flex items-center ${passwordRequirements.minLength ? 'text-green-500' : 'text-foreground/60'}`}>
                        {passwordRequirements.minLength ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        At least 8 characters
                      </div>
                      <div className={`flex items-center ${passwordRequirements.hasUpperCase ? 'text-green-500' : 'text-foreground/60'}`}>
                        {passwordRequirements.hasUpperCase ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        At least one uppercase letter
                      </div>
                      <div className={`flex items-center ${passwordRequirements.hasLowerCase ? 'text-green-500' : 'text-foreground/60'}`}>
                        {passwordRequirements.hasLowerCase ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        At least one lowercase letter
                      </div>
                      <div className={`flex items-center ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-foreground/60'}`}>
                        {passwordRequirements.hasNumber ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        At least one number
                      </div>
                      <div className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-foreground/60'}`}>
                        {passwordRequirements.hasSpecialChar ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                        At least one special character
                      </div>
                    </div>
                  )}
                </div>
                
                {!isLogin && (
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          className="w-4 h-4 border border-border rounded bg-secondary/50 focus-ring"
                          required
                          checked={acceptedTerms}
                          onChange={() => setAcceptedTerms(!acceptedTerms)}
                        />
                      </div>
                      <label htmlFor="terms" className="ml-2 text-sm text-foreground/70">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium focus-ring flex items-center justify-center transition-all-200 hover:bg-primary/90 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                  {!isLoading && <ArrowRight size={16} className="ml-2" />}
                </button>
                
                <div className="relative flex items-center mt-6 mb-6">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-4 text-foreground/60 text-sm">or</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>
                
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg bg-white border border-border text-foreground font-medium focus-ring flex items-center justify-center transition-all-200 hover:bg-secondary/50 disabled:opacity-70"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleView}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleView}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
