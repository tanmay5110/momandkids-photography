'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import GalleryHeader from '@/components/GalleryHeader';
import charvisImages from '@/data/birthday-charvis.json';
import devereshImages from '@/data/birthday-deversh.json';
import khushiImages from '@/data/birthday-khushi.json';
import namingImages from '@/data/birthday-naming.json';
import ridhimaImages from '@/data/birthday-ridhima.json';

// export const metadata = {
//   title: 'Birthday Event Photography Gallery - Mom and Kids',
//   description: 'Beautiful birthday event photography capturing special celebrations. Professional birthday photoshoot in Pune.',
//   keywords: 'birthday photography, birthday event photos, kids birthday party, Pune birthday photographer',
// };

const events = [
  {
    title: 'Charvis Birthday',
    description: 'A joyful birthday celebration',
    coverImage: charvisImages[0] || 'birthday-events/charvis-birthday/SVP00008CB',
    imageCount: charvisImages.length,
    link: '/gallery/birthday-events/charvis',
  },
  {
    title: 'Deversh 5th Birthday',
    description: 'Five wonderful years celebrated',
    coverImage: devereshImages[0] || 'birthday-events/deversh-birthday/SVP00001db',
    imageCount: devereshImages.length,
    link: '/gallery/birthday-events/deversh',
  },
  {
    title: 'Khushi Birthday',
    description: 'Pure happiness, perfectly captured',
    coverImage: khushiImages[0] || 'birthday-events/khushi-birthday/IMG_0002sp',
    imageCount: khushiImages.length,
    link: '/gallery/birthday-events/khushi',
  },
  {
    title: 'Naming Ceremony',
    description: 'A blessed new beginning',
    coverImage: namingImages[0] || 'birthday-events/naming-ceremony/SVP00020NK',
    imageCount: namingImages.length,
    link: '/gallery/birthday-events/naming-ceremony',
  },
  {
    title: 'Ridhima Birthday',
    description: 'A beautiful birthday story',
    coverImage: ridhimaImages[0] || 'birthday-events/ridhima-birthday/SVP00001',
    imageCount: ridhimaImages.length,
    link: '/gallery/birthday-events/ridhima',
  },
];

const totalImages =
  charvisImages.length + devereshImages.length + khushiImages.length +
  namingImages.length + ridhimaImages.length;

export default function BirthdayEventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Birthday Events"
        description="Every birthday tells a unique story — browse our featured celebrations and relive the magic."
        imageCount={totalImages}
        coverImage={charvisImages[0]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <p className="text-[#8B7355] uppercase tracking-[0.25em] text-xs font-medium mb-3 font-sans">Select an Event</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#3E2723] mb-4 font-[family-name:var(--font-cormorant)] italic">Our Birthday Shoots</h2>
          <div className="w-16 h-px bg-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#6B5744] max-w-xl mx-auto text-sm leading-relaxed">
            Each birthday is a unique story. Browse our featured events and click to view the full gallery.
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Link
              key={event.link}
              href={event.link}
              className="group block"
            >
              <div
                className="relative overflow-hidden aspect-[4/3] bg-[#F5DEB3]"
                onContextMenu={(e) => e.preventDefault()}
              >
                {event.coverImage ? (
                  <CldImage
                    src={event.coverImage}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={event.title}
                    crop="fill"
                    quality="auto"
                    format="auto"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFF8E7]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Title overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-[family-name:var(--font-cormorant)] font-semibold tracking-wide">
                    {event.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-1 font-light">
                    {event.imageCount} photos
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
