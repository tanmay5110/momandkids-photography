import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-deversh.json';

export const metadata = {
  title: 'Deversh 5th Birthday Photography - Mom and Kids',
  description: 'Beautiful moments from Deversh 5th birthday celebration. Professional birthday event photography in Pune.',
  keywords: 'birthday photography, kids birthday, birthday event photos, Pune photographer',
};

export default function DevereshBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Deversh 5th Birthday"
        description="Celebrating five wonderful years with joy and colour"
        imageCount={images.length}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
