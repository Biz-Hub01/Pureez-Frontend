
import { Star } from "lucide-react";

const testimonials = [
  {
    id: "t1",
    name: "Sarah Johnson",
    role: "Buyer",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content: "I've found so many unique pieces for my new apartment at amazing prices. The sellers are responsive and the shipping is quick!",
    rating: 5
  },
  {
    id: "t2",
    name: "Michael Peterson",
    role: "Seller",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content: "Declutter at Pureez made it so easy to sell my old furniture when I was downsizing. I made $2,000 in just two weeks!",
    rating: 5
  },
  {
    id: "t3",
    name: "Lisa Wong",
    role: "Buyer & Seller",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    content: "I love that I can both buy and sell on the same platform. The verification process makes me feel safe when making transactions.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">What Our Users Say</h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto px-4">
            Hear from our community of buyers and sellers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card p-4 sm:p-6 rounded-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-foreground/70">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3 sm:mb-4">
                {Array(testimonial.rating).fill(null).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500 sm:w-4 sm:h-4" />
                ))}
                {Array(5 - testimonial.rating).fill(null).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-500/30 sm:w-4 sm:h-4" />
                ))}
              </div>
              
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
