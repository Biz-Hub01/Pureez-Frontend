
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

interface MessageResponseProps {
  messageId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  originalMessage: string;
  onClose: () => void;
}

const MessageResponse = ({
  messageId,
  customerName,
  customerEmail,
  subject,
  originalMessage,
  onClose
}: MessageResponseProps) => {
  const [response, setResponse] = useState("");

  const handleSendResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response message",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real app, you would send this to your backend
      console.log("Sending response:", {
        messageId,
        response,
        to: customerEmail
      });

      toast({
        title: "Response Sent",
        description: `Your response has been sent to ${customerName}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg max-w-lg w-full mx-4">
      <h3 className="text-xl font-bold mb-2">
        Responding to: {subject}
      </h3>
      <p className="text-sm text-muted-foreground mb-2">
        To: {customerName} ({customerEmail})
      </p>
      
      <div className="bg-muted p-4 rounded-md mb-4">
        <p className="text-sm">{originalMessage}</p>
      </div>
      
      <div className="space-y-4">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response here..."
          className="min-h-[120px]"
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendResponse}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Response
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageResponse;
