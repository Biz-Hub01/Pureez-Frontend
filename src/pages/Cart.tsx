
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Truck, Clock, CreditCard, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartItemCount } = useCart();
  const { formatPrice, convertPrice } = useCurrency();
  const [activeStep, setActiveStep] = useState(1);
  
  const increaseQuantity = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };
  
  const decreaseQuantity = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };
  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shippingFee = subtotal > 50 ? 0 : 10;
  const platformFee = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee + platformFee;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-primary">
                    <Home size={16} className="mr-2" />
                    Home
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-foreground/40 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-primary">Shopping Cart</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="glass-card p-8 rounded-xl text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-foreground/70 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link
                to="/catalog"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all-200"
              >
                <span>Continue Shopping</span>
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="w-full lg:w-8/12">
                {/* Steps */}
                <div className="glass-card p-6 rounded-xl mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full mr-2",
                        activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/60"
                      )}>
                        1
                      </div>
                      <span className={cn(
                        "font-medium",
                        activeStep >= 1 ? "text-foreground" : "text-foreground/60"
                      )}>Cart</span>
                    </div>
                    <div className="h-0.5 w-12 bg-border"></div>
                    <div className="flex items-center">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full mr-2",
                        activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/60"
                      )}>
                        2
                      </div>
                      <span className={cn(
                        "font-medium",
                        activeStep >= 2 ? "text-foreground" : "text-foreground/60"
                      )}>Shipping</span>
                    </div>
                    <div className="h-0.5 w-12 bg-border"></div>
                    <div className="flex items-center">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full mr-2",
                        activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/60"
                      )}>
                        3
                      </div>
                      <span className={cn(
                        "font-medium",
                        activeStep >= 3 ? "text-foreground" : "text-foreground/60"
                      )}>Payment</span>
                    </div>
                  </div>
                </div>
                
                {/* Cart Items */}
                <div className="glass-card rounded-xl overflow-hidden mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-6 animate-fade-in",
                        index < cartItems.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 sm:ml-6">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h3 className="font-medium mb-1">{item.title}</h3>
                              <p className="text-sm text-foreground/70 mb-3">Seller: {item.seller}</p>
                            </div>
                            <div className="text-lg font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                type="button"
                                className="px-3 py-1 text-foreground/70 hover:text-foreground"
                                onClick={() => decreaseQuantity(item.id)}
                              >
                                -
                              </button>
                              <span className="w-10 text-center py-1 border-x border-border">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-3 py-1 text-foreground/70 hover:text-foreground"
                                onClick={() => increaseQuantity(item.id)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="text-foreground/60 hover:text-destructive transition-all-200"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <Link
                    to="/catalog"
                    className="flex items-center text-primary font-medium hover:underline"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="w-full lg:w-4/12">
                <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Shipping</span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span>{formatPrice(shippingFee)}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Platform Fee (5%)</span>
                        <span>{formatPrice(platformFee)}</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">{formatPrice(total)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="mt-6 w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all-200"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <div className="mt-6 flex items-center text-sm text-foreground/70">
                      <Truck size={16} className="mr-2" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-foreground/70">
                      <Clock size={16} className="mr-2" />
                      <span>Estimated delivery: 3-5 business days</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-foreground/70">
                      <CreditCard size={16} className="mr-2" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
