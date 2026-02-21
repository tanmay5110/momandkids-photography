import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import KidsAbove2Tabs from '@/components/KidsAbove2Tabs';
import indoorImages from '@/data/kids-above-2-indoor.json';
import outdoorImages from '@/data/kids-above-2-outdoor.json';

export const metadata = {
  title: 'Kids Above 2 Years Photography Gallery - Mom and Kids',
  description: 'Beautiful indoor and outdoor photography for kids above 2 years. Professional kids photoshoot in Pune.',
  keywords: 'kids photography, children photoshoot, indoor kids photos, outdoor kids photos, Pune kids photographer',
};

export default function KidsAbove2Page() {
  const totalImages = indoorImages.length + outdoorImages.length;
  
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Kids Above 2 Years"
        description="Energy, curiosity, and endless personality — indoor studio and outdoor sessions that capture your child's unique spirit."
        imageCount={totalImages}
        coverImage={indoorImages[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <KidsAbove2Tabs 
          indoorImages={indoorImages}
          outdoorImages={outdoorImages}
        />
      </div>
    </main>
  );
}
