
export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string; // Changed from union type to string to match database
  location: string;
  imageSrc: string;
  className?: string;
  usedFor?: string;
  seller?: string;
  room?: string;
  category?: string;
  videos?: string[];
  stock?: number;
}
