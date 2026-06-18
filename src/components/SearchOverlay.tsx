import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center pt-[15vh] px-4 transition-opacity duration-200"
      aria-modal="true"
      role="dialog"
      aria-label="Search events"
    >
      {/* Scrim */}
      <div 
        className="absolute inset-0 bg-[#14110D]/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[700px] flex flex-col gap-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-[#8A8278] hover:text-[#F7F4EE] transition-colors flex items-center gap-2 text-sm"
          aria-label="Close search"
        >
          <span className="hidden sm:inline">Esc to close</span>
          <X size={24} />
        </button>

        {/* Search Input Box */}
        <div className="relative">
          <Search size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8A8278]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search events, artists, venues..."
            className="w-full h-[72px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[12px] pl-[64px] pr-6 text-[20px] font-serif placeholder:text-[#8A8278] focus:outline-none focus:border-[#C8A85F] transition-colors shadow-2xl"
          />
        </div>

        {/* Suggestions */}
        <div className="px-2">
          <div className="mb-8">
            <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8278] mb-4">
              Recent searches
            </h3>
            <div className="flex flex-col gap-3">
              {['Raag Yaman', 'Between Two Worlds', 'Canvas Laugh Club'].map(term => (
                <button key={term} className="text-left font-sans text-[#C9C1B2] hover:text-[#C8A85F] text-[15px] transition-colors flex items-center gap-3">
                  <Search size={14} className="opacity-50" />
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8278] mb-4">
              Popular categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Theatre', 'Comedy', 'Classical Music', 'Dance', 'Jazz'].map(cat => (
                <button key={cat} className="px-4 py-2 border border-[rgba(247,244,238,0.1)] text-[#C9C1B2] rounded-full text-[13px] hover:border-[#C8A85F] hover:text-[#F7F4EE] transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
