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

const buildImageSet = (baseName: string, count: number) =>
  Array.from({ length: count }, (_, index) => `/${baseName}-${String(index + 1).padStart(3, "0")}.jpeg`);

export const wardrobeWarmWoodImages = buildImageSet("wardrobe-warm-wood", 23);
export const wardrobeSagePanelImages = buildImageSet("wardrobe-sage-panel", 41);
export const sofaGreyCurvedImages = buildImageSet("sofa-grey-curved", 13);
export const sofaRedTuftedImages = buildImageSet("sofa-red-tufted", 6);
export const sofaBlueWorkshopImages = buildImageSet("sofa-blue-workshop", 30);

export const featuredVideos = [
  { id: "sofa-grey-curved-video-001", title: "Curved grey sofa walk-through", src: "/sofa-grey-curved-video-001.mp4", poster: sofaGreyCurvedImages[0] },
  { id: "sofa-grey-curved-video-002", title: "Grey sofa styling detail", src: "/sofa-grey-curved-video-002.mp4", poster: sofaGreyCurvedImages[1] },
  { id: "sofa-grey-curved-video-003", title: "Sofa feature showcase", src: "/sofa-grey-curved-video-003.mp4", poster: sofaGreyCurvedImages[2] },
  { id: "sofa-grey-curved-video-004", title: "Sofa in living space", src: "/v1.mp4", poster: "/f22.png" },
  { id: "sofa-grey-curved-video-005", title: "Sofa with accent lighting", src: "/v2.mp4", poster: sofaGreyCurvedImages[3] },
];

export const categories: Category[] = [
  { slug: "living-room", label: "Living room" },
  { slug: "bedroom", label: "Bedroom" },
  { slug: "wardrobes", label: "Wardrobes" },
  { slug: "sofas", label: "Sofas" },
  { slug: "wall-pieces", label: "Wall pieces" },
  { slug: "office", label: "Office" },
  { slug: "dining", label: "Dining" },
  { slug: "kitchen", label: "Kitchen" },
  { slug: "outdoor", label: "Outdoor" },
  { slug: "glass", label: "Glass products" },
  { slug: "custom", label: "Custom designs" },
];

export type ShowroomArchiveItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  poster?: string;
  type: "image" | "video";
  description: string;
};

export const showroomArchiveItems: ShowroomArchiveItem[] = [
  ...wardrobeWarmWoodImages.map((image, index) => ({
    id: `archive-wardrobe-warm-wood-${index + 1}`,
    title: "Warm wood wardrobe",
    category: "wardrobes",
    image,
    type: "image" as const,
    description: "Floor-to-ceiling storage with warm wood texture and built-in wardrobe detailing.",
  })),
  ...wardrobeSagePanelImages.map((image, index) => ({
    id: `archive-wardrobe-sage-panel-${index + 1}`,
    title: "Sage panel wardrobe",
    category: "wardrobes",
    image,
    type: "image" as const,
    description: "Soft panelled wardrobe design with a clean and contemporary look.",
  })),
  ...sofaGreyCurvedImages.map((image, index) => ({
    id: `archive-sofa-grey-curved-${index + 1}`,
    title: "Curved grey sofa",
    category: "sofas",
    image,
    type: "image" as const,
    description: "Modern curved sofa styling with soft grey upholstery and luxury lounge proportions.",
  })),
  ...sofaRedTuftedImages.map((image, index) => ({
    id: `archive-sofa-red-tufted-${index + 1}`,
    title: "Red tufted sofa",
    category: "sofas",
    image,
    type: "image" as const,
    description: "Statement tufted upholstery in a rich red accent for dramatic living spaces.",
  })),
  ...sofaBlueWorkshopImages.map((image, index) => ({
    id: `archive-sofa-blue-workshop-${index + 1}`,
    title: "Blue workshop sofa",
    category: "sofas",
    image,
    type: "image" as const,
    description: "Large-format lounge seating inspired by warm workshop textures and modular comfort.",
  })),
  ...["/f1.png", "/f2.png", "/f3.png", "/f4.png", "/f5.png", "/f6.png", "/f7.png", "/f8.png", "/f9.png", "/f10.png", "/f11.png", "/f12.png", "/f13.png", "/f14.png", "/f15.png", "/f16.png", "/f17.png", "/f18.png", "/f19.png", "/f20.png", "/f21.png", "/f22.png"].map((image, index) => {
    const mapping = [
      ["/f1.png", "kitchen", "Breakfast bar kitchen"],
      ["/f2.png", "kitchen", "Grey gloss kitchen"],
      ["/f3.png", "kitchen", "Matte U-shape kitchen"],
      ["/f4.png", "bedroom", "Mirror shelf dressing wall"],
      ["/f5.png", "bedroom", "Floor-to-ceiling wardrobe"],
      ["/f6.png", "bedroom", "Wardrobe with dressing table"],
      ["/f7.png", "bedroom", "Grey wardrobe and vanity"],
      ["/f8.png", "bedroom", "Walnut vanity wall"],
      ["/f9.png", "bedroom", "Gold handle wardrobe"],
      ["/f10.png", "bedroom", "Bedroom wardrobe and vanity"],
      ["/f11.png", "living-room", "Oak storage wall"],
      ["/f12.png", "wall-pieces", "Sculpted shelf with mirror"],
      ["/f13.png", "wall-pieces", "Floating console and mirror"],
      ["/f14.png", "wall-pieces", "Circular wall shelf set"],
      ["/f15.png", "kitchen", "Marble island kitchen"],
      ["/f16.png", "living-room", "Open-plan living room"],
      ["/f17.png", "living-room", "TV wall with marble panel"],
      ["/f18.png", "living-room", "TV wall with arch alcove"],
      ["/f19.png", "wall-pieces", "Lit organic mirror"],
      ["/f20.png", "living-room", "Slatted wall panel"],
      ["/f21.png", "kitchen", "Compact kitchen counter"],
      ["/f22.png", "living-room", "Sectional sofa and media wall"],
    ] as const;
    const match = mapping.find(([src]) => src === image) ?? ["/f1.png", "living-room", "Showroom piece"];
    return {
      id: `archive-${match[1]}-${index + 1}`,
      title: match[2],
      category: match[1],
      image,
      type: "image" as const,
      description: "Crafted to order for a personalised room, finish and layout.",
    };
  }),
  ...[
    "/sofa-grey-curved-video-001.mp4",
    "/sofa-grey-curved-video-002.mp4",
    "/sofa-grey-curved-video-003.mp4",
    "/sofa-grey-curved-video-004.mp4",
    "/sofa-grey-curved-video-005.mp4",
    "/sofa-grey-curved-video-006.mp4",
    "/sofa-grey-curved-video-007.mp4",
    "/sofa-grey-curved-video-008.mp4",
    "/sofa-grey-curved-video-009.mp4",
    "/sofa-grey-curved-video-010.mp4",
  ].map((video, index) => ({
    id: `archive-video-${index + 1}`,
    title: "Curved sofa walkthrough",
    category: "sofas",
    image: video,
    poster: sofaGreyCurvedImages[index % sofaGreyCurvedImages.length],
    type: "video" as const,
    description: "A motion walkthrough showing the proportions and styling in real use.",
  })),
];

export const enquiryThumbnail = (source: string) => {
  if (!/\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(source)) return source;

  return (
    featuredVideos.find((video) => video.src === source)?.poster ??
    showroomArchiveItems.find((item) => item.type === "video" && item.image === source)?.poster ??
    sofaGreyCurvedImages[0]
  );
};

export const publicGalleryImages = showroomArchiveItems.map((item) => item.image);

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
  // Wardrobes
  { id: "wardrobe-warm-wood", name: "Warm wood wardrobe wall", category: "wardrobes", images: wardrobeWarmWoodImages, description: "A warm wood wardrobe collection with floor-to-ceiling storage and integrated drawers, mirrors and accent lighting.", customisable: true, featured: true },
  { id: "wardrobe-sage-panel", name: "Sage panel wardrobe collection", category: "wardrobes", images: wardrobeSagePanelImages, description: "Soft sage panelled wardrobes with a clean, contemporary front and built-in dressing details.", customisable: true, featured: true },

  // Sofas
  { id: "sofa-grey-curved", name: "Curved grey sofa collection", category: "sofas", images: sofaGreyCurvedImages, description: "A modern curved sofa range in soft grey, designed to anchor a lounge or media wall without overpowering the room.", customisable: true, featured: true },
  { id: "sofa-red-tufted", name: "Red tufted sofa collection", category: "sofas", images: sofaRedTuftedImages, description: "Bold tufted sofas with rich red upholstery and sculpted seating for statement living spaces.", customisable: true, featured: true },
  { id: "sofa-blue-workshop", name: "Blue workshop sofa collection", category: "sofas", images: sofaBlueWorkshopImages, description: "Blue upholstered lounge pieces with generous proportions and a warm workshop-inspired finish.", customisable: true, featured: true },

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
  { id: "p-wardrobe-warm-wood", title: "Warm wood wardrobe wall", category: "wardrobes", image: wardrobeWarmWoodImages[0] },
  { id: "p-wardrobe-sage-panel", title: "Sage panel wardrobe layout", category: "wardrobes", image: wardrobeSagePanelImages[0] },
  { id: "p-sofa-grey-curved", title: "Curved grey sofa styling", category: "sofas", image: sofaGreyCurvedImages[0] },
  { id: "p-sofa-red-tufted", title: "Red tufted lounge scene", category: "sofas", image: sofaRedTuftedImages[0] },
  { id: "p-sofa-blue-workshop", title: "Blue workshop sofa set", category: "sofas", image: sofaBlueWorkshopImages[0] },
  { id: "p-kitchen-island", title: "Open-plan kitchen with marble island", category: "kitchen", image: "/f15.png" },
  { id: "p-bedroom-wardrobe", title: "Wardrobe wall with dressing table", category: "bedroom", image: "/f6.png" },
  { id: "p-tv-wall", title: "Living room TV wall", category: "living-room", image: "/f17.png" },
  { id: "p-wall-mirror", title: "Sculpted shelves with round mirror", category: "wall-pieces", image: "/f12.png" },
  { id: "p-kitchen-grey", title: "Gloss grey kitchen", category: "kitchen", image: "/f2.png" },
  { id: "p-kitchen-counter", title: "Compact kitchen with counter", category: "kitchen", image: "/f21.png" },
  { id: "p-bedroom-walnut", title: "Walnut wardrobe and vanity", category: "bedroom", image: "/f8.png" },
  { id: "p-bedroom-gold", title: "Wardrobe with brass handles", category: "bedroom", image: "/f9.png" },
  { id: "p-tv-arch", title: "TV wall with arch alcove", category: "living-room", image: "/f18.png" },
  { id: "p-living-sectional", title: "Living room with panelled TV wall", category: "living-room", image: "/f22.png" },
  { id: "p-wall-console", title: "Floating console with lit mirror", category: "wall-pieces", image: "/f13.png" },
  { id: "p-wall-organic", title: "Lit organic mirror", category: "wall-pieces", image: "/f19.png" },
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

// From the client brief. The farm half is left out until farm products are added.
export const mission =
  "To deliver premium artisan furniture and home solutions with excellence and integrity.";
export const vision =
  "To become a leading brand in Nigeria known for quality, innovation and trust.";

export const values = [
  "Integrity",
  "Excellence",
  "Innovation",
  "Quality",
  "Customer satisfaction",
  "Sustainability",
  "Reliability",
];

export const customOptions = [
  { title: "Board type", text: "The board the cabinet body and doors are made from." },
  { title: "Colour", text: "Doors, panels and trim in the shade you pick." },
  { title: "Material", text: "Wood, laminate, gloss or glass, depending on the piece." },
  { title: "Accessories", text: "Handles, lighting, mirrors, drawers and shelves." },
  { title: "Dimensions", text: "Cut to the wall, alcove or room you actually have." },
  { title: "Design preference", text: "Start from a piece in the shop, your own photo or a sketch." },
];

export const otherServices = [
  "Interior design",
  "Interior finishing",
  "Upholstery",
  "Carpentry",
  "Glass works and installation",
  "Plumbing",
  "Building materials supply",
  "Renovation and home improvement",
  "Consultancy",
];