
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Home, 
  Mail, 
  MessageSquare, 
  Phone, 
  Search, 
  Truck
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// FAQ Categories and Questions
const FAQ_CATEGORIES = [
  {
    id: "shopping",
    title: "Shopping & Ordering",
    questions: [
      {
        question: "How do I place an order?",
        answer: "Placing an order is easy! Browse our catalog, add items to your cart, and proceed to checkout. You'll need to create an account or log in, select shipping and payment methods, and confirm your order."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "You can modify or cancel your order within 1 hour of placing it. After that, the order goes into processing and changes may not be possible. Please contact customer support immediately if you need to make changes."
      },
      {
        question: "Do you offer international shipping?",
        answer: "Currently, we only ship to locations within the United States. We're working on expanding our shipping options to international destinations in the future."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and cash on delivery (COD) for select areas."
      }
    ]
  },
  {
    id: "sellers",
    title: "Selling on Declutter",
    questions: [
      {
        question: "How do I become a seller?",
        answer: "To become a seller, you need to create an account, complete your profile with personal information and verification, and agree to our seller terms and conditions. Once approved, you can start listing items for sale."
      },
      {
        question: "How long does seller approval take?",
        answer: "The seller approval process typically takes 1-2 business days. We review your profile information and verification documents to ensure the safety and quality of our marketplace."
      },
      {
        question: "What fees do sellers pay?",
        answer: "Sellers pay a 5% commission on each successful sale. There are no listing fees or monthly subscription charges."
      },
      {
        question: "How and when do I get paid for sales?",
        answer: "Payments are processed 3 days after the buyer confirms receipt of the item. Funds are transferred to your connected bank account or payment method, and usually arrive within 1-2 business days."
      }
    ]
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days. Shipping times may vary based on your location and the seller's location."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email and in your account dashboard. You can use this tracking number to monitor your package's progress."
      },
      {
        question: "What if my package is damaged or lost?",
        answer: "If your package arrives damaged, please take photos and contact customer support within 48 hours. For lost packages, we'll investigate with the shipping carrier and resolve the situation accordingly."
      }
    ]
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a 14-day return policy for most items. The item must be in its original condition and packaging. Some categories like personal care items may not be eligible for returns."
      },
      {
        question: "How do I return an item?",
        answer: "To return an item, go to your order history, select the order, and click 'Return Item'. Follow the instructions to print a return label and ship the item back. Once received and inspected, your refund will be processed."
      },
      {
        question: "How long do refunds take?",
        answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. It may take an additional 2-5 business days for the refund to appear in your account, depending on your payment method."
      }
    ]
  }
];

// Support contact channels
const CONTACT_CHANNELS = [
  { 
    title: "Live Chat", 
    description: "Chat with our support team in real-time", 
    icon: MessageSquare, 
    action: "Start Chat", 
    hours: "Mon-Fri: 8am-8pm EST, Sat-Sun: 9am-5pm EST" 
  },
  { 
    title: "Email Support", 
    description: "Send us a message, we'll respond within 24 hours", 
    icon: Mail, 
    action: "Email Us", 
    hours: "Responses within 24 hours" 
  },
  { 
    title: "Phone Support", 
    description: "Speak directly with our customer service team", 
    icon: Phone, 
    action: "Call Now", 
    hours: "Mon-Fri: 9am-6pm EST" 
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex justify-between items-center w-full py-4 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="pb-4 text-foreground/70">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Support = () => {
  const [activeCategory, setActiveCategory] = useState("shopping");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ question: string; answer: string; category: string }>>([]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Search through all questions in all categories
    const results = FAQ_CATEGORIES.flatMap(category => {
      return category.questions
        .filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(q => ({ ...q, category: category.title }));
    });
    
    setSearchResults(results);
  };
  
  const handleContactAction = (title: string) => {
    switch (title) {
      case "Live Chat":
        toast({
          title: "Live Chat",
          description: "The chat window would open in a real implementation.",
        });
        break;
      case "Email Support":
        window.location.href = "mailto:support@declutter.com";
        break;
      case "Phone Support":
        window.location.href = "tel:+18005551234";
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-4 mt-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="inline-flex items-center text-sm text-foreground/70 hover:text-primary">
                    <Home size={16} className="mr-2" />
                    Home
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-foreground/40 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-primary">Support</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {/* Support Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-foreground/70 mb-6">
              Find answers to frequently asked questions or get in touch with our support team.
            </p>
            
            <form onSubmit={handleSearch} className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={20} className="text-foreground/60" />
              </div>
              <input
                type="text"
                className="w-full p-4 pl-12 pr-20 bg-secondary/50 border border-border rounded-xl"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-primary text-primary-foreground rounded-lg"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden mb-12 animate-fade-in">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Search Results</h2>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => setSearchResults([])}
                  >
                    Clear Results
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {searchResults.map((result, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-start">
                      <span className="p-1.5 rounded-full bg-primary/10 text-primary mr-3">
                        <HelpCircle size={18} />
                      </span>
                      <div>
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">{result.category}</span>
                        <h3 className="font-medium mt-1">{result.question}</h3>
                        <p className="text-foreground/70 mt-1">{result.answer}</p>
                      </div>
                    </div>
                    {index < searchResults.length - 1 && <hr className="my-4 border-border" />}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Contact Options */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONTACT_CHANNELS.map((channel) => (
                <div key={channel.title} className="glass-card p-6 rounded-xl">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 mb-4">
                    <channel.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                  <p className="text-foreground/70 mb-4">{channel.description}</p>
                  <p className="text-sm text-foreground/60 mb-4">{channel.hours}</p>
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium"
                    onClick={() => handleContactAction(channel.title)}
                  >
                    {channel.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="glass-card rounded-xl overflow-hidden">
              {/* Category Tabs */}
              <div className="border-b border-border">
                <div className="flex overflow-x-auto scrollbar-none">
                  {FAQ_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      className={cn(
                        "px-6 py-4 font-medium whitespace-nowrap",
                        activeCategory === category.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                      )}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* FAQ Questions */}
              <div className="p-6">
                {FAQ_CATEGORIES.find(cat => cat.id === activeCategory)?.questions.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Shipping & Returns Banner */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 md:mr-6 mb-4 md:mb-0">
                <Truck size={28} className="text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Shipping & Returns Policy</h3>
                <p className="text-foreground/70">
                  Learn about our shipping options, delivery timeframes, and our hassle-free returns process.
                </p>
              </div>
              <div className="md:ml-4">
                <Link
                  to="/shipping-returns"
                  className="py-2 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 inline-block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
