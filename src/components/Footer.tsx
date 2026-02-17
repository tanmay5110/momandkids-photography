'use client';

import { Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#3E2723] to-[#2C1810] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-light mb-3 sm:mb-4 tracking-wide text-[#F5DEB3]">Mom & Kids Photography</h3>
            <p className="text-[#C9A66B] mb-4 sm:mb-6 leading-relaxed font-light text-xs sm:text-sm">
              Professional maternity, newborn, and baby photography studio in Pune. Capturing
              your precious moments with artistic vision and care.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-[#D4A574]/30 flex items-center justify-center hover:bg-[#D4A574] hover:border-[#D4A574] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-[#D4A574]/30 flex items-center justify-center hover:bg-[#D4A574] hover:border-[#D4A574] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="text-base sm:text-lg font-light mb-3 sm:mb-4 tracking-wide text-[#F5DEB3]">Get In Touch</h4>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <a
                href="tel:+919321130477"
                className="flex items-center gap-2 sm:gap-3 text-[#C9A66B] hover:text-[#F5DEB3] transition-colors font-light"
              >
                <Phone size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>+91 9321130477</span>
              </a>
              <a
                href="mailto:momandkidsphotography@gmail.com"
                className="flex items-center gap-2 sm:gap-3 text-[#C9A66B] hover:text-[#F5DEB3] transition-colors font-light break-all"
              >
                <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>momandkidsphotography@gmail.com</span>
              </a>
              <div className="flex items-start gap-2 sm:gap-3 text-[#C9A66B] hover:text-[#F5DEB3] font-light">
                <MapPin size={14} className="mt-0.5 sm:mt-1 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-[#C9A66B] hover:text-[#F5DEB3] font-light">
                <Clock size={14} className="mt-0.5 sm:mt-1 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Appointment Basis</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-light mb-3 sm:mb-4 tracking-wide text-[#F5DEB3]">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {['Home', 'About Us', 'Portfolio', 'Testimonials', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-[#C9A66B] hover:text-[#F5DEB3] transition-colors font-light"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Us */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-light mb-3 sm:mb-4 tracking-wide text-[#F5DEB3]">Find Us</h4>
            <div className="bg-[#2C1810] overflow-hidden h-40 sm:h-48 border-2 border-[#D4A574]/20">
              {/* Map placeholder */}
              <div className="w-full h-full flex items-center justify-center text-[#8B7355]">
                <MapPin size={32} className="sm:w-12 sm:h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D4A574]/20 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[#8B7355] text-[10px] sm:text-xs font-light text-center sm:text-left">
          <p className="px-4 sm:px-0">Made with love for capturing beautiful moments</p>
          <p className="px-4 sm:px-0">© 2025 Mom & Kids Photography. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
