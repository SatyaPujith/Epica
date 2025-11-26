
export interface Theme {
  id: string;
  name: string;
  description: string;
  // Styles used for inline application (ensures print accuracy)
  styles: {
    background: string;
    color: string;
    accent: string; // Used for titles/decorations
    borderColor: string;
    bgImage?: string; // CSS background-image property for decorations
    bgSize?: string;
  };
  fonts: {
    body: string; // Tailwind class
    display: string; // Tailwind class
  };
  previewGradient: string; // For the setup card UI
}

export const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'Classic Vellum',
    description: 'Timeless cream paper with sharp black ink. The standard for literary fiction.',
    styles: {
      background: '#fcfaf5',
      color: '#1c1917',
      accent: '#b4941f', // Gold-600
      borderColor: '#e5e5e5',
      bgImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-display'
    },
    previewGradient: 'from-[#fcfaf5] to-[#f0e6d2]'
  },
  {
    id: 'vintage',
    name: 'Antique Leather',
    description: 'Rich mahogany tones and warm parchment text. Perfect for history and fantasy.',
    styles: {
      background: '#271c19', // Deep warm brown
      color: '#e6dcc8', // Warm grey/beige
      accent: '#c5a065', // Muted Gold
      borderColor: '#4a3b32',
      bgImage: "url('https://www.transparenttextures.com/patterns/leather.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-display'
    },
    previewGradient: 'from-[#271c19] to-[#1a1210]'
  },
  {
    id: 'modern',
    name: 'Modern Slate',
    description: 'Clean, cool grey tones with high legibility. Ideal for non-fiction and essays.',
    styles: {
      background: '#f8fafc', // Slate-50
      color: '#334155', // Slate-700
      accent: '#475569', // Slate-600
      borderColor: '#cbd5e1'
    },
    fonts: {
      body: 'font-serif', 
      display: 'font-sans' 
    },
    previewGradient: 'from-[#f8fafc] to-[#e2e8f0]'
  },
  {
    id: 'dark_academia',
    name: 'Dark Academia',
    description: 'Moody, mysterious, and intellectual charcoal aesthetics.',
    styles: {
      background: '#1c1917',
      color: '#e7e5e4',
      accent: '#a8a29e',
      borderColor: '#44403c',
      bgImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-cinzel'
    },
    previewGradient: 'from-[#1c1917] to-[#0c0a09]'
  },
  {
    id: 'starlight_grid',
    name: 'Starlight Blueprint',
    description: 'A crisp, light technical grid. Perfect for hard Sci-Fi and futuristic concepts.',
    styles: {
      background: '#f0f9ff', // Sky-50
      color: '#0369a1', // Sky-700
      accent: '#0ea5e9', // Sky-500
      borderColor: '#bae6fd',
      // CSS-only grid pattern
      bgImage: "radial-gradient(#bae6fd 1px, transparent 1px)",
      bgSize: "20px 20px"
    },
    fonts: {
      body: 'font-sans',
      display: 'font-mono'
    },
    previewGradient: 'from-[#f0f9ff] to-[#e0f2fe]'
  },
  {
    id: 'velvet_letter',
    name: 'Velvet Letter',
    description: 'Elegant cream paper with a subtle regal pattern. Sophisticated and haunting.',
    styles: {
      background: '#fffdf5', // Amber-50 (very light)
      color: '#881337', // Rose-900 (Blood red ink)
      accent: '#9f1239', // Rose-700
      borderColor: '#fecdd3',
      bgImage: "url('https://www.transparenttextures.com/patterns/gplay.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-display'
    },
    previewGradient: 'from-[#fffdf5] to-[#ffe4e6]'
  },
  {
    id: 'sakura_bloom',
    name: 'Sakura Bloom',
    description: 'Delicate pinks with a soft floral texture. Ideal for Romance and Poetry.',
    styles: {
      background: '#fff1f2', // Rose-50
      color: '#4c0519', // Rose-950
      accent: '#fb7185', // Rose-400
      borderColor: '#fecdd3',
      bgImage: "url('https://www.transparenttextures.com/patterns/flower-trail.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-display'
    },
    previewGradient: 'from-[#fff1f2] to-[#fda4af]'
  },
  {
    id: 'herbalist',
    name: 'Herbalist Journal',
    description: 'Recycled paper texture with organic greens. For Nature and Growth stories.',
    styles: {
      background: '#fcfce3', // Light beige/yellowish
      color: '#14532d', // Green-900
      accent: '#65a30d', // Lime-600
      borderColor: '#d9f99d',
      bgImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')"
    },
    fonts: {
      body: 'font-sans',
      display: 'font-serif'
    },
    previewGradient: 'from-[#fcfce3] to-[#bef264]'
  },
  {
    id: 'glacial_min',
    name: 'Glacial Minimalist',
    description: 'Stark white with sharp blue undertones. High contrast for Thrillers.',
    styles: {
      background: '#ffffff',
      color: '#0f172a', // Slate-900
      accent: '#06b6d4', // Cyan-500
      borderColor: '#e2e8f0',
      bgImage: "url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')"
    },
    fonts: {
      body: 'font-sans',
      display: 'font-sans'
    },
    previewGradient: 'from-[#ffffff] to-[#cffafe]'
  },
  {
    id: 'celestial_palace',
    name: 'Celestial Palace',
    description: 'Majestic white marble with gold and royal purple accents. For High Fantasy.',
    styles: {
      background: '#fafafa', // Neutral-50
      color: '#4c1d95', // Violet-900
      accent: '#d4af37', // Gold
      borderColor: '#e9d5ff',
      bgImage: "url('https://www.transparenttextures.com/patterns/white-wall-3.png')"
    },
    fonts: {
      body: 'font-serif',
      display: 'font-display'
    },
    previewGradient: 'from-[#fafafa] to-[#f3e8ff]'
  }
];

export const getThemeById = (id: string): Theme => {
  return THEMES.find(t => t.id === id) || THEMES[0];
};
