
import React, { useEffect } from 'react';
import { Book } from '../types';
import { Download, BookOpen } from 'lucide-react';
import { getThemeById } from '../services/themes';

interface BookReaderProps {
  book: Book;
  onReset: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onReset }) => {
  const theme = getThemeById(book.themeId || 'classic');

  // Set CSS variables for printing when this component mounts
  useEffect(() => {
    document.documentElement.style.setProperty('--print-bg', theme.styles.background);
    document.documentElement.style.setProperty('--print-text', theme.styles.color);
    
    return () => {
      document.documentElement.style.removeProperty('--print-bg');
      document.documentElement.style.removeProperty('--print-text');
    }
  }, [theme]);
  
  const handleDownload = () => {
    window.print();
  };

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
    <div className="min-h-screen overflow-y-auto print:overflow-visible">
      
      {/* Navigation Bar (Hidden when printing) */}
      <nav className="sticky top-0 z-50 bg-[#1c1917] text-white p-4 shadow-xl no-print">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-gold-500" />
            <span className="font-display font-bold text-lg hidden md:inline">Epica Library</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onReset}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Write Another
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black px-6 py-2 rounded font-bold transition-transform hover:scale-105"
            >
              <Download size={18} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Book Content - The "print-bg-force" class is crucial for the print CSS we added in index.html */}
      <main 
        className={`max-w-4xl mx-auto min-h-screen shadow-2xl my-0 md:my-10 p-8 md:p-24 print-bg-force transition-colors duration-500 ${theme.fonts.body}`}
        style={{
          backgroundColor: theme.styles.background,
          color: theme.styles.color,
          backgroundImage: theme.styles.bgImage,
          backgroundSize: theme.styles.bgSize || 'auto',
          backgroundRepeat: 'repeat'
        }}
      >
        
        {/* Title Page */}
        <section 
           className="min-h-[90vh] print:min-h-[250mm] flex flex-col justify-center items-center text-center page-break mb-20 print:mb-0 relative border-b-2 print:border-b-4"
           style={{ borderColor: theme.styles.borderColor }}
        >
          <div className="absolute inset-0 border-4 border-double m-4 pointer-events-none opacity-20" style={{ borderColor: theme.styles.color }}></div>
          
          <h1 className={`text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tighter ${theme.fonts.display}`} style={{ color: theme.styles.color }}>
            {book.title}
          </h1>
          
          <div className="w-24 h-1 mb-8" style={{ backgroundColor: theme.styles.accent }}></div>
          
          <p className="text-2xl italic mb-20 opacity-80">by {book.author}</p>
          
          <div className="max-w-md mx-auto mt-auto mb-10">
             <p className="text-lg italic text-center opacity-70">
               {book.quote || '"A story waiting to be told."'}
             </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="mb-24 print:mb-0 page-break px-4 md:px-12 print:px-0">
          <h2 className={`text-3xl font-bold text-center mb-12 uppercase tracking-widest ${theme.fonts.display}`} style={{ color: theme.styles.accent }}>Table of Contents</h2>
          <div className="space-y-4 max-w-xl mx-auto">
            {book.chapters.map((chapter) => (
              <div key={chapter.number} className="flex justify-between items-baseline border-b pb-2" style={{ borderColor: theme.styles.borderColor }}>
                <span className="text-lg"><span className="font-bold mr-4" style={{ color: theme.styles.accent }}>{chapter.number}.</span> {chapter.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Chapters */}
        {book.chapters.map((chapter) => (
          <article key={chapter.number} className="page-break mb-20 print:mb-0">
            
            {/* Chapter Header */}
            <div className="text-center mb-12 mt-12 print:mt-0 print:mb-8">
              <span className="block text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-50">Chapter {chapter.number}</span>
              <h2 className={`text-4xl print:text-3xl font-bold ${theme.fonts.display}`} style={{ color: theme.styles.color }}>{chapter.title}</h2>
            </div>

            {/* Illustration */}
            {chapter.illustration && (
              <figure className="mb-12 print:mb-8 break-inside-avoid page-break-inside-avoid">
                <img 
                  src={`data:image/png;base64,${chapter.illustration}`} 
                  className="w-full h-auto shadow-lg print:shadow-none" 
                  style={{ filter: book.themeId === 'vintage' ? 'sepia(0.6)' : 'none' }}
                  alt={`Illustration for Chapter ${chapter.number}`} 
                />
              </figure>
            )}

            {/* Content */}
            <div className="prose prose-xl print:prose-lg max-w-none text-justify leading-relaxed print:leading-normal" style={{ color: theme.styles.color }}>
               {chapter.content.split('\n\n').map((para, i) => {
                 if (i === 0) {
                    const firstLetter = para.charAt(0).replace(/[*]/g, ''); 
                    const rest = para.slice(1);
                    return (
                        <p key={i}>
                            <span 
                              className={`float-left text-7xl font-bold leading-[0.8] mr-3 mt-1 ${theme.fonts.display}`}
                              style={{ color: theme.styles.accent }}
                            >
                                {firstLetter}
                            </span>
                            {renderFormattedText(rest)}
                        </p>
                    )
                 }
                 return <p key={i}>{renderFormattedText(para)}</p>
               })}
            </div>

            <div className="flex justify-center mt-12 mb-12 print:mt-8 print:mb-8">
               <span className="text-xl" style={{ color: theme.styles.accent }}>❦</span>
            </div>

          </article>
        ))}

        {/* End Page */}
        <section className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className={`text-2xl font-bold mb-4 ${theme.fonts.display}`}>The End</h3>
        </section>

      </main>
    </div>
  );
};

export default BookReader;
