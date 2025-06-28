
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/context/CurrencyContext";

interface Product {
  id: string;
  title: string;
  price: number;
  status?: string;
}

interface CreateAuctionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (auction: {
    productId: string;
    title: string;
    description: string;
    startingPrice: number;
    endDate: string;
  }) => void;
  products: Product[];
}

const CreateAuctionDialog = ({ open, onClose, onSubmit, products }: CreateAuctionDialogProps) => {
  const { formatPrice } = useCurrency();
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductChange = (id: string) => {
    setProductId(id);
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      // Set default starting price to 50% of product price (just a suggestion)
      setStartingPrice((product.price * 0.5).toFixed(2));
      setTitle(`Auction for ${product.title}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = parseFloat(startingPrice);
    if (isNaN(price) || price <= 0) {
      return; // Validation error
    }
    
    onSubmit({
      productId,
      title,
      description,
      startingPrice: price,
      endDate
    });
    
    // Reset form
    setProductId("");
    setTitle("");
    setDescription("");
    setStartingPrice("");
    setEndDate("");
    setSelectedProduct(null);
  };
  
  // Calculate minimum and maximum date-time for auction end (1 day to 30 days from now)
  const minDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  })();
  
  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  })();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Auction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Select value={productId} onValueChange={handleProductChange} required>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title} - {formatPrice(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">Auction Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Special Auction for Vintage Chair"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your auction"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="startingPrice">Starting Price (USD)</Label>
            <Input
              id="startingPrice"
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Product price: {formatPrice(selectedProduct.price)}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endDate">Auction End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={minDate}
              max={maxDate}
              required
            />
            <p className="text-xs text-muted-foreground">
              Auctions can run between 1 and 30 days
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Auction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionDialog;
