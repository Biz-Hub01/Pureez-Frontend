
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, HelpCircle, Home } from "lucide-react";
import DeliveryTracking from "@/components/DeliveryTracking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatPrice } = useCurrency();
  
  // This would come from an API in a real application
  const orderDetails = {
    id: orderId || "12345", 
    date: "April 3, 2025",
    total: 689.98,
    estimatedDelivery: "April 6, 2025",
    items: [
      {
        id: "1",
        title: "Vintage Wooden Chair",
        price: 89.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1561431521-3a5750c4ad77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "2",
        title: "Mid-Century Modern Sofa",
        price: 599.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Order Confirmation Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-green-100 rounded-full mb-4 sm:mb-6">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-sm sm:text-base text-foreground/70 max-w-lg mx-auto px-4">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="glass-card p-4 sm:p-6 rounded-xl mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row justify-between mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Order #{orderDetails.id}</h2>
              <p className="text-sm sm:text-base text-foreground/70">Placed on {orderDetails.date}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <CurrencySelector />
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <HelpCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Need Help?
                </Button>
                <Link to="/catalog">
                  <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                    Continue Shopping <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <h3 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h3>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {orderDetails.items.map(item => (
              <div key={item.id} className="flex gap-3 sm:gap-4">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.title}</div>
                  <div className="text-xs sm:text-sm text-foreground/70">Quantity: {item.quantity}</div>
                  <div className="font-medium text-sm sm:text-base">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 sm:pt-4 flex justify-between font-bold text-sm sm:text-base">
            <span>Order Total</span>
            <span>{formatPrice(orderDetails.total)}</span>
          </div>
        </div>

        {/* Delivery Tracking */}
        <DeliveryTracking 
          orderId={orderDetails.id} 
          estimatedDelivery={orderDetails.estimatedDelivery} 
        />

        {/* Customer Support */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-foreground/70 mb-3 sm:mb-4 px-4">
            If you have any questions about your order, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link to="/support">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                <HelpCircle className="mr-2 h-4 w-4" /> Visit Support Center
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
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
