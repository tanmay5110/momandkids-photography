import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import maternityImages from '@/data/maternity.json';

export const metadata = {
  title: 'Maternity Photography Gallery - Mom and Kids',
  description: 'Beautiful maternity photography capturing the glow and joy of pregnancy. Professional maternity photoshoot in Pune.',
  keywords: 'maternity photography, pregnancy photoshoot, maternity photos, Pune maternity photographer',
};

export default function MaternityPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Maternity"
        description="Celebrating the radiant glow, strength, and beauty of your journey into motherhood. Every moment is precious."
        imageCount={maternityImages.length}
        coverImage={maternityImages[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={maternityImages} />
      </div>
    </main>
  );
}
