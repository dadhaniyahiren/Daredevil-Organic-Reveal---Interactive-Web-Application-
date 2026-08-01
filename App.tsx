
import React from 'react';
import RevealFrame from './components/RevealFrame';

const App: React.FC = () => {
  // Image A: Base identity (Matt Murdock - The Masked/Initial layer)
  // Image B: Revealed identity (Daredevil - The hidden layer revealed by cursor)
  const imageA = "/Image/Image A.jpg";
  const imageB = "/Image/Image B.jpg";

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-red-600 drop-shadow-md">
            Dare Devil
          </h1>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 pointer-events-auto">
          <a href="#" className="hover:text-red-500 transition-colors">Vigilante</a>
          <a href="#" className="hover:text-red-500 transition-colors">Lawyer</a>
          <a href="#" className="hover:text-red-500 transition-colors">Justice</a>
        </div>
      </nav>

      {/* Full-Screen Interactive Frame */}
      <main className="flex-1 w-full h-full">
        <RevealFrame 
          imageA={imageA} 
          imageB={imageB} 
        />
      </main>

      {/* Dynamic Info Overlay */}
      <div className="fixed bottom-8 left-8 z-20 pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase opacity-50">Current Location</span>
          <span className="text-xs text-red-500 font-bold tracking-widest uppercase">Hell's Kitchen, NY</span>
        </div>
      </div>
    </div>
  );
};

export default App;
