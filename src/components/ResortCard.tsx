import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Resort } from '@/types';
import { cn } from '@/lib/utils';

interface ResortCardProps {
  resort: Resort;
  featured?: boolean;
}

const ResortCard = ({ resort, featured = false }: ResortCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(resort.isWishlisted || false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      to={`/resort/${resort.id}`}
      className={cn(
        'resort-card group block',
        featured && 'md:flex md:flex-row'
      )}
    >
      {/* Image Section */}
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'md:w-2/5 h-64 md:h-auto' : 'h-56'
      )}>
        {/* Image Carousel */}
        <div className="relative h-full">
          <img
            src={resort.images[currentImageIndex]}
            alt={resort.name}
            onError={(event) => {
              event.currentTarget.src = "/images/hotels/boutique.svg";
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Image Navigation Dots */}
          {resort.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {resort.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(idx);
                  }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all',
                    idx === currentImageIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/80'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            )}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {resort.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="badge-emerald text-[10px] uppercase tracking-wide"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        'p-5',
        featured && 'md:flex-1 md:p-6 md:flex md:flex-col md:justify-between'
      )}>
        {/* Location & Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{resort.location.city}, {resort.location.state}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm">{resort.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({resort.reviewCount})
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {resort.name}
        </h3>

        {/* Description (featured only) */}
        {featured && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {resort.description}
          </p>
        )}

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resort.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
          {resort.amenities.length > 4 && (
            <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
              +{resort.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="price-tag">{formatPrice(resort.pricePerNight)}</span>
            <span className="text-muted-foreground text-sm ml-1">/ night</span>
          </div>
          <span className="text-xs text-muted-foreground">
            + taxes & fees
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ResortCard;
