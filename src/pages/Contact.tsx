import { useState, useRef, useEffect } from "react";
import { Mail, MessageSquare, Phone, MapPin, Send, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Save to database
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name,
            email,
            subject: subject || 'Contact Form Submission',
            message
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      
      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    
    // Simulate agent response after 1 second
    setTimeout(() => {
      const responses = [
        "Thank you for your message. How else can I assist you?",
        "I'm looking into this for you. Can you provide more details?",
        "We typically respond to inquiries within 24 hours. Is there anything specific you need help with today?",
        "I'd be happy to help you with that. Let me check our available options.",
        "That's a great question. Let me find the best answer for you."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAgentMessage: Message = {
        id: Date.now().toString(),
        sender: 'agent',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newAgentMessage]);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-12">
          Have questions, feedback, or need assistance? We're here to help! Choose your preferred way to reach us below.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-foreground/70 mb-4">Our support team typically responds within 24 hours</p>
            <a href="mailto:support@declutter.com" className="text-primary hover:underline font-medium">
              support@declutter.com
            </a>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-foreground/70 mb-4">Available Monday to Friday, 9am to 5pm</p>
            <a href="tel:+15551234567" className="text-primary hover:underline font-medium">
              +1 (555) 123-4567
            </a>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Office</h3>
            <p className="text-foreground/70 mb-4">Visit our headquarters in downtown</p>
            <address className="not-italic text-primary">
              123 Commerce St.<br />
              Suite 400<br />
              San Francisco, CA 94103
            </address>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmitForm}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?"
                />
              </div>
              
              <div className="space-y-2 mb-6">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your inquiry in detail..."
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full sm:w-auto">
                Submit Message
              </Button>
            </form>
          </div>
          
          {/* Business Hours and FAQ */}
          <div>
            <div className="glass-card p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-semibold mb-6">Business Hours</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Monday - Friday</h3>
                    <p className="text-foreground/70">9:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Saturday</h3>
                    <p className="text-foreground/70">10:00 AM - 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium">Sunday</h3>
                    <p className="text-foreground/70">Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold mb-1">How does shipping work?</h3>
                  <p className="text-foreground/70">We offer free shipping on orders over $50. Most items ship within 1-2 business days.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">What's your return policy?</h3>
                  <p className="text-foreground/70">We accept returns within 30 days of purchase. Items must be in original condition.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How do I become a seller?</h3>
                  <p className="text-foreground/70">Navigate to the Seller Dashboard and follow the registration process. Each seller is verified before approval.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="mb-3 text-foreground/70">Still have questions?</p>
                <Button 
                  onClick={() => setLiveChatOpen(true)}
                  className="flex items-center mx-auto"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Live Chat Widget */}
      <div 
        className={`fixed bottom-4 right-4 z-50 ${
          liveChatOpen ? 'w-80 h-96' : 'w-16 h-16'
        } transition-all duration-300 ease-in-out`}
      >
        {liveChatOpen ? (
          <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">Customer Support</span>
              </div>
              <button 
                onClick={() => setLiveChatOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-4 ${
                    msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <form 
              onSubmit={handleSendChatMessage}
              className="border-t border-border p-3 flex"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 mr-2"
              />
              <Button type="submit" size="sm" className="px-3">
                <Send size={18} />
              </Button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setLiveChatOpen(true)}
            className="w-full h-full rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare size={24} />
          </button>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default Contact;
