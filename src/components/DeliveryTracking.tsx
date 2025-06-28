
import { Check, Package, Truck } from "lucide-react";

type DeliveryStep = {
  id: string;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  icon: React.ElementType;
};

type DeliveryTrackingProps = {
  orderId: string;
  estimatedDelivery: string;
};

const DeliveryTracking = ({ orderId, estimatedDelivery }: DeliveryTrackingProps) => {
  // This would come from an API in a real application
  const deliverySteps: DeliveryStep[] = [
    {
      id: "order-placed",
      title: "Order Placed",
      description: "Your order has been confirmed",
      date: "April 1, 2025",
      isCompleted: true,
      icon: Package
    },
    {
      id: "order-processed",
      title: "Order Processed",
      description: "Your item has been prepared for shipping",
      date: "April 2, 2025",
      isCompleted: true,
      icon: Package
    },
    {
      id: "shipped",
      title: "Order Shipped",
      description: "Your package is on the way",
      date: "April 3, 2025",
      isCompleted: true,
      icon: Truck
    },
    {
      id: "out-for-delivery",
      title: "Out for Delivery",
      description: "Your package will arrive today",
      date: "April 5, 2025",
      isCompleted: false,
      icon: Truck
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Package has been delivered",
      date: estimatedDelivery,
      isCompleted: false,
      icon: Check
    }
  ];

  const lastCompletedStep = deliverySteps.filter(step => step.isCompleted).length - 1;
  const currentStep = lastCompletedStep + 1;
  
  // Store the current step icon component in a variable to use in JSX
  const CurrentStepIcon = currentStep < deliverySteps.length 
    ? deliverySteps[currentStep].icon 
    : Check;

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Track Your Delivery</h2>
          <p className="text-foreground/70">Order #{orderId}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Estimated Delivery</p>
          <p className="text-foreground/70">{estimatedDelivery}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          {deliverySteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : index === currentStep
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "bg-secondary text-foreground/70"
                  }`}>
                    <StepIcon size={20} />
                  </div>
                  <div className="text-xs mt-2 text-center w-20">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-foreground/70 text-xs">{step.date}</p>
                  </div>
                </div>
                
                {index < deliverySteps.length - 1 && (
                  <div className="flex-1 h-1 mx-2">
                    <div className={`h-full ${
                      index < lastCompletedStep 
                        ? "bg-primary" 
                        : index === lastCompletedStep
                        ? "bg-gradient-to-r from-primary to-secondary/30"
                        : "bg-secondary"
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Current Status Details */}
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold mb-2">Current Status</h3>
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                currentStep < deliverySteps.length
                ? "bg-primary/10 text-primary"
                : "bg-green-100 text-green-800"
              }`}>
                <CurrentStepIcon size={20} />
              </div>
              <div>
                <h4 className="font-medium">
                  {currentStep < deliverySteps.length
                    ? deliverySteps[currentStep].title
                    : "Delivered"}
                </h4>
                <p className="text-foreground/70">
                  {currentStep < deliverySteps.length
                    ? deliverySteps[currentStep].description
                    : "Your package has been delivered successfully"}
                </p>
                <p className="text-sm text-foreground/70 mt-1">
                  {currentStep < deliverySteps.length
                    ? deliverySteps[currentStep].date
                    : estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Package Details */}
        <div className="border-t border-border mt-6 pt-6">
          <h3 className="font-semibold mb-4">Package Details</h3>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Product"
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <h4 className="font-medium">Mid-Century Modern Sofa</h4>
              <p className="text-sm text-foreground/70">Delivery via Express Shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
