import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationsGrid from '@/components/DestinationsGrid';
import { api } from '@/services/api';
import type { Destination } from '@/types';

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDestinations = async () => {
      try {
        const response = await api.destinations.list();
        if (isMounted) {
          setDestinations(response);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load destinations. Please try again.');
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
        {error && (
          <div className="container mx-auto px-4 lg:px-8 mb-6 text-sm text-red-600">
            {error}
          </div>
        )}
        <DestinationsGrid destinations={destinations} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
