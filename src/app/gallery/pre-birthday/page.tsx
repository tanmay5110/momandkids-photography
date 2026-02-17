import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/pre-birthday.json';

export const metadata = {
  title: 'Pre-Birthday Photography Gallery - Mom and Kids',
  description: 'Pre-birthday photoshoot for 1-2 year old toddlers. Capturing the joy before their special day.',
  keywords: 'pre-birthday photography, toddler photoshoot, 1-2 year baby photos, Pune birthday photographer',
};

export default function PreBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Pre-Birthday Gallery"
        description="Magical moments before their big day - celebrating 1-2 years of pure joy"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
