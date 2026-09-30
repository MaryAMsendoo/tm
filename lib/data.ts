/**
 * Central "database" for the site.
 * Everything the UI shows lives here, so when a real backend arrives
 * only this layer needs to change.
 *
 * Products come next (see the Product type we'll add in the next step).
 */

export type SocialKey =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "linkedin"
  | "youtube";

export const siteConfig = {
  name: "TM Artisan Enterprise",
  shortName: "TM Artisan",
  tagline: "Furniture made by hand, made for your space.",
  description:
    "Custom and ready-made furniture, crafted in Abuja. Tell us what you have in mind and we'll send you a price.",

  logo: "/TM-logo.jpeg",

  whatsapp: "+2348057789650",
  // TODO: replace with the real business email
  email: "tm@gmail.com",

  phones: ["+2349168549455", "+2347012724991"],
  address: "Gosa, Airport Road, Abuja, FCT, Nigeria",

  // Leave href empty until you have the real link; empty ones are hidden.
  socials: [
    { key: "facebook", label: "Facebook", href: "" },
    { key: "instagram", label: "Instagram", href: "" },
    { key: "tiktok", label: "TikTok", href: "" },
    { key: "x", label: "X", href: "" },
    { key: "linkedin", label: "LinkedIn", href: "" },
    { key: "youtube", label: "YouTube", href: "" },
  ] as { key: SocialKey; label: string; href: string }[],
};

export type NavLink = { label: string; href: string };

// Adjust hrefs to match the dummy pages you already created.
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Custom designs", href: "/custom-designs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Category = { slug: string; label: string };

export type HeroSlide = {
  id: string;
  name: string;
  category?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  tag: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "living",
    name: "Living room collection",
    category: "living-room",
    eyebrow: "Living room",
    title: "TV walls, consoles and storage made to fit your room.",
    description:
      "Built to your measurements, finish and lighting. Send us the space and we'll send you a price.",
    image: "/f22.png",
    tag: "Living room",
  },
  {
    id: "kitchen",
    name: "Kitchen collection",
    category: "kitchen",
    eyebrow: "Kitchen",
    title: "Kitchens planned around how you cook.",
    description:
      "Cabinets, islands and breakfast counters built to your layout. Send us the room and we'll send you a price.",
    image: "/f1.png",
    tag: "Kitchen",
  },
  {
    id: "bedroom",
    name: "Bedroom collection",
    category: "bedroom",
    eyebrow: "Bedroom",
    title: "Wardrobes and dressing units made for the room you have.",
    description:
      "Floor-to-ceiling storage, dressing tables and lit mirrors, with handles and finishes you pick.",
    image: "/f10.png",
    tag: "Bedroom",
  },
];

export const categories: Category[] = [
  { slug: "living-room", label: "Living room" },
  { slug: "bedroom", label: "Bedroom" },
  { slug: "wall-pieces", label: "Wall pieces" },
  { slug: "office", label: "Office" },
  { slug: "dining", label: "Dining" },
  { slug: "kitchen", label: "Kitchen" },
  { slug: "outdoor", label: "Outdoor" },
  { slug: "glass", label: "Glass products" },
  { slug: "custom", label: "Custom designs" },
];

export type ShowcaseSlide = {
  id: string;
  name: string;
  category?: string;
  image: string;
};

// Used by the arch frame in components/home/Hero.tsx
export const showcaseSlides: ShowcaseSlide[] = [
  { id: "showcase-living", name: "Living room collection", image: "/f1.png" },
  { id: "showcase-dining", name: "Dining collection", image: "/f5.png" },
  { id: "showcase-bedroom", name: "Bedroom collection", image: "/f9.png" },
];

export type Product = {
  id: string;
  name: string;
  category: string; // a Category slug
  images: string[];
  description: string;
  dimensions?: string;
  materials?: string;
  customisable: boolean;
  featured?: boolean;
};

export const products: Product[] = [
  // Kitchen
  { id: "kitchen-breakfast-bar", name: "Kitchen with breakfast bar", category: "kitchen", images: ["/f1.png"], description: "Fitted cabinets, under-cabinet lighting and a ribbed-wood breakfast bar.", customisable: true, featured: true },
  { id: "kitchen-grey-gloss", name: "Grey gloss kitchen", category: "kitchen", images: ["/f2.png"], description: "Tall and wall cabinets in gloss grey with a marble splashback.", customisable: true },
  { id: "kitchen-grey-matte", name: "Matte grey U-shaped kitchen", category: "kitchen", images: ["/f3.png"], description: "A U-shaped layout with matte cabinets and dark worktops.", customisable: true },
  { id: "kitchen-marble-island", name: "Marble kitchen island", category: "kitchen", images: ["/f15.png"], description: "A curved island with a stone top, ribbed front and bar seating.", customisable: true, featured: true },
  { id: "kitchen-compact-counter", name: "Compact kitchen with counter", category: "kitchen", images: ["/f21.png"], description: "White gloss cabinets with a wood canopy and a stone breakfast counter.", customisable: true },

  // Bedroom
  { id: "bedroom-wardrobe-gloss", name: "Floor-to-ceiling wardrobe", category: "bedroom", images: ["/f5.png"], description: "Full-wall gloss wardrobe with a lit alcove.", customisable: true, featured: true },
  { id: "bedroom-wardrobe-dressing-cream", name: "Wardrobe with dressing table", category: "bedroom", images: ["/f6.png"], description: "Cream wardrobe with a built-in dressing table and lit mirror.", customisable: true, featured: true },
  { id: "bedroom-wardrobe-dressing-grey", name: "Grey wardrobe and dressing unit", category: "bedroom", images: ["/f7.png"], description: "Two-tone wardrobe with overhead cabinets and a dressing table.", customisable: true },
  { id: "bedroom-wardrobe-walnut", name: "Walnut wardrobe and vanity", category: "bedroom", images: ["/f8.png"], description: "Dark wood wardrobe wall with a vanity and lit mirror.", customisable: true },
  { id: "bedroom-wardrobe-gold", name: "Wardrobe with gold handles", category: "bedroom", images: ["/f9.png"], description: "Grey wardrobe with brass handles, side shelves and a drawer unit.", customisable: true },
  { id: "bedroom-wardrobe-vanity", name: "Bedroom wardrobe and vanity", category: "bedroom", images: ["/f10.png"], description: "Grey wardrobe wall with a vanity and lit display niche.", customisable: true },
  { id: "bedroom-mirror-shelf", name: "Dressing mirror with shelf", category: "bedroom", images: ["/f4.png"], description: "Wall-hung oval mirror with a floating drawer and a lit side shelf.", customisable: true },

  // Living room
  { id: "living-storage-wall", name: "White and oak storage wall", category: "living-room", images: ["/f11.png"], description: "Tall storage with lit open shelves and a wood frame.", customisable: true },
  { id: "living-tv-marble", name: "TV wall with marble panel", category: "living-room", images: ["/f17.png"], description: "Marble-look feature panel, wood slats and a floating console.", customisable: true, featured: true },
  { id: "living-tv-arch", name: "TV wall with arch alcove", category: "living-room", images: ["/f18.png"], description: "Wood-toned TV panel, long floating console and a lit arch niche.", customisable: true },
  { id: "living-tv-slats", name: "TV wall with slatted panels", category: "living-room", images: ["/f20.png"], description: "Backlit TV surround, slatted side panel and a floating cabinet.", customisable: true },
  { id: "living-room-set", name: "Living room with TV console", category: "living-room", images: ["/f16.png"], description: "An open living and dining space with a low TV console.", customisable: true },
  { id: "living-sectional", name: "Sectional sofa and TV wall", category: "living-room", images: ["/f22.png"], description: "Corner sectional, coffee table and a white panelled TV wall.", customisable: true, featured: true },

  // Wall pieces
  { id: "wall-sculpted-shelf", name: "Sculpted wall shelf with mirror", category: "wall-pieces", images: ["/f12.png"], description: "A curved slatted panel with floating shelves and a round mirror.", customisable: true },
  { id: "wall-console-mirror", name: "Floating console with lit mirror", category: "wall-pieces", images: ["/f13.png"], description: "Wall-hung console, backlit mirror and a slatted panel.", customisable: true },
  { id: "wall-circle-shelves", name: "Circular wall shelf set", category: "wall-pieces", images: ["/f14.png"], description: "Ring-shaped shelving with a slatted backing.", customisable: true },
  { id: "wall-organic-mirror", name: "Lit organic mirror", category: "wall-pieces", images: ["/f19.png"], description: "Full-length shaped mirror with a warm edge light and a floating shelf.", customisable: true },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const getProductsByCategory = (slug?: string | null) =>
  slug ? products.filter((p) => p.category === slug) : products;

// Only categories that have products, for the shop and home tiles.
export const activeCategories = categories.filter((c) =>
  products.some((p) => p.category === c.slug),
);


export type PortfolioProject = {
  id: string;
  title: string;
  category: string; // a Category slug
  image: string;
  location?: string;
};

// Placeholders: replace with real finished jobs and their photos.
export const portfolioProjects: PortfolioProject[] = [
  { id: "p-kitchen-island", title: "Open-plan kitchen with marble island", category: "kitchen", image: "/f15.png" },
  { id: "p-bedroom-wardrobe", title: "Wardrobe wall with dressing table", category: "bedroom", image: "/f6.png" },
  { id: "p-tv-wall", title: "Living room TV wall", category: "living-room", image: "/f17.png" },
  { id: "p-wall-mirror", title: "Sculpted shelves with round mirror", category: "wall-pieces", image: "/f12.png" },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail?: string; // e.g. what was made, or the area
  placeholder?: boolean; // remove this flag once the quote is real
};

// Replace with real customer words (with their permission) and delete `placeholder`.
export const testimonials: Testimonial[] = [
  { id: "t1", quote: "Replace this with a real customer's own words about their furniture.", name: "Customer name", detail: "What TM Artisan made for them", placeholder: true },
  { id: "t2", quote: "A second real quote goes here. One or two sentences is enough.", name: "Customer name", detail: "What TM Artisan made for them", placeholder: true },
  { id: "t3", quote: "A third real quote goes here.", name: "Customer name", detail: "What TM Artisan made for them", placeholder: true },
];