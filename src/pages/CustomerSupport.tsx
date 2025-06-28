
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, MessageSquare, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const FAQs = [
  {
    id: "faq1",
    question: "How do I return an item?",
    answer: "To return an item, go to your order history, select the order containing the item you wish to return, and click the 'Return Item' button. Follow the instructions to generate a return label. You'll have 14 days from the delivery date to initiate a return."
  },
  {
    id: "faq2",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For certain sellers, we also offer financing options through Affirm."
  },
  {
    id: "faq3",
    question: "How long does shipping take?",
    answer: "Shipping times vary depending on the seller and your location. Most items ship within 1-3 business days. Once shipped, standard delivery typically takes 3-5 business days, while express delivery takes 1-2 business days."
  },
  {
    id: "faq4",
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the United States and Canada. We're working on expanding our shipping options to additional countries in the future."
  },
  {
    id: "faq5",
    question: "How can I track my order?",
    answer: "You can track your order by going to the 'My Orders' section in your account dashboard. Click on the specific order to view detailed tracking information."
  },
  {
    id: "faq6",
    question: "What is your cancellation policy?",
    answer: "You can cancel an order at any time before it ships. Once an order has shipped, you'll need to follow our return process instead."
  },
];

const SupportCategories = [
  {
    id: "orders",
    title: "Orders & Delivery",
    icon: "https://cdn-icons-png.flaticon.com/512/1792/1792871.png",
    topics: ["Track Order", "Shipping Issues", "Returns & Refunds", "Order Changes"]
  },
  {
    id: "account",
    title: "Account & Payment",
    icon: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    topics: ["Account Access", "Payment Methods", "Billing Issues", "Password Reset"]
  },
  {
    id: "product",
    title: "Product Support",
    icon: "https://cdn-icons-png.flaticon.com/512/1170/1170577.png",
    topics: ["Product Information", "Product Issues", "Assembly Help", "Care Instructions"]
  },
  {
    id: "selling",
    title: "Selling on Marketplace",
    icon: "https://cdn-icons-png.flaticon.com/512/411/411739.png",
    topics: ["Seller Registration", "Listing Products", "Seller Fees", "Buyer Communication"]
  },
];

const CustomerSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  
  const filteredFAQs = searchQuery
    ? FAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQs;
    
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketSubject || !ticketMessage) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to submit your ticket.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the ticket data to an API
    toast({
      title: "Support Ticket Submitted",
      description: "We've received your message and will respond within 24 hours.",
    });
    
    setTicketSubject("");
    setTicketMessage("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 bg-background">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">How can we help you?</h1>
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-foreground/70" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 placeholder-primary-foreground/70 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Support Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SupportCategories.map((category) => (
                <button
                  key={category.id}
                  className={`glass-card p-6 rounded-xl text-center hover:shadow-md transition-all ${
                    selectedCategory === category.id ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <img 
                    src={category.icon} 
                    alt={category.title}
                    className="w-14 h-14 mx-auto mb-4"
                  />
                  <h3 className="font-semibold mb-3">{category.title}</h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {category.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
          
          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <details
                    key={faq.id}
                    className="glass-card rounded-xl overflow-hidden group"
                  >
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                      <h3 className="font-medium">{faq.question}</h3>
                      <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="p-6 pt-0 border-t border-border">
                      <p className="text-foreground/80">{faq.answer}</p>
                    </div>
                  </details>
                ))}
                
                {searchQuery && filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-foreground/70">No results found for "{searchQuery}"</p>
                    <p className="mt-2">Try using different keywords or browse our categories above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Still Need Help?</h2>
            <div className="max-w-3xl mx-auto glass-card rounded-xl overflow-hidden">
              <div className="p-6 bg-primary text-primary-foreground">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2" />
                  <h3 className="font-semibold">Submit a Support Ticket</h3>
                </div>
              </div>
              
              <form onSubmit={handleTicketSubmit} className="p-6">
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    className="w-full p-3 bg-secondary/50 border border-border rounded-lg"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {SupportCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject <span className="text-red-500">*</span></label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full p-3 bg-secondary/50 border border-border rounded-lg"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message <span className="text-red-500">*</span></label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full p-3 bg-secondary/50 border border-border rounded-lg"
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-foreground/70">
                    We typically respond within 24 hours
                  </p>
                  <button
                    type="submit"
                    className="py-3 px-6 bg-primary text-primary-foreground font-medium rounded-lg"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
              
              <div className="p-6 bg-secondary/50 border-t border-border">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 text-green-800 mr-3">
                    <Check size={18} />
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium mb-1">Need immediate assistance?</h4>
                    <p className="text-foreground/70">
                      Call our customer support line at <strong>(800) 555-1234</strong>, available Monday-Friday, 9am-6pm EST.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomerSupport;
