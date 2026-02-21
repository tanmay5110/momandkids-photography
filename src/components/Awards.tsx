'use client';

import { Award, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const certifications = [
  {
    title: 'Certificate 1',
    image: '/certificate/IMG_20251202_203025_1 copy.jpg',
  },
  {
    title: 'Certificate 2',
    image: '/certificate/IMG_20251202_203206_1 copy.jpg',
  },
  {
    title: 'Certificate 3',
    image: '/certificate/IMG_20251202_203236_1 copy.jpg',
  },
  {
    title: 'Certificate 4',
    image: '/certificate/IMG_20251202_203330_1 copy.jpg',
  },
  {
    title: 'Certificate 5',
    image: '/certificate/IMG_20251202_203457_1 copy.jpg',
  },
  {
    title: 'Certificate 6',
    image: '/certificate/IMG_20251202_203546_1 copy.jpg',
  },
  {
    title: 'Certificate 7',
    image: '/certificate/IMG_20251202_203622_1 copy.jpg',
  },
  {
    title: 'Certificate 8',
    image: '/certificate/IMG_20251202_203703_1 copy.jpg',
  },
];

export default function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (selectedCert && !e.state?.certificatePopup) {
        setSelectedCert(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCert]);

  // Push history state when popup opens
  useEffect(() => {
    if (selectedCert && !window.history.state?.certificatePopup) {
      window.history.pushState({ certificatePopup: true }, '');
    }
  }, [selectedCert]);

  const closePopup = () => {
    if (window.history.state?.certificatePopup) {
      window.history.back();
    }
    setSelectedCert(null);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#FFF8E7] to-[#F5F5DC] relative overflow-hidden" ref={sectionRef}>
      {/* Popup Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closePopup}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[90vh] animate-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={closePopup}
            >
              <X size={32} />
            </button>
            <img
              src={selectedCert.image}
              alt={selectedCert.title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
            {/* Invisible overlay */}
            <div className="absolute inset-0 z-10 rounded-lg" />
          </div>
        </div>
      )}

      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
          <div className="w-2 h-2 bg-[#C9A66B] rotate-45"></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-[#8B7355] mb-2 uppercase tracking-widest text-xs font-medium">Excellence</p>
          <h2 className="text-2xl md:text-3xl font-light text-[#3E2723] mb-3 font-[family-name:var(--font-cormorant)] italic">Professionally Certified</h2>
          <div className="w-12 h-px bg-[#D4A574] mx-auto mb-3"></div>
          <div className="flex items-center justify-center gap-2 text-sm font-light text-[#3E2723]">
            <Award className="text-[#D4A574]" size={16} />
            <span className="tracking-wider">8 Industry Certifications</span>
          </div>
        </div>

        {/* Fast auto-scrolling carousel - same for mobile and desktop */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#FFF8E7] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#F5F5DC] to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling container */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-4 animate-scroll-fast"
              style={{
                width: 'max-content',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* Double the certificates for seamless loop */}
              {[...certifications, ...certifications].map((cert, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-48 md:h-64 bg-white rounded-lg overflow-hidden border border-[#E8DCC8] shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onClick={() => setSelectedCert(cert)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                    draggable={false}
                  />
                  {/* Invisible overlay */}
                  <div className="absolute inset-0 z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation for carousel */}
      <style jsx>{`
        @keyframes scroll-fast {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
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
        .animate-scroll-fast {
          animation: scroll-fast 8s linear infinite;
        }
        .animate-popup {
          animation: popup 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}
