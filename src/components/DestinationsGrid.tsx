import { Link } from 'react-router-dom';
import type { Destination } from '@/types';

interface DestinationsGridProps {
  destinations: Destination[];
  isLoading?: boolean;
}

const DestinationsGrid = ({ destinations, isLoading = false }: DestinationsGridProps) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4 section-heading mx-auto">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">
            Discover India's most beloved getaways, from serene beaches to majestic mountains
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 auto-rows-[200px] lg:auto-rows-[240px]">
          {isLoading && (
            <div className="col-span-full text-center text-muted-foreground">
              Loading destinations...
            </div>
          )}
          {!isLoading && destinations.slice(0, 8).map((destination, index) => {
            // Determine grid span based on index for visual interest
            const isLarge = index === 0 || index === 3;
            const isTall = index === 1 || index === 6;
            
            return (
              <Link
                key={destination.id}
                to={`/resorts?location=${destination.name}`}
                className={`bento-item group ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                } ${isTall ? 'row-span-2' : ''}`}
              >
                {/* Background Image */}
                <img
                  src={destination.image}
                  alt={destination.name}
                  onError={(event) => {
                    event.currentTarget.src = "/images/destinations/munnar.svg";
                  }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 p-4 lg:p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                    <span className="badge-gold text-xs mb-2 inline-block">
                      {destination.resortCount} Stays
                    </span>
                    <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {destination.tagline}
                    </p>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/30 to-transparent" />
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
          >
            Explore all destinations
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
