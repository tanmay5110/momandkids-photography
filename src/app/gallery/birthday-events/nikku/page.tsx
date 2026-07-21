import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-nikku.json';

export const metadata = {
  title: 'Nikku Daughter 1st Birthday Photography - Mom and Kids',
  description: 'Beautiful moments from Nikku daughter 1st birthday celebration. Professional birthday event photography in Pune.',
  keywords: 'birthday photography, kids birthday, birthday event photos, Pune photographer',
};

export default function NikkuBirthdayPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Nikku Daughter 1st Birthday"
        description="A joyful first birthday celebration captured in full color and emotion."
        imageCount={images.length}
        coverImage={images[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
