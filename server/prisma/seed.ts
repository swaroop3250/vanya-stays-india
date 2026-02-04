import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const destinationData = [
  {
    name: "Goa",
    state: "Goa",
    tagline: "Beaches & Nightlife",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
  },
  {
    name: "Manali",
    state: "Himachal Pradesh",
    tagline: "Mountain Magic",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "Royal Heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    tagline: "City of Lakes",
    image: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=1200&q=80",
  },
  {
    name: "Munnar",
    state: "Kerala",
    tagline: "Tea Gardens Paradise",
    image: "https://wallpaperaccess.com/full/2754528.jpg",
  },
  {
    name: "Ooty",
    state: "Tamil Nadu",
    tagline: "Queen of Hills",
    image: "https://wallpaperaccess.com/full/2851942.jpg",
  },
  {
    name: "Coorg",
    state: "Karnataka",
    tagline: "Scotland of India",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
  },
  {
    name: "Pondicherry",
    state: "Puducherry",
    tagline: "French Riviera",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "Himalayan Heritage",
    image: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?w=1200&q=80",
  },
  {
    name: "Rishikesh",
    state: "Uttarakhand",
    tagline: "Yoga by the Ganges",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  },
];

const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
];

const roomImage = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80";

const amenitiesPool = ["Pool", "Spa", "Restaurant", "WiFi", "Gym", "Bar", "Parking", "Breakfast"];

const propertyTypeForDestination = (name: string) => {
  switch (name) {
    case "Goa":
      return "beach_resort";
    case "Manali":
    case "Shimla":
      return "mountain_retreat";
    case "Udaipur":
    case "Jaipur":
      return "heritage";
    case "Coorg":
      return "villa";
    default:
      return "boutique";
  }
};

const makeHotelsForDestination = (destinationName: string, destinationId: string, state: string) => {
  const propertyType = propertyTypeForDestination(destinationName);
  return new Array(3).fill(0).map((_, idx) => ({
    name: `${destinationName} ${idx === 0 ? "Signature" : idx === 1 ? "Retreat" : "Residency"}`,
    city: destinationName,
    state,
    pincode: `${400000 + idx * 17}`,
    images: JSON.stringify([hotelImages[idx % hotelImages.length]]),
    pricePerNight: 6500 + idx * 1500,
    rating: 4.3 + idx * 0.2,
    reviewCount: 120 + idx * 45,
    amenities: JSON.stringify(amenitiesPool.slice(0, 5)),
    propertyType,
    badges: JSON.stringify(["Free Cancellation", "Breakfast Included"]),
    description: `Experience the best of ${destinationName} with curated stays, local cuisine, and premium hospitality.`,
    highlights: JSON.stringify(["Scenic views", "Signature dining", "Guided experiences"]),
    destinationId,
    roomTypes: {
      create: [
        {
          name: "Deluxe Room",
          price: 6500 + idx * 1500,
          maxGuests: 2,
          bedType: "King",
          amenities: JSON.stringify(["Balcony", "WiFi", "Mini Bar"]),
          imageUrl: roomImage,
        },
        {
          name: "Suite",
          price: 9500 + idx * 1500,
          maxGuests: 4,
          bedType: "King + Twin",
          amenities: JSON.stringify(["Living Room", "Scenic View"]),
          imageUrl: roomImage,
        },
      ],
    },
  }));
};

const main = async () => {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password@123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Sample Traveler",
      email: "traveler@vanyastays.in",
      passwordHash,
      role: "traveler",
    },
  });

  const partner = await prisma.user.create({
    data: {
      name: "Partner Host",
      email: "partner@vanyastays.in",
      passwordHash,
      role: "partner",
    },
  });

  for (const destination of destinationData) {
    const createdDestination = await prisma.destination.create({
      data: {
        name: destination.name,
        state: destination.state,
        tagline: destination.tagline,
        imageUrl: destination.image,
      },
    });

    const hotels = makeHotelsForDestination(
      destination.name,
      createdDestination.id,
      destination.state
    );

    for (const hotel of hotels) {
      const createdHotel = await prisma.hotel.create({
        data: hotel,
        include: { roomTypes: true },
      });

      await prisma.review.create({
        data: {
          hotelId: createdHotel.id,
          userId: user.id,
          rating: 4.7,
          comment: `Loved the stay at ${createdHotel.name}! Exceptional service and stunning views.`,
          tripType: "Couple",
        },
      });

      await prisma.review.create({
        data: {
          hotelId: createdHotel.id,
          userId: partner.id,
          rating: 4.5,
          comment: `Great hospitality and thoughtful amenities at ${createdHotel.name}.`,
          tripType: "Family",
        },
      });
    }
  }
};

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
