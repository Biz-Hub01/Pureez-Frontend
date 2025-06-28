
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  title: string;
  condition: string;
}

const ProductImages = ({ images, title, condition }: ProductImagesProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
        <img
          src={images[currentImage]}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        <button
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all-200"
          onClick={handlePrevImage}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all-200"
          onClick={handleNextImage}
        >
          <ChevronRight size={20} />
        </button>
        
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">
            {condition}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "overflow-hidden rounded-lg aspect-[4/3] transition-all-200",
              currentImage === index 
                ? "ring-2 ring-primary" 
                : "opacity-70 hover:opacity-100"
            )}
            onClick={() => setCurrentImage(index)}
          >
            <img 
              src={image} 
              alt={`${title} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
