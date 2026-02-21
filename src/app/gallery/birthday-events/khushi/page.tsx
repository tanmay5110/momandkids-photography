import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-khushi.json';

export const metadata = {
  title: 'Khushi Birthday Photography - Mom and Kids',
  description: 'Beautiful moments from Khushi birthday celebration. Professional birthday event photography in Pune.',
  keywords: 'birthday photography, kids birthday, birthday event photos, Pune photographer',
};

export default function KhushiBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Khushi Birthday"
        description="Pure joy and happiness, captured forever"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
