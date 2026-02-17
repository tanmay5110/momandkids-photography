import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/newborn.json';

export const metadata = {
  title: 'Newborn Photography Gallery - Mom and Kids',
  description: 'Beautiful newborn photography capturing the precious first days of life. Professional newborn photoshoot in Pune.',
  keywords: 'newborn photography, baby photoshoot, newborn photos, Pune newborn photographer',
};

export default function NewbornPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader 
        title="Newborn Gallery"
        description="Capturing the precious first moments of your little one's life"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
