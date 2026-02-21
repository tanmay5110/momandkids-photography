import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-ridhima.json';

export const metadata = {
  title: 'Ridhima Birthday Photography - Mom and Kids',
  description: 'Beautiful moments from Ridhima birthday celebration. Professional birthday event photography in Pune.',
  keywords: 'birthday photography, kids birthday, birthday event photos, Pune photographer',
};

export default function RidhimaBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Ridhima Birthday"
        description="A beautiful birthday story told through our lens"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
