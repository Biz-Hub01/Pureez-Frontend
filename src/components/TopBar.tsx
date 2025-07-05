import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const TopBar = () => (
  <div className="bg-orange-500 text-white text-xs md:text-sm py-1.5 px-4">
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center">
        <Mail size={12} className="mr-1" />
        <span>info@declutter.com</span>
      </div>
      <div className="flex items-center">
        <Phone size={12} className="mr-1" />
        Want to sell and make money? Call or WhatsApp 
        <a href="https://wa.me/254746360788" className="ml-1 bg-orange-100 text-orange-500 px-1.5 py-0.5 rounded">
          254746360788
        </a>
      </div>
      <div className="flex items-center">
        <MapPin size={12} className="mr-1" />
        <span>Nairobi, Kenya</span>
      </div>
    </div>
  </div>
);
export default TopBar;