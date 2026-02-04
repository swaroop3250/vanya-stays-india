import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DestinationsGrid from '@/components/DestinationsGrid';
import TrendingStays from '@/components/TrendingStays';
import WhyVanyaStays from '@/components/WhyVanyaStays';
import Footer from '@/components/Footer';
import { api } from '@/services/api';
import type { Destination, Resort } from '@/types';

const Index = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [destinationsResponse, hotelsResponse] = await Promise.all([
          api.destinations.list(),
          api.hotels.list(),
        ]);
        if (isMounted) {
          setDestinations(destinationsResponse);
          setResorts(hotelsResponse);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DestinationsGrid destinations={destinations} isLoading={isLoading} />
      <TrendingStays resorts={resorts} isLoading={isLoading} />
      <WhyVanyaStays />
      <Footer />
    </div>
  );
};

export default Index;
