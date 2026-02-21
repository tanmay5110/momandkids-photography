import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/cake-smash.json';

export const metadata = {
  title: 'Cake Smash Photography Gallery - Mom and Kids',
  description: 'Fun and messy cake smash photoshoot sessions. Capturing the joy of first birthday celebrations.',
  keywords: 'cake smash photography, first birthday photoshoot, cake smash photos, Pune cake smash photographer',
};

export default function CakeSmashPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Cake Smash"
        description="Sweet, messy, and absolutely adorable — the most fun a first birthday can be, beautifully captured in every frosting-covered smile."
        imageCount={images.length}
        coverImage={images[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
