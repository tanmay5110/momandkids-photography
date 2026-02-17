import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import birthdayImages from '@/data/birthday-events.json';

export const metadata = {
  title: 'Birthday Event Photography Gallery - Mom and Kids',
  description: 'Beautiful birthday event photography capturing special celebrations. Professional birthday photoshoot in Pune.',
  keywords: 'birthday photography, birthday event photos, kids birthday party, Pune birthday photographer',
};

export default function BirthdayEventsPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Birthday Events Gallery"
        description="Capturing the magic of birthday celebrations"
        imageCount={birthdayImages.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={birthdayImages} />
      </div>
    </main>
  );
}
