
import React, { useEffect, useRef } from 'react';
import { Book, GenerationProgress } from '../types';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { getThemeById } from '../services/themes';

interface LiveWriterProps {
  book: Book;
  progress: GenerationProgress;
}

const LiveWriter: React.FC<LiveWriterProps> = ({ book, progress }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showOutline, setShowOutline] = React.useState(false);
  const theme = getThemeById(book.themeId || 'classic');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [book.chapters[book.currentChapterIndex]?.content]);

  const currentChapter = book.chapters[book.currentChapterIndex];

  // Helper to safely render Markdown formatting
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold opacity-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic opacity-90">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black overflow-hidden">
      
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowOutline(!showOutline)}
        className="md:hidden fixed top-4 left-4 z-50 bg-paper-900 border border-gold-500 text-gold-500 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-bold"
      >
        <span>{showOutline ? '📖 Hide' : '📋 Outline'}</span>
      </button>

      {/* Left Panel: The Blueprint (Outline) - Collapsible on mobile */}
      <div className={`
        ${showOutline ? 'fixed inset-0 z-40' : 'hidden'} 
        md:relative md:flex
        w-full md:w-1/3 md:border-r border-ink-900 bg-paper-900 p-4 md:p-6 flex-col shadow-2xl
        md:max-h-none overflow-y-auto
      `}>
        <div className="mb-4 md:mb-6 mt-12 md:mt-0">
          <h2 className="text-gold-500 font-display text-lg md:text-xl mb-1 truncate">{book.title}</h2>
          <p className="text-ink-500 text-xs uppercase tracking-widest">Master Plan</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 md:space-y-4 pr-2 custom-scrollbar">
          {book.chapters.map((chapter, idx) => (
            <div 
              key={idx} 
              className={`p-3 md:p-4 rounded border transition-all duration-500 ${
                chapter.isFinished 
                  ? 'border-green-900/50 bg-green-900/10 opacity-50' 
                  : idx === book.currentChapterIndex 
                    ? 'border-gold-500 bg-gold-500/10 md:scale-105 shadow-lg shadow-gold-900/20' 
                    : 'border-ink-800 bg-ink-900/50 text-ink-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <span className="text-[10px] md:text-xs font-mono uppercase">Chapter {chapter.number}</span>
                {chapter.isFinished ? <CheckCircle2 size={12} className="text-green-500 md:w-[14px] md:h-[14px]"/> : 
                 idx === book.currentChapterIndex ? <Loader2 size={12} className="text-gold-500 animate-spin md:w-[14px] md:h-[14px]"/> : 
                 <Circle size={12} className="md:w-[14px] md:h-[14px]" />}
              </div>
              <h3 className="font-serif font-bold text-xs md:text-sm mb-1 line-clamp-1">{chapter.title}</h3>
              <p className="text-[10px] md:text-xs line-clamp-1 md:line-clamp-2 opacity-70">{chapter.summary}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 md:mt-6 pt-3 md:pt-6 border-t border-ink-800">
           <div className="flex justify-between text-[10px] md:text-xs text-gold-500 mb-2 font-mono">
              <span className="truncate max-w-[60%]">{progress.stage}</span>
              <span>{Math.round(progress.percent)}%</span>
           </div>
           <div className="w-full bg-ink-900 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-gold-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
           </div>
           <p className="text-center text-ink-600 text-[9px] md:text-[10px] mt-2 animate-pulse font-mono truncate">
             {progress.currentAction}
           </p>
        </div>
      </div>

      {/* Right Panel: The Typewriter - DYNAMIC THEME APPLIED HERE */}
      <div 
        className={`flex-1 p-4 pt-16 md:pt-8 md:p-8 lg:p-16 overflow-y-auto relative transition-colors duration-1000 ease-in-out ${theme.fonts.body}`}
        ref={scrollRef}
        style={{
          backgroundColor: theme.styles.background,
          color: theme.styles.color,
          backgroundImage: theme.styles.bgImage,
          backgroundSize: theme.styles.bgSize || 'auto',
          backgroundRepeat: 'repeat'
        }}
      >
        
        <div className="max-w-3xl mx-auto relative z-10 min-h-full">
          {book.status === 'planning' ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6 opacity-70">
              <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin" style={{ color: theme.styles.accent }} />
              <p className={`text-lg md:text-2xl animate-pulse ${theme.fonts.display} text-center px-4`} style={{ color: theme.styles.accent }}>
                Consulting the Muses...
              </p>
            </div>
          ) : (
            <>
               <div className="text-center mb-8 md:mb-12 border-b-2 pb-6 md:pb-8" style={{ borderColor: theme.styles.borderColor }}>
                  <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.2em] uppercase mb-3 md:mb-4 block opacity-60">Chapter {currentChapter?.number}</span>
                  <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-4 px-2 ${theme.fonts.display}`} style={{ color: theme.styles.color }}>{currentChapter?.title}</h1>
               </div>

               <div className={`prose prose-base md:prose-lg max-w-none leading-relaxed text-base md:text-lg ${theme.fonts.body}`} style={{ color: theme.styles.color }}>
                  {/* Render previous paragraphs */}
                  {currentChapter?.content.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-6 whitespace-pre-wrap animate-fade-in">
                      {renderFormattedText(para)}
                    </p>
                  ))}
                  
                  {/* Cursor */}
                  {!currentChapter?.isFinished && (
                    <span 
                      className="inline-block w-2 h-5 animate-typewriter align-middle ml-1"
                      style={{ backgroundColor: theme.styles.accent }}
                    ></span>
                  )}
               </div>

               {currentChapter?.illustration && (
                 <div className="my-8 md:my-12 p-2 md:p-4 bg-white/5 shadow-xl rotate-1 transition-transform hover:rotate-0 duration-500">
                    <img 
                      src={`data:image/png;base64,${currentChapter.illustration}`} 
                      alt="Chapter Illustration" 
                      className="w-full h-auto"
                      style={{ filter: book.themeId === 'vintage' ? 'sepia(0.6)' : 'none' }}
                    />
                    <p className="text-center text-[10px] md:text-xs font-sans mt-2 tracking-widest opacity-60">FIG {currentChapter.number}.1</p>
                 </div>
               )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default LiveWriter;
