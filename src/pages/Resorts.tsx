import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResortCard from '@/components/ResortCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SlidersHorizontal, 
  X, 
  Star,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import type { Resort } from '@/types';

const amenitiesList = ['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Beach Access', 'Mountain View', 'Pet Friendly'];
const propertyTypes = ['Beach Resort', 'Heritage', 'Villa', 'Boutique', 'Mountain Retreat'];
// Map UI labels to Resort.propertyType values
const propertyTypeToSlug: Record<string, string> = {
  'Beach Resort': 'beach-resort',
  'Heritage': 'heritage',
  'Villa': 'villa',
  'Boutique': 'boutique',
  'Mountain Retreat': 'mountain-retreat',
};

const Resorts = () => {
  const [searchParams] = useSearchParams();
  const locationFilter = searchParams.get('location') || '';
  
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadResorts = async () => {
      try {
        const response = await api.hotels.list();
        if (isMounted) {
          setResorts(response);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load resorts. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResorts();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 30000]);
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setMinRating(null);
  };

  // Filter resorts
  let filteredResorts = resorts.filter(resort => {
    if (locationFilter && !resort.location.city.toLowerCase().includes(locationFilter.toLowerCase()) &&
        !resort.location.state.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    if (resort.pricePerNight < priceRange[0] || resort.pricePerNight > priceRange[1]) {
      return false;
    }
    if (minRating && resort.rating < minRating) {
      return false;
    }
    if (selectedAmenities.length > 0 && !selectedAmenities.some(a => resort.amenities.includes(a))) {
      return false;
    }
    if (selectedPropertyTypes.length > 0) {
      const resortSlug = resort.propertyType;
      const selectedSlugs = selectedPropertyTypes.map(t => propertyTypeToSlug[t]).filter(Boolean);
      if (selectedSlugs.length > 0 && !selectedSlugs.includes(resortSlug)) {
        return false;
      }
    }
    return true;
  });

  // Sort resorts
  if (sortBy === 'price-low') {
    filteredResorts = [...filteredResorts].sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortBy === 'price-high') {
    filteredResorts = [...filteredResorts].sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortBy === 'rating') {
    filteredResorts = [...filteredResorts].sort((a, b) => b.rating - a.rating);
  }

  const activeFilterCount = (selectedAmenities.length > 0 ? 1 : 0) +
    (selectedPropertyTypes.length > 0 ? 1 : 0) +
    (minRating ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 30000 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={30000}
          step={500}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold mb-4">Minimum Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[3, 3.5, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? 'default' : 'outline'}
              size="sm"
              className="rounded-full gap-1"
              onClick={() => setMinRating(minRating === rating ? null : rating)}
            >
              <Star className="w-3 h-3 fill-current" />
              {rating}+
            </Button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold mb-4">Amenities</h4>
        <div className="space-y-3">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold mb-4">Property Type</h4>
        <div className="space-y-3">
          {propertyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedPropertyTypes.includes(type)}
                onCheckedChange={() => togglePropertyType(type)}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {locationFilter ? `Resorts in ${locationFilter}` : 'Explore Resorts'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredResorts.length} properties found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-20">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="badge-emerald">{activeFilterCount}</span>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-full gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="badge-emerald text-[10px] px-2 py-0.5">{activeFilterCount}</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden lg:block" />

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 rounded-full">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden md:flex items-center border rounded-full p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {priceRange[0] > 0 || priceRange[1] < 30000 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    <button onClick={() => setPriceRange([0, 30000])}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null}
                {minRating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                    {minRating}+ Stars
                    <button onClick={() => setMinRating(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedAmenities.map(amenity => (
                  <span key={amenity} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                    {amenity}
                    <button onClick={() => toggleAmenity(amenity)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {error && (
              <div className="mb-6 text-sm text-red-600">{error}</div>
            )}
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground">Loading resorts...</div>
            ) : filteredResorts.length > 0 ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {filteredResorts.map((resort, index) => (
                  <div
                    key={resort.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ResortCard resort={resort} featured={viewMode === 'list'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏝️</div>
                <h3 className="font-display text-xl font-semibold mb-2">No resorts found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to find more options</p>
                <Button onClick={clearFilters} className="rounded-full">
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Resorts;
