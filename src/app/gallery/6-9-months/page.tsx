import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/6-9-months.json';

export const metadata = {
  title: '6-9 Months Baby Photography Gallery - Mom and Kids',
  description: 'Adorable 6-9 months baby milestone photography. Capturing sitting up, first smiles and playful moments.',
  keywords: '6-9 months baby photography, baby milestone photos, sitting baby photoshoot, Pune baby photographer',
};

export default function SixToNineMonthsPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="6-9 Months Baby Gallery"
        description="Celebrating adorable milestones - sitting up, first giggles, and playful expressions"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
