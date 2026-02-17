'use client';

import GalleryHeader from '@/components/GalleryHeader';
import Footer from '@/components/Footer';
import CloudinaryGallery from '@/components/CloudinaryGallery';

interface MaternityGalleryProps {
  images: string[];
}

export default function MaternityGallery({ images }: MaternityGalleryProps) {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <GalleryHeader />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#FFFAF0] to-[#FFF8E7]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-[#3E2723] mb-4">
            Maternity Photography
          </h1>
          <div className="w-16 h-px bg-[#D4A574] mx-auto mb-6"></div>
          <p className="text-lg text-[#6B5D52] max-w-2xl mx-auto">
            Celebrating the beautiful journey of motherhood with timeless elegance.
          </p>
          <p className="mt-4 text-sm text-[#8B7355]">{images.length} Photos</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <CloudinaryGallery ids={images} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
