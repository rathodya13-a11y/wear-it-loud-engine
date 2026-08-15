import tee1 from "@/assets/tee-1.jpg";
import tee2 from "@/assets/tee-2.jpg";
import tee3 from "@/assets/tee-3.jpg";
import tee4 from "@/assets/tee-4.jpg";

/**
 * Real, fixed sale end time. Never regenerated on refresh — the countdown
 * counts toward this instant for every visitor. Move this to the database
 * when Cloud is wired up.
 */
export const SALE_ENDS_AT = "2026-08-31T18:30:00.000Z";

export type Size = "S" | "M" | "L" | "XL" | "XXL";

export type Product = {
  slug: string;
  name: string;
  category: "Graphic" | "Typography" | "Oversized";
  price: number;
  mrp: number;
  image: string;
  hoverImage: string;
  rating: number;
  reviews: number;
  bestseller: boolean;
  /** Real per-size inventory. Scarcity badges are derived from this only. */
  stock: Record<Size, number>;
  fabric: string;
  fit: string;
  print: string;
  care: string;
  blurb: string;
};

export const SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  {
    slug: "no-mercy-black",
    name: "No Mercy Oversized Tee",
    category: "Graphic",
    price: 899,
    mrp: 1499,
    image: tee1,
    hoverImage: tee4,
    rating: 4.8,
    reviews: 312,
    bestseller: true,
    stock: { S: 0, M: 3, L: 12, XL: 8, XXL: 2 },
    fabric: "240 GSM combed cotton, bio-washed",
    fit: "Oversized drop-shoulder",
    print: "High-density DTG with plastisol pop",
    care: "Cold machine wash inside out. No bleach. Do not iron the print.",
    blurb: "Blood-red type on dead black. Subtle is not the point.",
  },
  {
    slug: "statement-white",
    name: "Statement Heavy Tee",
    category: "Typography",
    price: 799,
    mrp: 1299,
    image: tee2,
    hoverImage: tee3,
    rating: 4.7,
    reviews: 186,
    bestseller: true,
    stock: { S: 6, M: 9, L: 4, XL: 11, XXL: 5 },
    fabric: "220 GSM ring-spun cotton",
    fit: "Boxy regular",
    print: "Screen print, 3-layer white base",
    care: "Cold machine wash inside out. Tumble dry low.",
    blurb: "Type so heavy it does the talking for you.",
  },
  {
    slug: "midnight-frame",
    name: "Midnight Frame Tee",
    category: "Graphic",
    price: 949,
    mrp: 1599,
    image: tee3,
    hoverImage: tee1,
    rating: 4.9,
    reviews: 97,
    bestseller: false,
    stock: { S: 2, M: 0, L: 7, XL: 5, XXL: 3 },
    fabric: "240 GSM brushed cotton",
    fit: "Relaxed straight",
    print: "Photo-real DTG on charcoal",
    care: "Cold hand wash recommended for first 3 washes.",
    blurb: "Amber-framed grit. Wears in, never out.",
  },
  {
    slug: "skull-crew",
    name: "Skull Crew Tee",
    category: "Oversized",
    price: 849,
    mrp: 1399,
    image: tee4,
    hoverImage: tee2,
    rating: 4.6,
    reviews: 241,
    bestseller: true,
    stock: { S: 4, M: 14, L: 10, XL: 0, XXL: 6 },
    fabric: "230 GSM cotton, pre-shrunk",
    fit: "Oversized",
    print: "Single-colour screen print",
    care: "Cold machine wash. Dry in shade.",
    blurb: "One colour. Zero apology.",
  },
  {
    slug: "riot-red-type",
    name: "Riot Type Tee",
    category: "Typography",
    price: 749,
    mrp: 1199,
    image: tee2,
    hoverImage: tee1,
    rating: 4.5,
    reviews: 64,
    bestseller: false,
    stock: { S: 8, M: 12, L: 15, XL: 9, XXL: 4 },
    fabric: "200 GSM cotton jersey",
    fit: "Regular",
    print: "Screen print",
    care: "Cold machine wash inside out.",
    blurb: "Everyday weight, street-level volume.",
  },
  {
    slug: "shadow-drop",
    name: "Shadow Drop Tee",
    category: "Oversized",
    price: 999,
    mrp: 1699,
    image: tee1,
    hoverImage: tee3,
    rating: 4.8,
    reviews: 133,
    bestseller: false,
    stock: { S: 1, M: 2, L: 3, XL: 2, XXL: 0 },
    fabric: "260 GSM heavyweight cotton",
    fit: "Oversized drop-shoulder",
    print: "Puff print",
    care: "Cold hand wash only.",
    blurb: "Heaviest tee we print. Restock not guaranteed.",
  },
  {
    slug: "static-grey",
    name: "Static Grey Tee",
    category: "Graphic",
    price: 799,
    mrp: 1299,
    image: tee3,
    hoverImage: tee4,
    rating: 4.4,
    reviews: 58,
    bestseller: false,
    stock: { S: 5, M: 7, L: 9, XL: 6, XXL: 2 },
    fabric: "220 GSM cotton",
    fit: "Regular",
    print: "DTG",
    care: "Cold machine wash.",
    blurb: "Grain, noise, attitude.",
  },
  {
    slug: "bone-white-crew",
    name: "Bone White Crew",
    category: "Typography",
    price: 699,
    mrp: 1099,
    image: tee4,
    hoverImage: tee2,
    rating: 4.3,
    reviews: 45,
    bestseller: false,
    stock: { S: 10, M: 10, L: 10, XL: 10, XXL: 8 },
    fabric: "200 GSM cotton",
    fit: "Regular",
    print: "Screen print",
    care: "Cold machine wash.",
    blurb: "The base layer for every loud fit.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const totalStock = (p: Product) =>
  SIZES.reduce((sum, size) => sum + p.stock[size], 0);

export const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;
