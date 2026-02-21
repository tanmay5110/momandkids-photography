import CloudinaryGallery from '@/components/CloudinaryGallery';
import GalleryHeader from '@/components/GalleryHeader';
import images from '@/data/birthday-naming.json';

export const metadata = {
  title: 'Naming Ceremony Photography - Mom and Kids',
  description: 'Beautiful moments from a naming ceremony celebration. Professional event photography in Pune.',
  keywords: 'naming ceremony photography, event photos, Pune photographer, baby naming ceremony',
};

export default function NamingCeremonyPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryHeader
        title="Naming Ceremony"
        description="A blessed beginning, beautifully preserved"
        imageCount={images.length}
        coverImage={images[0]}
      />
      <div className="container mx-auto px-4 py-12">
        <CloudinaryGallery ids={images} />
      </div>
    </main>
  );
}
