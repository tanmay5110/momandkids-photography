import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-charvis.json';

export const metadata = {
  title: 'Charvis Birthday Photography - Mom and Kids',
  description: 'Beautiful moments from Charvis birthday celebration. Professional birthday event photography in Pune.',
  keywords: 'birthday photography, kids birthday, birthday event photos, Pune photographer',
};

export default function CharvisBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Charvis Birthday"
        description="A magical birthday celebration captured frame by frame"
        imageCount={images.length}
        coverImage={images[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
