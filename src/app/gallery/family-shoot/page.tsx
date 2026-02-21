import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/family-shoot.json';

export const metadata = {
  title: 'Family Photography Gallery - Mom and Kids',
  description: 'Beautiful family photoshoots capturing precious moments together. Professional family photography in Pune.',
  keywords: 'family photography, family photoshoot, family portraits, Pune family photographer, mom and kids photography',
};

export default function FamilyShootPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Family"
        description="The love, the laughter, the togetherness — family portraits that become treasured heirlooms for generations."
        imageCount={images.length}
        coverImage={images[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
