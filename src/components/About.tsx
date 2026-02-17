'use client';

const photographers = [
  {
    name: 'Satish',
    role: 'Lead Photographer',
    specialization: 'Maternity & Newborn Specialist',
    description: 'With over a decade of experience, I specialize in capturing the beauty of motherhood and the innocence of newborns. My goal is to create timeless photographs that families will cherish forever.',
    image: '/hero-slider/satish.jpg',
  },
  {
    name: 'Rohini',
    role: 'Senior Photographer',
    specialization: 'Baby & Family Photography Expert',
    description: 'I believe every child has a unique personality that deserves to be captured. Specializing in baby milestones and family portraits, I create joyful memories that tell your family\'s story.',
    image: '/hero-slider/rohini.jpg',
  },
];

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 bg-gradient-to-b from-[#FFF8E7] to-[#F5F5DC] relative">
      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
          <div className="w-2 h-2 bg-[#C9A66B] rotate-45"></div>
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#3E2723] mb-4 sm:mb-6 px-4">About Us</h2>
          <div className="w-12 sm:w-16 h-px bg-[#D4A574] mx-auto mb-4 sm:mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base md:text-lg text-[#6B5D52] max-w-2xl mx-auto leading-relaxed font-light px-4">
            We are Satish and Rohini, passionate about capturing life&apos;s most precious moments with artistic vision and professional expertise.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-32">
          {photographers.map((photographer, index) => (
            <div key={index} className="group">
              <div 
                className="relative aspect-[3/4] mb-6 sm:mb-8 overflow-hidden bg-[#F5DEB3] border-4 sm:border-6 md:border-8 border-[#FFF8E7] shadow-xl hover:shadow-2xl transition-all duration-500"
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  src={photographer.image}
                  alt={photographer.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Invisible overlay */}
                <div className="absolute inset-0 z-10" />
              </div>
              
              <div className="space-y-3 sm:space-y-4 px-2 text-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-light text-[#3E2723] mb-1 sm:mb-2 tracking-wide">{photographer.name}</h3>
                  <p className="text-xs sm:text-sm text-[#8B7355] uppercase tracking-wider font-medium">
                    {photographer.role}
                  </p>
                </div>
                
                <p className="text-[#C9A66B] text-[10px] sm:text-xs uppercase tracking-widest mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-[#D4A574]/30 inline-block">
                  {photographer.specialization}
                </p>
                
                <p className="text-[#6B5D52] leading-relaxed font-light text-sm sm:text-base">
                  {photographer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
