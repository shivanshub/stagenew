import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Music, Theater, Mic2, Zap, BookOpen, Baby, Dumbbell, Palette, Moon } from 'lucide-react';

/* ── Date quick-select ─────────────────────────────────── */
type DateFilter = 'today' | 'tomorrow' | 'this-weekend' | null;

const DATE_PILLS: { id: DateFilter; label: string }[] = [
  { id: 'today',        label: 'Today' },
  { id: 'tomorrow',     label: 'Tomorrow' },
  { id: 'this-weekend', label: 'This Weekend' },
];

/* ── Visual genre tiles (DB-ready) ────────────────────── */
const GENRE_TILES = [
  { id: 'theatre',     label: 'Theatre',        icon: Theater, count: '89 events'  },
  { id: 'comedy',      label: 'Comedy',         icon: Mic2,    count: '52 events'  },
  { id: 'classical',   label: 'Classical Music', icon: Music,   count: '143 events' },
  { id: 'dance',       label: 'Dance',          icon: Zap,     count: '67 events'  },
  { id: 'workshops',   label: 'Workshops',      icon: BookOpen, count: '31 events' },
  { id: 'kids-family', label: 'Kids & Family',  icon: Baby,    count: '24 events'  },
  { id: 'sports',      label: 'Sports',         icon: Dumbbell, count: '18 events' },
  { id: 'exhibitions', label: 'Exhibitions',    icon: Palette, count: '29 events'  },
  { id: 'nightlife',   label: 'Nightlife',      icon: Moon,    count: '41 events'  },
];

export default function BrowseSection() {
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilter>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleDate = (id: DateFilter) => {
    setActiveDateFilter(prev => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#14110D] text-[#F7F4EE] pb-[80px] pt-10">
      <div className="max-w-container mx-auto px-6 md:px-10">

        {/* ── Heading ──────────────────────────────────── */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <span className="h-px w-7 bg-[#C8A85F] inline-block" />
            <span className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-[#C8A85F]">
              Find an event
            </span>
          </div>
          <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] m-0 text-[32px] md:text-[40px] text-[#F7F4EE]">
            Browse <em className="italic">events</em>
          </h2>
        </div>

        {/* ── Date Quick-Select Pills ───────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {DATE_PILLS.map(pill => {
            const isActive = activeDateFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => toggleDate(pill.id)}
                aria-pressed={isActive}
                className="h-[36px] px-5 rounded-full text-[13px] font-sans font-medium transition-all duration-150"
                style={{
                  border: isActive ? '1px solid #C8A85F' : '1px solid rgba(247,244,238,0.15)',
                  color: isActive ? '#C8A85F' : '#C9C1B2',
                  background: isActive ? 'rgba(200,168,95,0.1)' : 'transparent',
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* ── Search Bar Container ──────────────────────── */}
        <div
          role="search"
          className="rounded-[8px] p-4 max-w-[920px] mb-10"
          style={{ background: 'rgba(20, 17, 13, 0.4)', border: '1px solid rgba(247, 244, 238, 0.1)' }}
        >
          <div className="flex flex-col md:flex-row gap-3">

            {/* Query Input */}
            <div className="relative flex-1">
              <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5550]">
                <Search size={18} strokeWidth={1.5} />
              </span>
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                className="w-full h-[52px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[4px] pl-[44px] pr-4 text-[14px] font-sans placeholder:text-[#8A8278] focus:outline-none focus:border-[#C8A85F] transition-colors"
              />
            </div>

            {/* Location Button */}
            <button
              type="button"
              className="h-[52px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[4px] px-4 text-[14px] font-sans flex items-center justify-between min-w-[180px] hover:border-[#C8A85F] transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-[#5A5550]" />
                All Cities
              </span>
              <span className="text-[10px] opacity-60">▼</span>
            </button>

            {/* Search Submit */}
            <button
              type="button"
              className="h-[52px] bg-[#C8A85F] text-[#14110D] font-sans font-bold text-[12px] tracking-[0.15em] uppercase rounded-[4px] px-8 hover:bg-[#D4B570] transition-colors flex items-center justify-center gap-2 flex-shrink-0"
            >
              <Search size={16} strokeWidth={2.5} />
              Search
            </button>
          </div>
        </div>

        {/* ── Visual Genre Tiles ────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-5 bg-[rgba(247,244,238,0.15)] inline-block" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5A5550]">
              Browse by category
            </span>
          </div>

          {/* Mobile: horizontal scroll row — Desktop: multi-column grid */}
          <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
            {/* Horizontal scroll on mobile */}
            <div
              className="flex gap-3 overflow-x-auto md:hidden pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {GENRE_TILES.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeGenre === id;
                const isHovered = hoveredId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveGenre(prev => (prev === id ? null : id))}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-pressed={isActive}
                    className="flex-shrink-0 flex flex-col items-center gap-3 py-5 px-4 rounded-[12px] transition-all duration-200 w-[110px]"
                    style={{
                      border: isActive ? '1px solid #C8A85F' : isHovered ? '1px solid rgba(200,168,95,0.5)' : '1px solid rgba(200,168,95,0.15)',
                      background: isActive
                        ? 'rgba(200,168,95,0.10)'
                        : isHovered
                        ? 'linear-gradient(160deg, rgba(34,29,22,0.95) 0%, rgba(20,17,13,0.95) 100%)'
                        : 'linear-gradient(160deg, rgba(34,29,22,0.7) 0%, rgba(20,17,13,0.6) 100%)',
                      transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    <span
                      className="w-12 h-12 rounded-full grid place-items-center transition-all duration-200"
                      style={{
                        background: isActive || isHovered ? 'rgba(200,168,95,0.14)' : 'rgba(200,168,95,0.07)',
                        border: isActive || isHovered ? '1px solid rgba(200,168,95,0.6)' : '1px solid rgba(200,168,95,0.25)',
                        color: '#C8A85F',
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <span
                      className="font-sans text-[13px] font-medium text-center leading-tight transition-colors duration-200"
                      style={{ color: isActive ? '#C8A85F' : isHovered ? '#F7F4EE' : '#D4CEC8' }}
                    >
                      {label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.08em] text-[#5A5550]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-9 gap-2">
              {GENRE_TILES.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeGenre === id;
                const isHovered = hoveredId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveGenre(prev => (prev === id ? null : id))}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-pressed={isActive}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-[8px] transition-all duration-150"
                    style={{
                      border: isActive ? '1px solid #C8A85F' : isHovered ? '1px solid rgba(200,168,95,0.5)' : '1px solid rgba(200,168,95,0.15)',
                      background: isActive
                        ? 'rgba(200,168,95,0.08)'
                        : isHovered
                        ? 'linear-gradient(160deg, rgba(34,29,22,0.9) 0%, rgba(20,17,13,0.7) 100%)'
                        : 'linear-gradient(160deg, rgba(34,29,22,0.5) 0%, rgba(20,17,13,0.3) 100%)',
                      transform: isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    <span
                      className="w-10 h-10 rounded-full grid place-items-center transition-all duration-150"
                      style={{
                        border: isActive || isHovered ? '1px solid rgba(200,168,95,0.6)' : '1px solid rgba(200,168,95,0.25)',
                        color: '#C8A85F',
                        background: isActive || isHovered ? 'rgba(200,168,95,0.12)' : 'rgba(200,168,95,0.05)',
                      }}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <span
                      className="font-sans text-[11px] text-center leading-tight transition-colors duration-150"
                      style={{ color: isActive ? '#C8A85F' : isHovered ? '#F7F4EE' : '#C9C1B2' }}
                    >
                      {label}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.1em] text-[#5A5550]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
