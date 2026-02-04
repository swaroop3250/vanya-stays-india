import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationsGrid from '@/components/DestinationsGrid';
import { api } from '@/services/api';
import type { Destination } from '@/types';

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDestinations = async () => {
      try {
        const response = await api.destinations.list();
        if (isMounted) {
          setDestinations(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDestinations();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <DestinationsGrid destinations={destinations} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
