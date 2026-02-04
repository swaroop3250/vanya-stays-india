import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { amenityIcons } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import type { Resort, Review } from '@/types';
import {
  Star,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Check,
  Wifi,
  Car,
  Coffee
} from 'lucide-react';

const ResortDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Resort['roomTypes'][number] | undefined>(undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [resort, setResort] = useState<Resort | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadResort = async () => {
      if (!id) return;
      try {
        const [resortResponse, reviewsResponse] = await Promise.all([
          api.hotels.getById(id),
          api.hotels.reviews(id),
        ]);
        if (isMounted) {
          setResort(resortResponse);
          setSelectedRoom(resortResponse.roomTypes[0]);
          setReviews(reviewsResponse);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResort();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading resort details...
      </div>
    );
  }

  if (!resort) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Resort not found</h1>
          <Link to="/resorts">
            <Button className="rounded-full">Browse Resorts</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 1;
  const maxGuestsPerRoom = selectedRoom?.maxGuests || 2;
  const requiredRooms = Math.ceil(guests / maxGuestsPerRoom);
  const effectiveRooms = Math.max(rooms, requiredRooms);
  const subtotal = (selectedRoom?.price || resort.pricePerNight) * nights * effectiveRooms;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % resort.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + resort.images.length) % resort.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Image Gallery */}
      <div className="relative h-[50vh] lg:h-[60vh] mt-20">
        <img
          src={resort.images[currentImageIndex]}
          alt={resort.name}
          onError={(event) => {
            event.currentTarget.src = "/images/hotels/boutique.svg";
          }}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
          {currentImageIndex + 1} / {resort.images.length}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Heart className={cn('w-5 h-5', isWishlisted && 'fill-red-500 text-red-500')} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {resort.badges.map((badge) => (
                  <span key={badge} className="badge-emerald">
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {resort.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{resort.location.city}, {resort.location.state} - {resort.location.pincode}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{resort.rating}</span>
                  <span>({resort.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold mb-4 section-heading">Overview</h2>
              <p className="text-muted-foreground leading-relaxed mt-6">{resort.description}</p>
            </div>

            {/* Highlights */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold mb-4 section-heading">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {resort.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold mb-4 section-heading">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {resort.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50"
                  >
                    <span className="text-xl">{amenityIcons[amenity] || '✨'}</span>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold mb-4 section-heading">Room Types</h2>
              <div className="space-y-4 mt-6">
                {resort.roomTypes.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={cn(
                      'flex flex-col md:flex-row gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
                      selectedRoom?.id === room.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-secondary/30 hover:bg-secondary/50'
                    )}
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      onError={(event) => {
                        event.currentTarget.src = "/images/rooms/room.svg";
                      }}
                      className="w-full md:w-40 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {room.bedType} Bed
                        </span>
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          Max {room.maxGuests} guests
                        </span>
                        {room.amenities.map((a) => (
                          <span key={a} className="text-xs px-2 py-1 bg-secondary rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                      <div className="price-tag">{formatPrice(room.price)}<span className="text-sm text-muted-foreground font-normal ml-1">/ night</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-4 section-heading">Guest Reviews</h2>
              <div className="space-y-6 mt-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-2xl bg-secondary/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.userName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{review.tripType}</span>
                          <span>•</span>
                          <span>{format(new Date(review.date), 'MMM yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:w-96">
            <div className="sticky top-24 glass-card rounded-3xl p-6">
              {/* Price Header */}
              <div className="mb-6">
                <div className="price-tag text-3xl mb-1">
                  {formatPrice(selectedRoom?.price || resort.pricePerNight)}
                </div>
                <span className="text-muted-foreground">per night</span>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal rounded-xl h-14',
                        !checkIn && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase text-muted-foreground">Check in</span>
                        <span className="text-sm">{checkIn ? format(checkIn, 'dd MMM') : 'Add date'}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal rounded-xl h-14',
                        !checkOut && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase text-muted-foreground">Check out</span>
                        <span className="text-sm">{checkOut ? format(checkOut, 'dd MMM') : 'Add date'}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => date < (checkIn || new Date())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="flex items-center justify-between p-4 border rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>Guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests(Math.min(10, guests + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {formatPrice(selectedRoom?.price || resort.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''} × {effectiveRooms} room{effectiveRooms > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="price-tag">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Book Button */}
              <Button className="w-full h-14 rounded-2xl btn-gradient text-lg font-semibold">
                Reserve Now
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResortDetail;
