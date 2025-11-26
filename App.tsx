
import React, { useState, useRef } from 'react';
import { Book, GenerationProgress, ViewState } from './types';
import { generateOutline, writeChapter, generateIllustration } from './services/ai';

// Components
import BookSetup from './components/BookSetup';
import LiveWriter from './components/LiveWriter';
import BookReader from './components/BookReader';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SETUP);
  const [book, setBook] = useState<Book | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({ stage: '', percent: 0, currentAction: '' });
  
  const bookRef = useRef<Book | null>(null);

  const startWriting = async (details: { title: string, synopsis: string, genre: string, style: string, author: string, themeId: string }) => {
    const newBook: Book = {
      id: Math.random().toString(36).substring(2),
      ...details,
      createdAt: new Date().toLocaleDateString(),
      chapters: [],
      status: 'planning',
      totalChapters: 0,
      currentChapterIndex: 0
    };

    setBook(newBook);
    bookRef.current = newBook;
    setView(ViewState.WRITING);

    try {
      // 1. Planning Phase
      setProgress({ stage: 'Architecting', percent: 5, currentAction: 'Designing chapter outline and theme...' });
      const { chapters, quote } = await generateOutline(details.title, details.synopsis, details.genre, details.style);
      
      const plannedBook = { 
        ...newBook, 
        chapters: chapters, 
        quote: quote,
        totalChapters: chapters.length, 
        status: 'writing' as const 
      };
      setBook(plannedBook);
      bookRef.current = plannedBook;

      // 2. Writing Loop
      let runningSummary = `The story begins. ${details.synopsis}`;

      for (let i = 0; i < chapters.length; i++) {
        setBook(prev => prev ? { ...prev, currentChapterIndex: i } : null);
        setProgress({ 
          stage: `Writing Chapter ${i + 1}/${chapters.length}`, 
          percent: 10 + ((i / chapters.length) * 80), 
          currentAction: `Drafting: ${chapters[i].title}` 
        });

        const { content, newSummary } = await writeChapter(bookRef.current!, i, runningSummary);
        
        runningSummary += `\nChapter ${i+1} Summary: ${newSummary}`;

        let imageBase64: string | undefined = undefined;
        // Generate images for 6 chapters total (every other chapter)
        // Chapters: 0, 2, 4, 6, 8, 10 (6 images for 12 chapters)
        if (i % 2 === 0) {
           setProgress(prev => ({ ...prev, currentAction: `Illustrating Chapter ${i + 1}...` }));
           imageBase64 = await generateIllustration(content, details.genre);
        }

        const updatedChapters = [...bookRef.current!.chapters];
        updatedChapters[i] = {
          ...updatedChapters[i],
          content: content,
          summary: newSummary,
          illustration: imageBase64,
          isFinished: true
        };

        const updatedBook = { ...bookRef.current!, chapters: updatedChapters };
        setBook(updatedBook);
        bookRef.current = updatedBook;

        await new Promise(r => setTimeout(r, 1000)); 
      }

      // 3. Finish
      setBook(prev => prev ? { ...prev, status: 'completed' } : null);
      setProgress({ stage: 'Binding Book', percent: 100, currentAction: 'Finalizing formatting...' });
      setTimeout(() => setView(ViewState.READING), 2000);

    } catch (e) {
      console.error(e);
      setBook(prev => prev ? { ...prev, status: 'failed' } : null);
      alert("The muse was interrupted (API Error). Please try again.");
      setView(ViewState.SETUP);
    }
  };

  return (
    <div className="min-h-screen bg-paper-900 text-paper-100 font-sans selection:bg-gold-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {view === ViewState.SETUP && <BookSetup onStart={startWriting} />}
      {view === ViewState.WRITING && book && <LiveWriter book={book} progress={progress} />}
      {view === ViewState.READING && book && <BookReader book={book} onReset={() => setView(ViewState.SETUP)} />}
    </div>
  );
};

export default App;
