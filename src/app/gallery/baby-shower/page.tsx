import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import babyShowerImages from '@/data/baby-shower.json';

export const metadata = {
  title: 'Baby Shower Photography Gallery - Mom and Kids',
  description: 'Beautiful baby shower event photography capturing joyful celebrations. Professional baby shower photoshoot in Pune.',
  keywords: 'baby shower photography, baby shower photos, baby shower event, Pune baby shower photographer',
};

export default function BabyShowerPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Baby Shower Gallery"
        description="Celebrating the joy of welcoming a new life"
        imageCount={babyShowerImages.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={babyShowerImages} />
      </div>
    </main>
  );
}
