import ResortCard from './ResortCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Resort } from '@/types';

interface TrendingStaysProps {
  resorts: Resort[];
  isLoading?: boolean;
}

const TrendingStays = ({ resorts, isLoading = false }: TrendingStaysProps) => {
  const trendingResorts = resorts.slice(0, 4);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4 section-heading">
              Trending Stays
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mt-6">
              Handpicked resorts loved by travelers across India
            </p>
          </div>
          <Link to="/resorts" className="mt-6 md:mt-0">
            <Button variant="outline" className="rounded-full gap-2 group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Resort Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && (
            <div className="col-span-full text-center text-muted-foreground">
              Loading stays...
            </div>
          )}
          {!isLoading && trendingResorts.map((resort, index) => (
            <div
              key={resort.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ResortCard resort={resort} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingStays;
