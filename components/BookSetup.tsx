
import React, { useState, useEffect } from 'react';
import { 
  Feather, Sparkles, ChevronLeft, ChevronRight, 
  Rocket, Wand, Search, Heart, Scroll, Cpu, Skull,
  Zap, Eye, MessageCircle, Library
} from 'lucide-react';
import { THEMES } from '../services/themes';

interface BookSetupProps {
  onStart: (details: { title: string, synopsis: string, genre: string, style: string, author: string, themeId: string }) => void;
}

const GENRE_CONFIG: Record<string, { icon: React.ElementType, desc: string }> = {
  "Science Fiction": { icon: Rocket, desc: "Space, Future, Tech" },
  "Fantasy": { icon: Wand, desc: "Magic, Dragons, Realms" },
  "Mystery / Thriller": { icon: Search, desc: "Crime, Suspense, Puzzle" },
  "Romance": { icon: Heart, desc: "Love, Passion, Drama" },
  "Historical Fiction": { icon: Scroll, desc: "Past, War, Legacy" },
  "Cyberpunk": { icon: Cpu, desc: "Dystopia, Neon, AI" },
  "Eldritch Horror": { icon: Skull, desc: "Cosmic, Terror, Madness" }
};

const STYLE_CONFIG: Record<string, { icon: React.ElementType, desc: string }> = {
  "Poetic & Descriptive": { icon: Feather, desc: "Lyrical prose, heavy imagery" },
  "Fast-paced & Action": { icon: Zap, desc: "Quick beats, high tension" },
  "Dark & Psychological": { icon: Eye, desc: "Internal monologue, moody" },
  "Witty & Humorous": { icon: MessageCircle, desc: "Sharp dialogue, satire" },
  "Classic & Formal": { icon: Library, desc: "Traditional, structured" }
};

const BookSetup: React.FC<BookSetupProps> = ({ onStart }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    synopsis: '',
    genre: 'Science Fiction',
    style: 'Poetic & Descriptive',
    themeId: 'classic'
  });

  const [themeIndex, setThemeIndex] = useState(0);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevTheme();
      if (e.key === 'ArrowRight') handleNextTheme();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNextTheme = () => {
    setThemeIndex((prev) => {
      const next = (prev + 1) % THEMES.length;
      setFormData(f => ({ ...f, themeId: THEMES[next].id }));
      return next;
    });
  };

  const handlePrevTheme = () => {
    setThemeIndex((prev) => {
      const next = (prev - 1 + THEMES.length) % THEMES.length;
      setFormData(f => ({ ...f, themeId: THEMES[next].id }));
      return next;
    });
  };

  const selectTheme = (index: number) => {
    setThemeIndex(index);
    setFormData(f => ({ ...f, themeId: THEMES[index].id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(formData);
  };

  // Helper to determine card positioning in the carousel
  const getCardStyle = (index: number) => {
    const len = THEMES.length;
    // Calculate shortest distance considering wrap-around
    let diff = (index - themeIndex + len) % len;
    if (diff > len / 2) diff -= len;
    
    const isActive = diff === 0;
    const isLeft = diff === -1;
    const isRight = diff === 1;

    let style: React.CSSProperties = {
      zIndex: 0,
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translateX(-50%) scale(0.8)',
      left: '50%',
    };
    
    let extraClasses = "hidden md:flex"; // Hide non-active cards on mobile

    if (isActive) {
      style = {
        zIndex: 20,
        opacity: 1,
        transform: 'translateX(-50%) scale(1)',
        left: '50%',
        pointerEvents: 'auto'
      };
      extraClasses = "flex shadow-[0_0_50px_rgba(212,175,55,0.15)]";
    } else if (isLeft) {
      style = {
        zIndex: 10,
        opacity: 0.4,
        transform: 'translateX(-120%) scale(0.85) rotateY(15deg)', // Push further left
        left: '50%',
        pointerEvents: 'auto',
        cursor: 'pointer'
      };
    } else if (isRight) {
      style = {
        zIndex: 10,
        opacity: 0.4,
        transform: 'translateX(20%) scale(0.85) rotateY(-15deg)', // Push further right
        left: '50%',
        pointerEvents: 'auto',
        cursor: 'pointer'
      };
    }

    return { style, extraClasses, isActive };
  };

  return (
    <div className="min-h-screen bg-paper-900 text-paper-100 overflow-y-auto pb-20 font-sans selection:bg-gold-500/30">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-ink-900 border border-ink-500 rounded-full mb-6 shadow-2xl shadow-gold-600/10">
            <Feather className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-paper-50 mb-4 tracking-tight">Epica</h1>
          <p className="text-ink-400 text-lg font-serif italic">"The AI Architect of Worlds"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-20">
          
          {/* 1. The Basics */}
          <section className="animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-8 border-b border-ink-800 pb-2">I. The Foundation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-sm font-medium text-ink-400 mb-2 group-focus-within:text-gold-500 transition-colors">Book Title</label>
                <input
                  required
                  type="text"
                  placeholder="The Last Starship"
                  className="w-full bg-ink-900/50 border border-ink-700 rounded-xl px-6 py-4 text-xl font-display text-paper-50 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-ink-700"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-ink-400 mb-2 group-focus-within:text-gold-500 transition-colors">Author Name</label>
                <input
                  required
                  type="text"
                  placeholder="Isaac Asimov"
                  className="w-full bg-ink-900/50 border border-ink-700 rounded-xl px-6 py-4 text-xl font-display text-paper-50 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all placeholder:text-ink-700"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* 2. Visual Theme Carousel */}
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="max-w-4xl mx-auto flex justify-between items-end mb-8 border-b border-ink-800 pb-2">
               <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest">II. Visual Experience</h2>
               <div className="text-xs text-ink-500 hidden md:block">Use Arrow Keys to Navigate</div>
            </div>
            
            <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden perspective-1000">
              
              {/* Navigation Buttons */}
              <button 
                type="button"
                onClick={handlePrevTheme}
                className="absolute left-4 md:left-20 z-30 p-4 rounded-full bg-black/50 text-paper-100 border border-ink-700 hover:border-gold-500 hover:text-gold-500 transition-all backdrop-blur-md"
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                type="button"
                onClick={handleNextTheme}
                className="absolute right-4 md:right-20 z-30 p-4 rounded-full bg-black/50 text-paper-100 border border-ink-700 hover:border-gold-500 hover:text-gold-500 transition-all backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>

              {/* Cards */}
              {THEMES.map((theme, index) => {
                const { style, extraClasses, isActive } = getCardStyle(index);
                
                return (
                  <div 
                    key={theme.id}
                    onClick={() => !isActive && selectTheme(index)}
                    className={`absolute top-10 w-[85%] md:w-[380px] h-[400px] rounded-2xl border-2 transition-all duration-500 ease-out flex flex-col overflow-hidden bg-ink-900 ${extraClasses}`}
                    style={{ 
                      ...style, 
                      borderColor: isActive ? theme.styles.accent : theme.styles.borderColor,
                      background: `linear-gradient(135deg, ${theme.styles.background} 0%, #000 100%)` 
                    }}
                  >
                    {/* Card Content */}
                    <div 
                       className={`flex-1 p-8 flex flex-col items-center text-center relative ${theme.fonts.body}`}
                       style={{ color: theme.styles.color }}
                    >
                       {/* Background Preview Gradient */}
                       <div className={`absolute inset-0 bg-gradient-to-br ${theme.previewGradient} opacity-50`}></div>
                       
                       <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                          <div className="mb-6 transform transition-transform duration-700 group-hover:scale-110">
                            <span className={`text-7xl ${theme.fonts.display}`} style={{ color: theme.styles.accent }}>Aa</span>
                          </div>
                          
                          <h3 className={`text-3xl font-bold mb-3 ${theme.fonts.display}`}>
                            {theme.name}
                          </h3>
                          
                          <p className="text-sm opacity-80 leading-relaxed mb-6">
                            {theme.description}
                          </p>

                          {isActive && (
                            <div className="px-4 py-1 rounded-full text-[10px] uppercase tracking-widest border border-current opacity-60">
                              Selected
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-3">
              {THEMES.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTheme(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === themeIndex ? 'w-8 bg-gold-500' : 'w-2 bg-ink-700 hover:bg-ink-500'}`}
                />
              ))}
            </div>
          </section>

          {/* 3. Genre & Style (Interactive Grid) */}
          <section className="animate-fade-in max-w-5xl mx-auto" style={{ animationDelay: '0.3s' }}>
             <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-8 border-b border-ink-800 pb-2">III. The Composition</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Genre Grid */}
                <div>
                   <label className="block text-sm font-medium text-ink-400 mb-4">Select Genre</label>
                   <div className="grid grid-cols-2 gap-3">
                      {Object.entries(GENRE_CONFIG).map(([name, config]) => {
                        const Icon = config.icon;
                        const isSelected = formData.genre === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setFormData({ ...formData, genre: name })}
                            className={`relative p-4 rounded-xl border text-left transition-all duration-300 group overflow-hidden ${
                              isSelected
                              ? 'bg-gold-600/10 border-gold-500 text-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                              : 'bg-ink-900/40 border-ink-800 text-ink-400 hover:border-ink-600 hover:bg-ink-800/60'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Icon size={20} className={isSelected ? 'text-gold-500' : 'text-ink-500 group-hover:text-ink-300'} />
                              {isSelected && <div className="h-2 w-2 rounded-full bg-gold-500 shadow-[0_0_5px_#d4af37]"></div>}
                            </div>
                            <div className="font-bold text-sm mb-0.5">{name}</div>
                            <div className="text-[10px] opacity-60 font-medium">{config.desc}</div>
                          </button>
                        );
                      })}
                   </div>
                </div>

                {/* Style Grid */}
                <div>
                   <label className="block text-sm font-medium text-ink-400 mb-4">Select Writing Style</label>
                   <div className="space-y-3">
                      {Object.entries(STYLE_CONFIG).map(([name, config]) => {
                        const Icon = config.icon;
                        const isSelected = formData.style === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setFormData({ ...formData, style: name })}
                            className={`w-full flex items-center p-4 rounded-xl border text-left transition-all duration-300 group ${
                              isSelected
                              ? 'bg-gold-600/10 border-gold-500 text-gold-500' 
                              : 'bg-ink-900/40 border-ink-800 text-ink-400 hover:border-ink-600 hover:bg-ink-800/60'
                            }`}
                          >
                            <div className={`p-2 rounded-lg mr-4 ${isSelected ? 'bg-gold-500/20' : 'bg-black/20'}`}>
                               <Icon size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-sm">{name}</div>
                              <div className="text-[10px] opacity-60">{config.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                   </div>
                </div>
             </div>
          </section>

          {/* 4. The Premise */}
          <section className="animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-8 border-b border-ink-800 pb-2">IV. The Seed</h2>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-600/20 to-ink-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <textarea
                required
                rows={4}
                placeholder="Describe your story idea here... (e.g., A robot discovers it has a soul during a mission to Mars)"
                className="relative w-full bg-ink-900/80 border border-ink-700 rounded-xl px-6 py-6 text-lg text-paper-50 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all resize-none placeholder:text-ink-700 leading-relaxed font-serif"
                style={{ fontFamily: '"Crimson Pro", serif' }}
                value={formData.synopsis}
                onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
              />
              <Sparkles className="absolute right-4 top-4 text-ink-700 w-5 h-5 pointer-events-none group-focus-within:text-gold-500 transition-colors" />
            </div>
            <p className="text-right text-xs text-ink-500 mt-2">Epica will expand this into {THEMES[themeIndex].name.toLowerCase()} format.</p>
          </section>

          <div className="max-w-md mx-auto pt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold py-6 rounded-xl text-xl transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 active:scale-95"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>Begin Authorship</span>
            </button>
            <p className="text-center text-[10px] text-ink-600 mt-4 uppercase tracking-widest">
              AI Powered • Generative • Infinite
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookSetup;
