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
        title="Maternity Gallery"
        description="Celebrating the beauty and joy of motherhood"
        imageCount={maternityImages.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={maternityImages} />
      </div>
    </main>
  );
}
