import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import GalleryHeader from '@/components/GalleryHeader';
import charvisImages from '@/data/birthday-charvis.json';
import devereshImages from '@/data/birthday-deversh.json';
import khushiImages from '@/data/birthday-khushi.json';
import namingImages from '@/data/birthday-naming.json';
import ridhimaImages from '@/data/birthday-ridhima.json';

export const metadata = {
  title: 'Birthday Event Photography Gallery - Mom and Kids',
  description: 'Beautiful birthday event photography capturing special celebrations. Professional birthday photoshoot in Pune.',
  keywords: 'birthday photography, birthday event photos, kids birthday party, Pune birthday photographer',
};

const events = [
  {
    title: 'Charvis Birthday',
    description: 'A joyful birthday celebration',
    coverImage: charvisImages[0] || 'birthday-events/charvis-birthday/SVP00008CB',
    imageCount: charvisImages.length,
    link: '/gallery/birthday-events/charvis',
    emoji: '🎂',
  },
  {
    title: 'Deversh 5th Birthday',
    description: 'Five wonderful years celebrated',
    coverImage: devereshImages[0] || 'birthday-events/deversh-birthday/SVP00001db',
    imageCount: devereshImages.length,
    link: '/gallery/birthday-events/deversh',
    emoji: '🎉',
  },
  {
    title: 'Khushi Birthday',
    description: 'Pure happiness, perfectly captured',
    coverImage: khushiImages[0] || 'birthday-events/khushi-birthday/IMG_0002sp',
    imageCount: khushiImages.length,
    link: '/gallery/birthday-events/khushi',
    emoji: '🎈',
  },
  {
    title: 'Naming Ceremony',
    description: 'A blessed new beginning',
    coverImage: namingImages[0] || 'birthday-events/naming-ceremony/SVP00020NK',
    imageCount: namingImages.length,
    link: '/gallery/birthday-events/naming-ceremony',
    emoji: '🌸',
  },
  {
    title: 'Ridhima Birthday',
    description: 'A beautiful birthday story',
    coverImage: ridhimaImages[0] || 'birthday-events/ridhima-birthday/SVP00001',
    imageCount: ridhimaImages.length,
    link: '/gallery/birthday-events/ridhima',
    emoji: '✨',
  },
];

const totalImages =
  charvisImages.length + devereshImages.length + khushiImages.length +
  namingImages.length + ridhimaImages.length;

export default function BirthdayEventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Birthday Events Gallery"
        description="Capturing the magic of every birthday celebration"
        imageCount={totalImages}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <p className="text-[#8B7355] uppercase tracking-widest text-sm font-medium mb-3">Select an Event</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#3E2723] mb-4">Our Birthday Shoots</h2>
          <div className="w-16 h-px bg-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#6B5744] max-w-xl mx-auto text-sm leading-relaxed">
            Each birthday is a unique story. Browse our featured events and click to view the full gallery.
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Link
              key={event.link}
              href={event.link}
              className="group block"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#F5DEB3] border-2 border-[#E8D5B7]">
                {/* Cover Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {event.coverImage ? (
                    <CldImage
                      src={event.coverImage}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={event.title}
                      crop="fill"
                      quality="auto"
                      format="auto"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-[#FFF8E7]">
                      {event.emoji}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/60 via-transparent to-transparent transition-all duration-500 group-hover:from-[#D4A574]/40" />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {event.imageCount} photos
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{event.emoji}</span>
                    <h3 className="text-[#3E2723] font-semibold text-base">{event.title}</h3>
                  </div>
                  <p className="text-[#8B7355] text-xs mb-3">{event.description}</p>
                  <span className="text-[#D4A574] text-xs font-medium uppercase tracking-wider">
                    View Gallery →
                  </span>
                </div>

                <div className="absolute inset-0 border-2 border-[#D4A574] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
