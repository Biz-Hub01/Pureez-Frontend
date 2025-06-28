
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

type WhatsAppCheckoutProps = {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
};

const WhatsAppCheckout = ({ cartItems, subtotal, total }: WhatsAppCheckoutProps) => {
  const { formatPrice } = useCurrency();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Sales team WhatsApp number (replace with actual number)
  const salesWhatsAppNumber = "+254758220058"; // Replace with real number
  
  const generateWhatsAppMessage = () => {
    let message = "Hello! I'm interested in purchasing the following items from Declutter:\n\n";
    
    // Add cart items
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   Price: ${formatPrice(item.price)}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    // Add totals
    message += `Order Summary:\n`;
    message += `Subtotal: ${formatPrice(subtotal)}\n`;
    message += `Total: ${formatPrice(total)}\n\n`;
    message += `Please help me complete this purchase. Thank you!`;
    
    return encodeURIComponent(message);
  };
  
  const handleWhatsAppContact = () => {
    setIsConnecting(true);
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${salesWhatsAppNumber.replace(/[^0-9]/g, '')}?text=${message}`;
    
    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };
  
  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 p-4 sm:p-6">
        <CardTitle className="flex items-center text-green-800 dark:text-green-200 text-base sm:text-lg">
          <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Complete Purchase via WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            Connect directly with our sales team to complete your purchase securely and get personalized assistance.
          </p>
          
          <div className="bg-muted p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-sm sm:text-base">Your order will include:</h4>
            <ul className="text-xs sm:text-sm space-y-1">
              {cartItems.slice(0, 3).map((item) => (
                <li key={item.id} className="flex justify-between items-start gap-2">
                  <span className="truncate flex-1">{item.title} (x{item.quantity})</span>
                  <span className="whitespace-nowrap font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
              {cartItems.length > 3 && (
                <li className="text-foreground/60 text-xs">... and {cartItems.length - 3} more items</li>
              )}
            </ul>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-sm sm:text-base">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleWhatsAppContact}
              disabled={isConnecting}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2.5 sm:py-3"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Contact Sales Team"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-sm sm:text-base py-2.5 sm:py-3"
              onClick={() => window.open(`tel:${salesWhatsAppNumber}`, '_self')}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call: {salesWhatsAppNumber}
            </Button>
          </div>
          
          <p className="text-xs text-foreground/60 text-center leading-relaxed">
            Our sales team will help you complete the purchase and arrange delivery
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppCheckout;
