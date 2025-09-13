import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import News from '@/components/News';
import BusinessCalendar from '@/components/BusinessCalendar';
import Menu from '@/components/Menu';
import StoreInfo from '@/components/StoreInfo';
import ReservationCalendar from '@/components/ReservationCalendar';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <News />
        <BusinessCalendar />
        <Menu />
        <StoreInfo />
        <ReservationCalendar />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
