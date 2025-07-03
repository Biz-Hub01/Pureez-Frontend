import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Check, 
  ArrowRight, 
  MapPin, 
  Truck, 
  Shield, 
  Package, 
  ChevronLeft,
  Phone,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import WhatsAppCheckout from "@/components/WhatsAppCheckout";
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

const deliveryOptions = [
  { 
    id: "standard", 
    name: "Standard Delivery", 
    price: 0, 
    description: "3-5 business days", 
    icon: Truck 
  },
  { 
    id: "express", 
    name: "Express Delivery", 
    price: 12.99, 
    description: "1-2 business days", 
    icon: Truck 
  },
  { 
    id: "pickup", 
    name: "Store Pickup", 
    price: 0, 
    description: "Ready in 2 hours", 
    icon: MapPin 
  },
];

const paymentMethods = [
  {
    id: "whatsapp",
    name: "WhatsApp Checkout",
    icon: Phone,
    description: "Complete purchase via WhatsApp"
  },
  {
    id: "mpesa",
    name: "M-Pesa",
    icon: Phone,
    description: "Pay via mobile money transfer"
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Pay securely with your card"
  },
];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Kenya",
    phone: "",
    email: ""
  });
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0].id);
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "mpesa" | "card">("whatsapp");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { formatPrice, convertPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'waiting' | 'success' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>('');
  const verificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const paymentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentInterval = verificationIntervalRef.current;

    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, []);

  // Load saved address from localStorage if available
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        const address = JSON.parse(savedAddress);
        setShippingInfo(prevInfo => ({
          ...prevInfo,
          ...address
        }));
      } catch (error) {
        console.error('Failed to parse saved address:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("card.")) {
      setCardInfo({ ...cardInfo, [name.replace("card.", "")]: value });
    } else {
      setShippingInfo({ ...shippingInfo, [name]: value });
    }
  };

  const validateShippingInfo = () => {
    // Required fields for shipping
    const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zipCode', 'country', 'phone', 'email'];
    
    for (const field of requiredFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo]?.trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    // Save address to localStorage for future use
    localStorage.setItem('userAddress', JSON.stringify(shippingInfo));
    return true;
  };

  const validatePaymentInfo = () => {
    if (paymentMethod === "card") {
      for (const [key, value] of Object.entries(cardInfo)) {
        if (!value.trim()) {
          toast({
            title: "Missing Payment Information",
            description: `Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
            variant: "destructive"
          });
          return false;
        }
      }
    } else if (paymentMethod === "mpesa") {
      if (!mpesaPhone.trim()) {
        toast({
          title: "Missing Phone Number",
          description: "Please enter your M-Pesa phone number",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (activeStep === "shipping") {
      if (validateShippingInfo()) {
        setActiveStep("payment");
      }
    } else if (activeStep === "payment") {
      if (validatePaymentInfo()) {
        setActiveStep("review");
      }
    }
  };

  const prevStep = () => {
    if (activeStep === "payment") {
      setActiveStep("shipping");
    } else if (activeStep === "review") {
      setActiveStep("payment");
    }
  };


    const initiateMpesaPayment = async (): Promise<boolean> => {
      setPaymentStatus('processing');
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const amount = Math.round(total);

    const response = await axios.post(
      `${backendUrl}/api/mpesa/payment`,
      {
        phone: mpesaPhone,
        amount: amount
      }
    );
      
    if (response.data.ResponseCode === "0") {
      toast({
        title: "Payment Request Sent",
        description: "Please check your phone to complete the M-Pesa payment",
      });

      const checkoutRequestId = response.data.CheckoutRequestID;
      setCheckoutRequestId(checkoutRequestId);
      setPaymentStatus('waiting');

      // Start payment verification
      startPaymentVerification(checkoutRequestId);

      return true;
    } else {
      toast({
        title: "Payment Failed",
        description: response.data.ResponseDescription || "Failed to initiate payment",
        variant: "destructive"
      });
      setPaymentStatus('failed');
      return false;
    }
  } catch (error: any) {
    console.error("M-Pesa payment error:", error);

    let errorMessage = "Failed to process payment";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out";
      }

    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive"
    });

    setPaymentStatus('failed');
    return false;
  }  
  };

  // Update startPaymentVerification to include orderId
  const startPaymentVerification = (checkoutRequestId: string) => {
   if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }

  let attempts = 0;
  const maxAttempts = 36; // 3 minutes (5s * 36)

    verificationIntervalRef.current = setInterval(async () => {
      try {
        attempts++;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/mpesa/payment-status/${checkoutRequestId}`
        );

        if (response.data.status === 'success') {
          clearInterval(verificationIntervalRef.current as NodeJS.Timeout);
          setPaymentStatus('success');

          // Create order only after successful payment verification
          const orderId = await createOrder(checkoutRequestId);
          if (orderId) {
            clearCart();
            navigate(`/order-confirmation/${orderId}`);
          } else {
          toast({
            title: "Order Creation Failed",
            description: "Payment succeeded but order could not be created",
            variant: "destructive"
          });
        }
        } else if (response.data.status === 'failed') {
          clearInterval(verificationIntervalRef.current as NodeJS.Timeout);
          setPaymentStatus('failed');
          toast({
            title: "Payment Failed",
            description: "Payment was not completed",
            variant: "destructive"
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(verificationIntervalRef.current as NodeJS.Timeout);
          setPaymentStatus('failed');
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        if (attempts >= maxAttempts) {
        clearInterval(verificationIntervalRef.current as NodeJS.Timeout);
        setPaymentStatus('failed');
        toast({
          title: "Verification Error",
          description: "Failed to verify payment status",
          variant: "destructive"
        });
      }
      }
    }, 5000); // Check every 5 seconds
  };

  const createOrder = async (paymentReference: string | null): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const orderItems = cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: paymentMethod === "mpesa" ? 'processing' : 'completed',
          total,
          shipping_info: shippingInfo,
          payment_method: paymentMethod,
          items: orderItems,
          delivery_option: selectedDelivery,
          payment_reference: paymentReference
        })
        .select('id')
        .single();

      if (error) throw error;
      return order.id;
    } catch (error) {
      console.error("Order creation error:", error);
      return "";
    }
  };

const completeOrder = async () => {
    if (paymentMethod === "mpesa") {
      await initiateMpesaPayment();
    } else {
      setPaymentStatus('processing');
      const orderId = await createOrder(null);
      if (orderId) {
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
        toast({
          title: "Order Placed Successfully!",
          description: "Your items will be on their way soon.",
        });
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + deliveryFee + tax;

  // Convert cart items to the format expected by WhatsAppCheckout
  const whatsappCartItems = cartItems.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }));

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="glass-card p-8 rounded-xl max-w-md mx-auto">
            <Package className="w-16 h-16 mx-auto text-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-foreground/70 mb-6">Add some items to your cart before checking out.</p>
            <Button asChild>
              <Link to="/catalog">Browse Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-wrap md:flex-nowrap gap-8">
          {/* Main Checkout Form */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center mb-8">
              <Link to="/cart" className="flex items-center text-foreground/70 hover:text-foreground">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Cart
              </Link>
              <div className="ml-auto flex items-center">
                <div className={`w-3 h-3 rounded-full ${activeStep === "shipping" ? "bg-primary" : "bg-primary/30"}`}></div>
                <div className={`w-8 h-0.5 ${activeStep === "shipping" ? "bg-primary/30" : activeStep === "payment" ? "bg-primary" : "bg-primary/30"}`}></div>
                <div className={`w-3 h-3 rounded-full ${activeStep === "payment" ? "bg-primary" : activeStep === "review" ? "bg-primary" : "bg-primary/30"}`}></div>
                <div className={`w-8 h-0.5 ${activeStep === "review" ? "bg-primary" : "bg-primary/30"}`}></div>
                <div className={`w-3 h-3 rounded-full ${activeStep === "review" ? "bg-primary" : "bg-primary/30"}`}></div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <Accordion 
              type="single" 
              defaultValue="shipping" 
              value={activeStep} 
              collapsible={false}
            >
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xl font-semibold">
                  Shipping Information
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="streetAddress" className="block text-sm font-medium">Street Address <span className="text-red-500">*</span></label>
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        value={shippingInfo.streetAddress}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium">City <span className="text-red-500">*</span></label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium">State/Province <span className="text-red-500">*</span></label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code <span className="text-red-500">*</span></label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="block text-sm font-medium">Country <span className="text-red-500">*</span></label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-border rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Delivery Options</h3>
                    <div className="space-y-3">
                      {deliveryOptions.map(option => (
                        <div 
                          key={option.id}
                          className={`p-4 border rounded-md cursor-pointer transition-all ${
                            selectedDelivery === option.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30"
                          }`}
                          onClick={() => setSelectedDelivery(option.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              selectedDelivery === option.id ? "border-primary" : "border-foreground/30"
                            }`}>
                              {selectedDelivery === option.id && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{option.name}</div>
                                <div>{option.price === 0 ? "Free" : formatPrice(option.price)}</div>
                              </div>
                              <div className="text-sm text-foreground/70">{option.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button 
                      onClick={nextStep}
                      className="w-full sm:w-auto"
                    >
                      Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment">
                <AccordionTrigger className="text-xl font-semibold">
                  Payment Method
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 mt-4">
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id}
                          className={`p-4 border rounded-md transition-all ${
                            paymentMethod === method.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex items-center flex-1">
                              <method.icon className="mr-2 h-5 w-5" />
                              <div>
                                <Label htmlFor={method.id} className="font-medium">{method.name}</Label>
                                <p className="text-sm text-foreground/70">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    {paymentMethod === "whatsapp" && (
                      <div className="mt-6">
                        <WhatsAppCheckout 
                          cartItems={whatsappCartItems}
                          subtotal={subtotal}
                          total={total}
                        />
                      </div>
                    )}

                    {paymentMethod === "mpesa" && (
                      <div className="mt-6 space-y-4 p-4 border border-border rounded-md bg-secondary/10">
                        <div className="space-y-2">
                          <label htmlFor="mpesaPhone" className="block text-sm font-medium">M-Pesa Phone Number <span className="text-red-500">*</span></label>
                          <Input
                            id="mpesaPhone"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="e.g. 0758220058"
                            className="w-full"
                            required
                          />
                          <p className="text-xs text-foreground/70 mt-1">
                            Enter the phone number registered with M-Pesa. You will receive a prompt to complete payment.
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4 p-4 border border-border rounded-md bg-secondary/10">
                        <div className="space-y-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium">Card Number <span className="text-red-500">*</span></label>
                          <input
                            id="cardNumber"
                            name="card.cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardInfo.cardNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="expiry" className="block text-sm font-medium">Expiry Date <span className="text-red-500">*</span></label>
                            <input
                              id="expiry"
                              name="card.expiry"
                              type="text"
                              placeholder="MM/YY"
                              value={cardInfo.expiry}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="cvc" className="block text-sm font-medium">CVC <span className="text-red-500">*</span></label>
                            <input
                              id="cvc"
                              name="card.cvc"
                              type="text"
                              placeholder="123"
                              value={cardInfo.cvc}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-border rounded-md"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="nameOnCard" className="block text-sm font-medium">Name on Card <span className="text-red-500">*</span></label>
                          <input
                            id="nameOnCard"
                            name="card.nameOnCard"
                            type="text"
                            value={cardInfo.nameOnCard}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={nextStep}
                    >
                      Review Order <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="review">
                <AccordionTrigger className="text-xl font-semibold">
                  Review & Place Order
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 mt-4">
                    {/* Product Review */}
                    <div>
                      <h3 className="font-medium mb-4">Items in Your Order</h3>
                      {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4 py-4 border-b border-border">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-20 h-20 object-cover rounded-md" 
                          />
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className="text-foreground/70">Quantity: {item.quantity}</div>
                            <div className="font-medium">{formatPrice(item.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Shipping Information */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Shipping Information</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveStep("shipping")}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="p-4 border border-border rounded-md bg-secondary/10">
                        <p>
                          {shippingInfo.firstName} {shippingInfo.lastName}<br />
                          {shippingInfo.streetAddress}<br />
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                          {shippingInfo.country}<br />
                          {shippingInfo.phone}<br />
                          {shippingInfo.email}
                        </p>
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="font-medium">
                            {deliveryOptions.find(option => option.id === selectedDelivery)?.name}
                          </div>
                          <div className="text-sm text-foreground/70">
                            {deliveryOptions.find(option => option.id === selectedDelivery)?.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Payment Method</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveStep("payment")}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="p-4 border border-border rounded-md bg-secondary/10">
                        {paymentMethod === "card" && (
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-5 w-5" />
                            <div>
                              <p className="font-medium">Credit Card</p>
                              <p className="text-sm text-foreground/70">
                                {cardInfo.cardNumber ? `**** **** **** ${cardInfo.cardNumber.slice(-4)}` : ""}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {paymentMethod === "mpesa" && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-5 w-5" />
                            <div>
                              <p className="font-medium">M-Pesa</p>
                              <p className="text-sm text-foreground/70">
                                {mpesaPhone || "Not specified"}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {paymentMethod === "whatsapp" && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-5 w-5" />
                            <div>
                              <p className="font-medium">WhatsApp Checkout</p>
                              <p className="text-sm text-foreground/70">
                                Complete purchase via WhatsApp
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={completeOrder}
                      disabled={paymentStatus === 'processing' || paymentStatus === 'waiting'}
                    >
                      {paymentStatus === 'processing' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : paymentStatus === 'waiting' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {paymentStatus === 'processing' ? "Processing..." : 
                      paymentStatus === 'waiting' ? "Waiting for Payment..." : 
                      "Place Order"}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Order Summary */}
          <div className="w-full md:w-1/3">
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <h2 className="font-bold text-xl mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center text-sm text-foreground/70">
                  <Shield className="h-4 w-4 mr-2" /> 
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <Package className="h-4 w-4 mr-2" /> 
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;