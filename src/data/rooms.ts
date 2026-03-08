import roomSuite from "@/assets/room-suite.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPenthouse from "@/assets/room-penthouse.jpg";
import roomSuiteBath from "@/assets/room-suite-bath.jpg";
import roomSuiteLiving from "@/assets/room-suite-living.jpg";
import roomSuiteBalcony from "@/assets/room-suite-balcony.jpg";
import roomDeluxeBath from "@/assets/room-deluxe-bath.jpg";
import roomPenthouseTerrace from "@/assets/room-penthouse-terrace.jpg";
import roomPenthouseDining from "@/assets/room-penthouse-dining.jpg";

export interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  price: number;
  size: string;
  capacity: number;
  amenities: string[];
  rating: number;
  reviews: number;
}

export const rooms: Room[] = [
  {
    id: "ocean-suite",
    name: "Ocean View Suite",
    category: "Suite",
    description: "Wake up to panoramic ocean views from your private balcony. This expansive suite features a king bed, luxury bath with soaking tub, and a separate living area.",
    image: roomSuite,
    gallery: [roomSuiteBath, roomSuiteLiving, roomSuiteBalcony],
    price: 450,
    size: "65 m²",
    capacity: 2,
    amenities: ["Ocean View", "Private Balcony", "Soaking Tub", "Minibar", "Smart TV", "Wi-Fi"],
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "city-deluxe",
    name: "City Skyline Deluxe",
    category: "Deluxe",
    description: "Elevated luxury with breathtaking city views. Modern furnishings, premium bedding, and a curated minibar for the discerning traveler.",
    image: roomDeluxe,
    gallery: [roomDeluxeBath, roomSuiteLiving],
    price: 320,
    size: "48 m²",
    capacity: 2,
    amenities: ["City View", "King Bed", "Rain Shower", "Work Desk", "Smart TV", "Wi-Fi"],
    rating: 4.8,
    reviews: 96,
  },
  {
    id: "royal-penthouse",
    name: "Royal Penthouse",
    category: "Penthouse",
    description: "The pinnacle of luxury. A sprawling penthouse with private terrace, butler service, panoramic views, and bespoke interiors crafted for royalty.",
    image: roomPenthouse,
    gallery: [roomPenthouseTerrace, roomPenthouseDining, roomSuiteBath],
    price: 1200,
    size: "120 m²",
    capacity: 4,
    amenities: ["Panoramic View", "Private Terrace", "Butler Service", "Jacuzzi", "Dining Area", "Wi-Fi"],
    rating: 5.0,
    reviews: 42,
  },
  {
    id: "garden-suite",
    name: "Garden Retreat Suite",
    category: "Suite",
    description: "A tranquil escape surrounded by lush gardens. Features floor-to-ceiling windows, a spa-inspired bathroom, and direct garden access.",
    image: roomSuite,
    gallery: [roomSuiteBalcony, roomSuiteBath, roomSuiteLiving],
    price: 380,
    size: "55 m²",
    capacity: 2,
    amenities: ["Garden View", "Spa Bath", "Private Patio", "Minibar", "Smart TV", "Wi-Fi"],
    rating: 4.7,
    reviews: 74,
  },
  {
    id: "executive-deluxe",
    name: "Executive Deluxe",
    category: "Deluxe",
    description: "Designed for the modern professional. Spacious work area, high-speed connectivity, and premium comfort after a productive day.",
    image: roomDeluxe,
    gallery: [roomDeluxeBath, roomSuiteLiving],
    price: 280,
    size: "42 m²",
    capacity: 2,
    amenities: ["City View", "Executive Desk", "Espresso Machine", "Rain Shower", "Smart TV", "Wi-Fi"],
    rating: 4.6,
    reviews: 112,
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    category: "Penthouse",
    description: "Unmatched grandeur with separate living quarters, a private dining room, personal concierge, and views that define opulence.",
    image: roomPenthouse,
    gallery: [roomPenthouseDining, roomPenthouseTerrace, roomSuiteBath],
    price: 950,
    size: "100 m²",
    capacity: 3,
    amenities: ["Panoramic View", "Private Dining", "Concierge", "Grand Piano", "Bar", "Wi-Fi"],
    rating: 4.9,
    reviews: 58,
  },
];
