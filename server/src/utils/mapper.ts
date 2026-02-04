import { resolveImageUrl } from "./media";

const normalizePropertyType = (value: string) => value.replace("_", "-");

const parseArray = (value: unknown) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const mapHotel = (hotel: any) => ({
  id: hotel.id,
  name: hotel.name,
  location: {
    city: hotel.city,
    state: hotel.state,
    pincode: hotel.pincode,
  },
  images: parseArray(hotel.images).map(resolveImageUrl),
  pricePerNight: hotel.pricePerNight,
  rating: hotel.rating,
  reviewCount: hotel.reviewCount,
  amenities: parseArray(hotel.amenities),
  propertyType: normalizePropertyType(String(hotel.propertyType)),
  badges: parseArray(hotel.badges),
  description: hotel.description,
  highlights: parseArray(hotel.highlights),
  roomTypes: (hotel.roomTypes || []).map((room: any) => ({
    id: room.id,
    name: room.name,
    price: room.price,
    maxGuests: room.maxGuests,
    bedType: room.bedType,
    amenities: parseArray(room.amenities),
    image: resolveImageUrl(room.imageUrl),
  })),
});
