
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  imageSrc: string;
  to: string;
  className?: string;
}

const CategoryCard = ({ title, imageSrc, to, className }: CategoryCardProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square transition-all-300 hover:shadow-lg focus-ring",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent z-10" />
      
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 z-20">
        <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
