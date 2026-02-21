'use client';

export default function HeroContent() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#FFFAF0] to-[#FFF8E7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-[#3E2723] mb-4 sm:mb-6 leading-tight tracking-wide px-4 font-[family-name:var(--font-cormorant)] italic">
            Premium Baby & Maternity<br className="hidden sm:block" /><span className="sm:hidden"> </span>Photoshoot Studio
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#6B5D52] mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto font-light px-4">
            Capturing life&apos;s most precious moments with artistic vision and professional expertise. Specializing in maternity, newborn, and baby photography in Pune.
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
            <a
              href="tel:+919321130477"
              className="border-2 border-[#D4A574] bg-[#D4A574] text-white px-6 sm:px-8 py-2.5 sm:py-3 font-light hover:bg-white hover:text-[#3E2723] transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg"
            >
              +91 9321130477
            </a>
            <a
              href="#portfolio"
              className="bg-white text-[#3E2723] px-6 sm:px-8 py-2.5 sm:py-3 font-light border-2 border-[#D4A574] hover:bg-[#D4A574] hover:text-white transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
