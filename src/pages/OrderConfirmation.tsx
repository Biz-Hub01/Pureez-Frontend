import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, ArrowRight, HelpCircle, Home, Loader2 } from "lucide-react";
import DeliveryTracking from "@/components/DeliveryTracking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  shipping_info: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
  };
  payment_method: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  delivery_option: string;
  payment_reference: string | null;
};

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  const deliveryOptions = {
    standard: { name: "Standard Delivery", description: "3-5 business days" },
    express: { name: "Express Delivery", description: "1-2 business days" },
    pickup: { name: "Store Pickup", description: "Ready in 2 hours" }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (error) throw error;
    
        // Cast to Order type
        setOrder(data as unknown as Order);
        
        // Fetch payment details if M-Pesa
        if (data.payment_method === 'mpesa' && data.payment_reference) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/mpesa/payment-status/${data.payment_reference}`
            );
            setPaymentDetails(response.data.data);
          } catch (error) {
            console.error("Failed to fetch payment details:", error);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
  const verifyMpesaPayment = async () => {
    if (order?.payment_method === 'mpesa' && order.payment_reference) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/mpesa/payment-status/${order.payment_reference}`
        );

        if (response.data.status === 'success') {
          // Update order status if payment succeeded
        await updateOrderStatus('completed');
        } else if (response.data.status === 'failed') {
          await updateOrderStatus('failed');
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
      }
    }
  };

  const updateOrderStatus = async (status: string) => {
    if (order?.status !== status) {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id);
      
      setOrder(prev => prev ? {...prev, status} : prev);
    }
  };

  verifyMpesaPayment();
}, [order]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p>Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-foreground/70 mb-6">
              We couldn't find an order with ID: {orderId}
            </p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate estimated delivery date (3 days from order date)
  const orderDate = new Date(order.created_at);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 3);
  
  const deliveryOption = deliveryOptions[order.delivery_option as keyof typeof deliveryOptions] || 
    deliveryOptions.standard;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Order Confirmation Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${
            order.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {order.status === 'completed' ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <Clock className="h-12 w-12 text-yellow-600" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {order.status === 'completed' ? "Order Confirmed!" : "Order Processing"}
          </h1>
          
          <p className="text-foreground/70 mb-8 max-w-lg mx-auto">
            {order.status === 'completed' 
              ? "Thank you for your purchase. Your order has been confirmed and will be shipped soon." 
              : "We're processing your order. You'll receive a confirmation when it's ready."}
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-col lg:flex-row justify-between mb-6 pb-6 border-b border-border gap-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
              <p className="text-foreground/70">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className={`mt-2 font-medium ${
                order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <CurrencySelector />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <HelpCircle className="mr-2 h-4 w-4" /> Need Help?
                </Button>
                <Link to="/catalog">
                  <Button size="sm">
                    Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <h3 className="font-medium mb-4">Order Items</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img 
                  src={item.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={item.title} 
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.title}</div>
                  <div className="text-sm text-foreground/70">Quantity: {item.quantity}</div>
                  <div className="font-medium">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex justify-between font-bold">
            <span>Order Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          
          {/* Payment Details */}
          {order.payment_method === 'mpesa' && paymentDetails && (
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="font-medium mb-2">Payment Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-foreground/70">M-Pesa Receipt:</div>
                <div className="font-medium">{paymentDetails.MpesaReceiptNumber}</div>
                
                <div className="text-foreground/70">Phone Number:</div>
                <div className="font-medium">{paymentDetails.PhoneNumber}</div>
                
                <div className="text-foreground/70">Transaction Date:</div>
                <div className="font-medium">
                  {new Date(paymentDetails.TransactionDate).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Tracking */}
        <DeliveryTracking 
          orderId={order.id} 
          estimatedDelivery={deliveryDate.toLocaleDateString()} 
          status={order.status}
          deliveryOption={deliveryOption} 
        />

        {/* Customer Support */}
        <div className="mt-8 text-center">
          <p className="text-foreground/70 mb-4">
            If you have any questions about your order, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/support">
              <Button variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" /> Visit Support Center
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
