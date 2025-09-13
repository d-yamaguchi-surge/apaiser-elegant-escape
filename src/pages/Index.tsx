import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import StoreInfo from '@/components/StoreInfo';
import Reservation from '@/components/Reservation';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Menu />
        <StoreInfo />
        <Reservation />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
