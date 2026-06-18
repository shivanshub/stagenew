import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   DATA — replace with API/DB call later.
───────────────────────────────────────────────────────────────────────── */
interface CategoryItem {
  id: string;
  label: string;
  group: 'time' | 'type' | 'city' | 'format' | 'language';
}

const CATEGORY_STRIP_ITEMS: CategoryItem[] = [
  // Time
  { id: 'today',        label: 'Events Today',    group: 'time' },
  { id: 'tomorrow',     label: 'Tomorrow',         group: 'time' },
  { id: 'this-weekend', label: 'This Weekend',     group: 'time' },

  // Event Type
  { id: 'theatre',      label: 'Theatre',          group: 'type' },
  { id: 'comedy',       label: 'Comedy',           group: 'type' },
  { id: 'classical',    label: 'Classical Music',  group: 'type' },
  { id: 'dance',        label: 'Dance',            group: 'type' },
  { id: 'jazz-blues',   label: 'Jazz & Blues',     group: 'type' },
  { id: 'folk',         label: 'Folk',             group: 'type' },
  { id: 'opera',        label: 'Opera',            group: 'type' },
  { id: 'contemporary', label: 'Contemporary',     group: 'type' },
  { id: 'workshops',    label: 'Workshops',        group: 'type' },
  { id: 'kids-family',  label: 'Kids & Family',    group: 'type' },
  { id: 'sports',       label: 'Sports',           group: 'type' },
  { id: 'exhibitions',  label: 'Exhibitions',      group: 'type' },
  { id: 'nightlife',    label: 'Nightlife',        group: 'type' },

  // City
  { id: 'chandigarh',   label: 'Chandigarh',       group: 'city' },
  { id: 'mohali',       label: 'Mohali',           group: 'city' },
  { id: 'panchkula',    label: 'Panchkula',        group: 'city' },
  { id: 'zirakpur',     label: 'Zirakpur',         group: 'city' },
  { id: 'amritsar',     label: 'Amritsar',         group: 'city' },
  { id: 'delhi',        label: 'Delhi',            group: 'city' },
  { id: 'mumbai',       label: 'Mumbai',           group: 'city' },
  { id: 'bangalore',    label: 'Bangalore',        group: 'city' },
  { id: 'hyderabad',    label: 'Hyderabad',        group: 'city' },
  { id: 'pune',         label: 'Pune',             group: 'city' },
  { id: 'kolkata',      label: 'Kolkata',          group: 'city' },
  { id: 'jaipur',       label: 'Jaipur',           group: 'city' },

  // Format
  { id: 'free-rsvp',    label: 'Free RSVP',        group: 'format' },
  { id: 'premium',      label: 'Premium',          group: 'format' },
  { id: 'outdoor',      label: 'Outdoor',          group: 'format' },
  { id: 'virtual',      label: 'Virtual',          group: 'format' },

  // Language
  { id: 'hindi',        label: 'Hindi',            group: 'language' },
  { id: 'english',      label: 'English',          group: 'language' },
  { id: 'punjabi',      label: 'Punjabi',          group: 'language' },
  { id: 'bengali',      label: 'Bengali',          group: 'language' },
  { id: 'tamil',        label: 'Tamil',            group: 'language' },
  { id: 'telugu',       label: 'Telugu',           group: 'language' },
  { id: 'marathi',      label: 'Marathi',          group: 'language' },
];

const GROUP_ORDER: CategoryItem['group'][] = ['time', 'type', 'city', 'format', 'language'];

interface CategoryStripProps {
  onFilterChange?: (activeIds: string[]) => void;
}

export default function CategoryStrip({ onFilterChange }: CategoryStripProps) {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const toggle = (id: string) => {
    setActiveIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onFilterChange?.(Array.from(next));
      return next;
    });
  };

  const grouped = GROUP_ORDER.map(group => ({
    group,
    items: CATEGORY_STRIP_ITEMS.filter(c => c.group === group),
  }));

  return (
    <nav
      aria-label="Browse by category"
      className="w-full"
      style={{ background: '#14110D' }}
    >
      {/* Constrain to same width as Navbar */}
      <div className="max-w-container mx-auto px-6 md:px-10">
        {/* Fade edges sit inside the container — so they stop where the nav stops */}
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
            style={{ background: 'linear-gradient(to right, #14110D 60%, transparent)' }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
            style={{ background: 'linear-gradient(to left, #14110D 60%, transparent)' }}
          />

          {/* Scrollable row — no horizontal padding since container already has it */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount(-200)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center bg-transparent border-0 cursor-pointer text-[#C8A85F] hover:text-[#F7F4EE] transition-colors pl-0 pr-2"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount(200)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center bg-transparent border-0 cursor-pointer text-[#C8A85F] hover:text-[#F7F4EE] transition-colors pl-2 pr-0"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center overflow-x-auto relative z-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', height: '44px' }}
          >
            {grouped.map((g, gi) => (
              <div key={g.group} className="flex items-center flex-shrink-0">

                {/* Vertical group separator */}
                {gi > 0 && (
                  <span
                    className="mx-4 flex-shrink-0"
                    style={{ width: '1px', height: '14px', background: 'rgba(247,244,238,0.18)' }}
                  />
                )}

                {/* Items — plain text, no border, no pill */}
                {g.items.map((item, itemIdx) => {
                  const isActive = activeIds.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      aria-pressed={isActive}
                      className="flex-shrink-0 whitespace-nowrap font-sans transition-colors duration-150 bg-transparent border-0 cursor-pointer"
                      style={{
                      fontSize: '15px',
                        color: isActive ? '#C8A85F' : '#9E9690',
                        fontWeight: isActive ? 600 : 400,
                        padding: '0 11px',
                        borderRight: itemIdx < g.items.length - 1
                          ? '1px solid rgba(247,244,238,0.08)'
                          : 'none',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        nav[aria-label="Browse by category"] div::-webkit-scrollbar { display: none; }
      `}</style>
    </nav>
  );
}

