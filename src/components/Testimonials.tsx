'use client';

import { Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Yogita Kharche',
    location: 'PCMC, Pune',
    review: 'The best photographer in PCMC area. They have so much patience and art of handling kids. He captures best candid shots which we imagined for our kids to have. Thank you for your service 🫶🏻',
  },
  {
    name: 'Jayshri Ugale',
    location: 'Pune',
    review: 'A huge thank you to Satish and team for an unforgettable photoshoot for our daughter. Their ability to connect with children and capture such pure, joyful moments is truly a gift. The photos are a testament to their skill and passion.',
  },
  {
    name: 'Sanket Bhongade',
    location: 'Pune',
    review: 'We recently had a baby photoshoot and couldn\'t be happier with the experience! At first, we were a bit nervous about how our baby would react, but Mr. and Mrs. Patil made the entire process smooth and comfortable.',
  },
  {
    name: 'Ketan Patil',
    location: 'Pune',
    review: 'We recently did a maternity shoot with Mom and Kids Photography and we are totally in love with the results. Mr. & Mrs. Patil is super lovely and very helpful, he makes you feel comfortable and makes the whole experience enjoyable.',
  },
  {
    name: 'Pradip Ghuge',
    location: 'Pune',
    review: 'We had a baby shower function at home, and I was looking for a photographer who could deliver both quality and value. After exploring several options, I decided to go with Satish Sir\'s Mom and Kid Photography Studio and I\'m so glad I did.',
  },
  {
    name: 'Prashant Yadav',
    location: 'Pune',
    review: 'Nice and quality professional work. Reasonable budget friendly options. Experience with photography was excellent!',
  },
  {
    name: 'Nikku Kumari',
    location: 'Pune',
    review: 'I recently had the opportunity to do a photoshoot for my baby, and it turned out to be one of the most heartwarming and memorable experiences as a parent. From start to finish, everything about the shoot was beautifully planned and handled.',
  },
  {
    name: 'Vijay Narkhede',
    location: 'Pune',
    review: 'We recently availed a maternity photoshoot service and had a truly wonderful experience. From the initial consultation to the final delivery of photos, everything was handled with professionalism, creativity, and genuine care.',
  },
  {
    name: 'Shubham Chaudhari',
    location: 'Pune',
    review: 'We have done our girl\'s new born photo shoot within 10 days of birth. Capturing this early cute moments of our daughter was so special. They both have handled baby so well and taken care with proper hygiene.',
  },
  {
    name: 'Kalyani Dharm',
    location: 'Pune',
    review: 'We hired mom and kid for shoot and the results are very good, photography is very nice. Time punctual and professional. We received photos almost immediately after the event. He captured every moment of our function very seamlessly and beautifully.',
  },
  {
    name: 'Sandhya Mane',
    location: 'Pune',
    review: 'Hats off to Mom\'s and kids photography. Satish and Rohini Patil friendly nature created a relaxed and comfortable mood for the whole session. What struck us most was their ability to capture the pure essence of our moments.',
  },
  {
    name: 'Prafull Warade',
    location: 'Pune',
    review: 'We did our son\'s baby photo shoot just after 18 days. As a parent capturing this early memorable moments was so special. The baby handling and care taken with proper hygiene was very well maintained.',
  },
  {
    name: 'Ash Walunj',
    location: 'Pune',
    review: 'We had the most wonderful experience with Mr. Satish Patil sir for our baby\'s newborn photos! From the moment we arrived, they made us feel comfortable and at ease. Their studio setup was perfect for babies, with a warm and calming environment.',
  },
  {
    name: 'Devendra Patil',
    location: 'Pune',
    review: 'I had an amazing experience with Satish for our kids\' photography session. Satish\'s services are not only reasonably priced but also incredibly creative and beautiful. What impressed me the most was his patience during the shoot.',
  },
  {
    name: 'Neha Salankar',
    location: 'Pune',
    review: 'Excellent experience with Mom and Kids Photography. It\'s simply value for money. We got lovely photographs with excellent editing. Highly recommend Mom and Kids for your life events to capture your beautiful memories.',
  },
  {
    name: 'Dattatray Belkar',
    location: 'Pune',
    review: 'Mr. & Mrs. Patil were incredibly professional throughout the entire shoot. They were patient and accommodating. They also have a great eye for detail and were able to create a variety of beautiful shots in different settings.',
  },
  {
    name: 'Avdhut Khade',
    location: 'Pune',
    review: 'One of our greatest investments was having Satish sir present to capture one of the most beautiful moments in our life. What Satish sir presented to us after our shoot was beyond anything we could have ever dreamed of. He captured our story beautifully.',
  },
  {
    name: 'Abhishek Dahiwal',
    location: 'Pune',
    review: 'We had maternity photoshoot for my wife, It was very wonderful experience. Mr. and Mrs. Patil made us very comfortable during the whole shoot. The pictures came out wonderful. Thank you so much!',
  },
];

// Duplicate testimonials for seamless infinite loop
const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

function TestimonialCard({ 
  testimonial, 
  onHover,
  onClick
}: { 
  testimonial: typeof testimonials[0];
  onHover: (isHovered: boolean) => void;
  onClick: () => void;
}) {
  return (
    <div 
      className="bg-white p-4 sm:p-5 md:p-6 border-2 border-[#F5DEB3] shadow-md hover:shadow-xl min-w-[280px] sm:min-w-[320px] md:min-w-[350px] mx-2 sm:mx-3 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
    >
      <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="fill-[#D4A574] text-[#D4A574] w-3 h-3 sm:w-3.5 sm:h-3.5" />
        ))}
      </div>
      <p className="text-[#6B5D52] mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm leading-relaxed font-light line-clamp-4">
        &quot;{testimonial.review}&quot;
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#D4A574] flex items-center justify-center">
          <span className="text-white font-medium text-sm sm:text-base">
            {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="font-light text-[#3E2723] text-xs sm:text-sm">{testimonial.name}</h4>
          <p className="text-[#8B7355] text-[10px] sm:text-xs">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (selectedTestimonial && !e.state?.testimonialPopup) {
        setSelectedTestimonial(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedTestimonial]);

  // Push history state when popup opens
  useEffect(() => {
    if (selectedTestimonial && !window.history.state?.testimonialPopup) {
      window.history.pushState({ testimonialPopup: true }, '');
    }
  }, [selectedTestimonial]);

  const closePopup = () => {
    if (window.history.state?.testimonialPopup) {
      window.history.back();
    }
    setSelectedTestimonial(null);
  };

  return (
    <section id="testimonials" className="py-12 sm:py-16 bg-gradient-to-b from-[#F5F5DC] to-[#FFF8E7] overflow-hidden relative">
      {/* Popup Modal */}
      {selectedTestimonial && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-lg p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              onClick={closePopup}
            >
              <X size={24} />
            </button>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-[#D4A574] text-[#D4A574] w-5 h-5" />
              ))}
            </div>
            <p className="text-[#6B5D52] mb-6 text-base leading-relaxed">
              &quot;{selectedTestimonial.review}&quot;
            </p>
            <div className="flex items-center gap-3 border-t border-[#F5DEB3] pt-4">
              <div className="w-14 h-14 rounded-full bg-[#D4A574] flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {selectedTestimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-[#3E2723] text-base">{selectedTestimonial.name}</h4>
                <p className="text-[#8B7355] text-sm">{selectedTestimonial.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#D4A574] rotate-45"></div>
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12">
        <div className="text-center">
          <p className="text-[#8B7355] mb-2 sm:mb-3 uppercase tracking-widest text-xs sm:text-sm font-medium">Client Reviews</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#3E2723] mb-4 sm:mb-6 px-4">What Our Clients Say</h2>
          <div className="w-12 sm:w-16 h-px bg-[#D4A574] mx-auto mb-4 sm:mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base text-[#6B5D52] max-w-2xl mx-auto font-light leading-relaxed px-4">
            We take pride in creating beautiful memories for our clients. Here&apos;s what they
            have to say about their experience with us.
          </p>
        </div>
      </div>

      {/* First Row - Left to Right */}
      <div className="relative mb-4 sm:mb-6 md:mb-8">
        <div 
          className="flex animate-marquee-left"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {allTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`left-${index}`} 
              testimonial={testimonial}
              onHover={setIsPaused}
              onClick={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative">
        <div 
          className="flex animate-marquee-right"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {allTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`right-${index}`} 
              testimonial={testimonial}
              onHover={setIsPaused}
              onClick={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 8s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 8s linear infinite;
        }

        .animate-popup {
          animation: popup 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}
