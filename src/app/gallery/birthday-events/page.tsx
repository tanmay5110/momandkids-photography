import GalleryHeader from '@/components/GalleryHeader';
import BirthdayEventsTabs from '@/components/BirthdayEventsTabs';
import charvisImages from '@/data/birthday-charvis.json';
import devereshImages from '@/data/birthday-deversh.json';
import khushiImages from '@/data/birthday-khushi.json';
import nikkuImages from '@/data/birthday-nikku.json';
import namingImages from '@/data/birthday-naming.json';
import ridhimaImages from '@/data/birthday-ridhima.json';
import specialShootImages from '@/data/special-shoot.json';

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
  {
    title: 'Nikku Daughter 1st Birthday',
    description: 'A special first birthday celebration',
    coverImage: nikkuImages[0] || 'birthday-events/nikku-daughter-1st-birthday/1',
    imageCount: nikkuImages.length,
    link: '/gallery/birthday-events/nikku',
  },
];

const totalImages =
  charvisImages.length + devereshImages.length + khushiImages.length +
  namingImages.length + ridhimaImages.length + nikkuImages.length;

export default function BirthdayEventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Birthday Events"
        description="Every birthday tells a unique story — browse our featured celebrations and special moments."
        imageCount={totalImages}
        coverImage={charvisImages[0]}
      />

      <div className="container mx-auto px-4 py-12">
        <BirthdayEventsTabs
          birthdayEvents={events}
          specialShootImages={specialShootImages}
        />
      </div>
    </main>
  );
}
