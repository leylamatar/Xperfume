export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  priceFormatted: string;
  image: string;
  notes: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  longDescription: string;
  rating: number;
  reviews: number;
  category: "oriental" | "floral" | "woody" | "fresh" | "chypre";
  size: string;
  isNew?: boolean;
  isBestseller?: boolean;
  ingredients: string;
}

const IMG = {
  n1: "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  n2: "https://images.unsplash.com/photo-1774682060922-c395859148c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  n3: "https://images.unsplash.com/photo-1774682060971-7b0b07c1d47f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  n4: "https://images.unsplash.com/photo-1778058505620-6911582e5a9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  n5: "https://images.unsplash.com/photo-1774682060959-efe13b7a12b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3OTA5MTQyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  n6: "https://images.unsplash.com/photo-1598634222670-87c5f558119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  n7: "https://images.unsplash.com/photo-1627823569857-4d8581dc62b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  n8: "https://images.unsplash.com/photo-1680503504148-25f2d178ff05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwZXJmdW1lJTIwc21va2UlMjBtaXN0JTIwZWxlZ2FudHxlbnwxfHx8fDE3NzkwOTE0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

export const products: Product[] = [
  {
    id: "noir-absolu",
    name: "Noir Absolu",
    collection: "Signature Collection",
    price: 385,
    priceFormatted: "$385",
    image: IMG.n1,
    notes: "Oud, Rose, Amber",
    topNotes: ["Saffron", "Pink Pepper", "Bergamot"],
    heartNotes: ["Bulgarian Rose", "Oud Wood", "Iris"],
    baseNotes: ["Amber", "Sandalwood", "Musk"],
    description: "An opulent journey through the heart of luxury.",
    longDescription:
      "Noir Absolu opens with an intoxicating accord of saffron and pink pepper, evoking the warmth of a Parisian evening. As the fragrance evolves, Bulgarian rose and rare oud wood emerge in perfect harmony — bold yet refined. The drydown reveals a sensual trail of amber, aged sandalwood, and white musk that lingers for hours, marking every room you enter.",
    rating: 4.9,
    reviews: 248,
    category: "oriental",
    size: "100ml",
    isBestseller: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Citronellol, Geraniol, Cinnamal, Eugenol, Benzyl Benzoate",
  },
  {
    id: "velvet-dreams",
    name: "Velvet Dreams",
    collection: "Midnight Collection",
    price: 425,
    priceFormatted: "$425",
    image: IMG.n2,
    notes: "Jasmine, Vanilla, Musk",
    topNotes: ["Bergamot", "Cardamom", "Peach"],
    heartNotes: ["Night-Blooming Jasmine", "Ylang-Ylang", "Orris Root"],
    baseNotes: ["Bourbon Vanilla", "White Musk", "Vetiver"],
    description: "A sensual nocturnal bloom wrapped in velvet warmth.",
    longDescription:
      "Velvet Dreams is a fragrance born at the edge of night. The opening bursts with luminous bergamot and exotic cardamom before yielding to the hypnotic heart of night-blooming jasmine. As darkness settles, bourbon vanilla and white musk create an enveloping warmth — as soft and luxurious as brushed velvet against bare skin.",
    rating: 5.0,
    reviews: 312,
    category: "floral",
    size: "100ml",
    isBestseller: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Alcohol, Linalool, Limonene, Coumarin, Citronellol",
  },
  {
    id: "golden-essence",
    name: "Golden Essence",
    collection: "Imperial Collection",
    price: 495,
    priceFormatted: "$495",
    image: IMG.n3,
    notes: "Saffron, Leather, Sandalwood",
    topNotes: ["Saffron", "Aldehydes", "Grapefruit"],
    heartNotes: ["Leather", "Labdanum", "Frankincense"],
    baseNotes: ["Mysore Sandalwood", "Oud", "Ambergris"],
    description: "A rare composition of ancient spice and liquid gold.",
    longDescription:
      "Golden Essence is the jewel of our Imperial Collection — a fragrance of extraordinary depth and presence. Persian saffron opens with a luminous, almost metallic warmth, while aldehydes add a champagne-like effervescence. At the heart, supple leather and sacred frankincense resin create an enigmatic, almost meditative accord. The base is built on Mysore sandalwood of legendary quality, enriched with rare ambergris.",
    rating: 4.8,
    reviews: 189,
    category: "oriental",
    size: "100ml",
    isNew: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Cinnamyl Alcohol, Benzyl Salicylate, Eugenol, Alpha-Isomethyl Ionone, Cinnamal",
  },
  {
    id: "obsidian-night",
    name: "Obsidian Night",
    collection: "Midnight Collection",
    price: 360,
    priceFormatted: "$360",
    image: IMG.n4,
    notes: "Black Oud, Incense, Vetiver",
    topNotes: ["Black Pepper", "Elemi Resin", "Clove"],
    heartNotes: ["Black Oud", "Incense", "Iris"],
    baseNotes: ["Dark Vetiver", "Patchouli", "Leather"],
    description: "As dark and hypnotic as a midnight sky.",
    longDescription:
      "Obsidian Night is a fragrance of remarkable intensity and character. Inspired by moonlit ceremonies in ancient temples, it opens with the sharp clarity of black pepper and sacred elemi resin. At its core, black oud and incense create a cathedral-like depth — vast, resonant, and deeply spiritual. The base weaves dark vetiver and supple leather into a trail that lasts through the night.",
    rating: 4.9,
    reviews: 276,
    category: "woody",
    size: "100ml",
    isBestseller: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Benzoate, Farnesol, Linalool, Geraniol, Citronellol",
  },
  {
    id: "rose-mystique",
    name: "Rose Mystique",
    collection: "Rose Garden Collection",
    price: 395,
    priceFormatted: "$395",
    image: IMG.n5,
    notes: "Damask Rose, Patchouli, Amber",
    topNotes: ["Turkish Rose", "Lychee", "Raspberry"],
    heartNotes: ["Damask Rose Absolute", "Geranium", "Violet Leaf"],
    baseNotes: ["Patchouli", "Warm Amber", "Cedarwood"],
    description: "The most precious rose, captured in liquid form.",
    longDescription:
      "Rose Mystique is built around a Damask rose absolute of exceptional quality — harvested by hand at dawn in the valley of roses in Bulgaria. The opening is luminously fruity, then the rose heart unfolds in layers of extraordinary complexity: velvety petals, green stems, and an almost honeyed depth. The drydown is grounded and sensual, with patchouli and warm amber providing a foundation worthy of this rarest of ingredients.",
    rating: 5.0,
    reviews: 312,
    category: "floral",
    size: "100ml",
    isBestseller: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Citronellol, Geraniol, Linalool, Benzyl Alcohol, Eugenol",
  },
  {
    id: "amber-royale",
    name: "Amber Royale",
    collection: "Imperial Collection",
    price: 410,
    priceFormatted: "$410",
    image: IMG.n6,
    notes: "Royal Amber, Benzoin, Tonka",
    topNotes: ["Cardamom", "Cinnamon", "Bergamot"],
    heartNotes: ["Royal Amber", "Benzoin", "Rose Absolute"],
    baseNotes: ["Tonka Bean", "Vanilla", "Labdanum"],
    description: "A warm, resinous crown of Eastern splendor.",
    longDescription:
      "Amber Royale is a masterclass in warm, radiant opulence. Inspired by ancient amber resins traded along the Silk Road, it opens with the bright warmth of cardamom and cinnamon before unfurling into a sumptuous heart of royal amber and benzoin. The drydown is a seductive embrace of tonka bean and labdanum — golden, sweet, and endlessly elegant.",
    rating: 4.7,
    reviews: 189,
    category: "oriental",
    size: "100ml",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Cinnamaldehyde, Coumarin, Eugenol, Isoeugenol, Benzyl Cinnamate",
  },
  {
    id: "velvet-noir",
    name: "Velvet Noir",
    collection: "Signature Collection",
    price: 445,
    priceFormatted: "$445",
    image: IMG.n7,
    notes: "Dark Plum, Leather, Oud",
    topNotes: ["Dark Plum", "Black Cherry", "Violet"],
    heartNotes: ["Aged Leather", "Suede", "Smoked Rose"],
    baseNotes: ["Oud", "Dark Amber", "Iso E Super"],
    description: "A shadowy, sensual contrast of fruit and leather.",
    longDescription:
      "Velvet Noir opens with the luscious intensity of dark plum and black cherry, immediately seductive and provocative. The leather heart is handled with exceptional sophistication — supple, almost smoky, woven through with the ghost of a smoked rose. The base is pure authority: oud, dark amber, and a generous dose of Iso E Super creating an aura that enters the room before you do.",
    rating: 4.8,
    reviews: 221,
    category: "chypre",
    size: "100ml",
    isNew: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Salicylate, Linalool, Limonene, Hydroxycitronellal, Citronellol",
  },
  {
    id: "imperial-oud",
    name: "Imperial Oud",
    collection: "Imperial Collection",
    price: 580,
    priceFormatted: "$580",
    image: IMG.n8,
    notes: "Cambodian Oud, Saffron, Rose",
    topNotes: ["Saffron", "Elemi", "Cardamom"],
    heartNotes: ["Cambodian Oud", "Bulgarian Rose", "Myrrh"],
    baseNotes: ["Sandalwood", "Ambergris", "Musk"],
    description: "The rarest Cambodian oud in its purest expression.",
    longDescription:
      "Imperial Oud is our most prestigious creation — built around Cambodian oud of the highest grade, sourced from trees over 200 years old in the jungles of Kampong Thom. The saffron and elemi opening acts as a ceremonial unveiling, preparing the senses for what follows: a profound, barn-like oud of extraordinary character, interlaced with Bulgarian rose of exceptional quality. The result is a perfume that transcends mere fragrance.",
    rating: 5.0,
    reviews: 94,
    category: "oriental",
    size: "50ml",
    isNew: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Cinnamyl Alcohol, Benzyl Benzoate, Linalool, Farnesol, Eugenol",
  },
  {
    id: "white-cedar",
    name: "White Cedar",
    collection: "Forest Collection",
    price: 320,
    priceFormatted: "$320",
    image: IMG.n1,
    notes: "White Cedar, Juniper, Vetiver",
    topNotes: ["Juniper Berry", "Lemon Verbena", "Pink Pepper"],
    heartNotes: ["White Cedar", "Cypress", "Lavender Absolute"],
    baseNotes: ["Vetiver", "Iso E Super", "Mineral Musk"],
    description: "The crisp silence of an ancient forest at dawn.",
    longDescription:
      "White Cedar captures the breathtaking clarity of an ancient cedar forest after rain. The opening is sharp and crystalline — juniper berry, lemon verbena, and a snap of pink pepper awakening the senses like cool mountain air. The heart is dominated by rare white cedar, woody and almost ethereal. This fragrance is a meditation on stillness, strength, and the profound beauty of nature untouched.",
    rating: 4.6,
    reviews: 143,
    category: "woody",
    size: "100ml",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Linalool, Limonene, Citronellol, Geraniol, Alpha-Isomethyl Ionone",
  },
  {
    id: "jasmine-soleil",
    name: "Jasmine Soleil",
    collection: "Rose Garden Collection",
    price: 340,
    priceFormatted: "$340",
    image: IMG.n2,
    notes: "Jasmine Sambac, Solar Musk, Neroli",
    topNotes: ["Calabrian Bergamot", "Neroli", "Green Tea"],
    heartNotes: ["Jasmine Sambac", "White Peony", "Muguet"],
    baseNotes: ["Solar Musk", "Ambrette", "White Sandalwood"],
    description: "Sun-warmed jasmine on a Mediterranean morning.",
    longDescription:
      "Jasmine Soleil is joy distilled into liquid form. Inspired by a Provençal garden at the peak of summer, it captures jasmine sambac at its most luminous — fresh, honeyed, and endlessly radiant. Calabrian bergamot and neroli provide a sparkling opening, while white sandalwood and solar musk in the base create the sensation of warm skin in golden afternoon light.",
    rating: 4.7,
    reviews: 167,
    category: "floral",
    size: "100ml",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Benzyl Alcohol, Linalool, Geraniol, Citronellol, Farnesol",
  },
  {
    id: "encens-sacre",
    name: "Encens Sacré",
    collection: "Signature Collection",
    price: 465,
    priceFormatted: "$465",
    image: IMG.n3,
    notes: "Frankincense, Myrrh, Cistus",
    topNotes: ["Bergamot", "Pepper", "Pink Grapefruit"],
    heartNotes: ["Frankincense Absolute", "Myrrh", "Cistus Labdanum"],
    baseNotes: ["Oud", "Amber", "Cedarwood"],
    description: "Ancient sacred resins from across three continents.",
    longDescription:
      "Encens Sacré is a pilgrimage through the sacred resin trade routes of antiquity. From Oman's frankincense groves to Somalian myrrh trees and Spanish cistus flowers, this fragrance gathers the world's most revered aromatic resins into a single, transcendent composition. The frankincense at its heart is absolute-grade — rich, balsamic, and deeply spiritual. A fragrance for those who seek meaning in scent.",
    rating: 4.9,
    reviews: 128,
    category: "oriental",
    size: "100ml",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Cinnamyl Alcohol, Benzyl Benzoate, Eugenol, Cinnamal, Isoeugenol",
  },
  {
    id: "iris-perle",
    name: "Iris Perlé",
    collection: "Signature Collection",
    price: 520,
    priceFormatted: "$520",
    image: IMG.n4,
    notes: "Iris Pallida, Violet, Orris Butter",
    topNotes: ["Aldehydes", "Bergamot", "Cassis"],
    heartNotes: ["Iris Pallida Absolute", "Violet Leaf", "Rose"],
    baseNotes: ["Orris Butter", "Musk", "White Wood"],
    description: "The rarest iris, transformed into liquid couture.",
    longDescription:
      "Iris Perlé is the epitome of Parisian perfumery — cool, sophisticated, and utterly distinctive. Built around iris pallida absolute of exceptional quality (it takes one ton of iris rhizomes to produce one kilogram of absolute), this fragrance possesses a carrot-like, powdery, violet character that is absolutely unlike anything else in perfumery. Aldehydes lend an almost vintage luminosity, while orris butter in the base achieves a silky, almost cashmere-like quality.",
    rating: 4.8,
    reviews: 112,
    category: "floral",
    size: "100ml",
    isNew: true,
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua, Hydroxycitronellal, Coumarin, Benzyl Alcohol, Linalool, Citronellol",
  },
];

export const faqs = [
  {
    question:
      "What makes Élégance Absolue fragrances different from commercial perfumes?",
    answer:
      "We formulate using only the finest raw ingredients at their maximum dosage — never diluted for cost savings. Every fragrance is created by our maître parfumeur in Grasse, with no compromises on ingredient quality. We use no synthetic shortcuts: our rose is always from Bulgaria, our oud always traceable, our sandalwood always from Mysore.",
  },
  {
    question: "How long will my fragrance last?",
    answer:
      "Our Extrait de Parfum concentrations typically achieve 12–24 hours of projection. However, longevity depends on skin chemistry, hydration level, and application point. We recommend applying to pulse points on moisturized skin for maximum longevity.",
  },
  {
    question: "Do you offer samples before purchasing full bottles?",
    answer:
      "Yes. We offer a Discovery Set of seven 2ml samples from across our collections, curated to represent the full breadth of our olfactory universe. This is the ideal first step for any new Élégance Absolue client.",
  },
  {
    question: "What is your returns policy?",
    answer:
      "We accept returns of unopened bottles within 30 days of purchase. For opened bottles, we offer an exchange for an equal or greater value item within 14 days if you are unsatisfied. Please contact our client services team to initiate any return.",
  },
  {
    question: "Do you offer gift wrapping and personalized messages?",
    answer:
      "Every Élégance Absolue order arrives in our signature black and gold gift box with silk ribbon. Personalized calligraphed messages are available at no additional charge — simply include your message at checkout.",
  },
  {
    question: "Are your fragrances cruelty-free?",
    answer:
      "All Élégance Absolue fragrances are entirely cruelty-free. We use no animal testing at any stage of development. Our musks are exclusively synthetic. We do use natural animalic-smelling ingredients such as ambergris (sustainably sourced) and civet (synthetic replacement).",
  },
  {
    question: "How should I store my fragrances?",
    answer:
      "Store fragrances away from direct sunlight, heat, and humidity — ideally in a cool, dark space such as a drawer or cabinet. Avoid the bathroom, which experiences dramatic temperature and humidity fluctuations. Properly stored, our fragrances maintain their character for 5–10 years.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We ship to over 45 countries worldwide. All international shipments are fully insured and tracked. Duties and taxes may apply depending on destination country — these are calculated at checkout. Our standard international delivery time is 5–10 business days.",
  },
];
