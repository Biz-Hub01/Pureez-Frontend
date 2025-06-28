
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuctionItem } from "@/pages/Offers";

interface AuctionItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<AuctionItem, "id" | "currentBid" | "status">) => void;
}

export function AuctionItemDialog({ open, onClose, onAdd }: AuctionItemDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !startingPrice || !imageUrl || !endTime) {
      return; // Basic validation
    }
    
    onAdd({
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      imageUrl,
      endTime: new Date(endTime).toISOString(),
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setStartingPrice("");
    setImageUrl("");
    setEndTime("");
  };
  
  // Calculate minimum date-time for auction end (1 hour from now)
  const minDateTime = (() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  })();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Auction Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Item Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="startingPrice">Starting Price ($)</Label>
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endTime">Auction End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={minDateTime}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Auction Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
