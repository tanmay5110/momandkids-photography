import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HeroContent from '@/components/HeroContent';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Awards from '@/components/Awards';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSlider />
      <HeroContent />
      <About />
      <Portfolio />
      <Awards />
      <Testimonials />
      <Footer />
    </div>
  );
}
