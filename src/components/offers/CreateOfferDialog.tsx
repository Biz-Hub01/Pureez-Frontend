
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

interface Product {
  id: string;
  title: string;
  price: number;
  status?: string;
}

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (offer: {
    productId: string;
    title: string;
    description: string;
    discountPercentage: number;
    endDate: string;
  }) => void;
  products: Product[];
}

const CreateOfferDialog = ({ open, onClose, onSubmit, products }: CreateOfferDialogProps) => {
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const discountValue = parseInt(discountPercentage);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 99) {
      return; // Validation error
    }
    
    onSubmit({
      productId,
      title,
      description,
      discountPercentage: discountValue,
      endDate
    });
    
    // Reset form
    setProductId("");
    setTitle("");
    setDescription("");
    setDiscountPercentage("");
    setEndDate("");
  };
  
  // Calculate minimum date-time for offer end (1 day from now)
  const minDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  })();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Special Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Select value={productId} onValueChange={setProductId} required>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>{product.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="title">Offer Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Sale 20% Off"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your special offer"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
            <Input
              id="discountPercentage"
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="e.g., 15"
              min="1"
              max="99"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endDate">Offer End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={minDate}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Offer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferDialog;
