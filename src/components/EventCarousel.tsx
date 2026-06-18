import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import type { Event } from '../data/events';
import { CATEGORIES } from '../data/events';

interface EventCarouselProps {
  events: Event[];
  title?: string;
  subtitle?: string;
}

export default function EventCarousel({ events, title = 'Upcoming Events', subtitle }: EventCarouselProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="events" aria-label={title} className="py-16 md:py-24">
      <div className="max-w-container mx-auto px-6 md:px-10">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p
              className="font-sans text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: '#C8A85F', letterSpacing: '0.22em' }}
            >
              What's On
            </p>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-[-0.02em] m-0"
              style={{ color: '#F7F4EE', fontSize: 'clamp(28px,3vw,38px)' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-sm mt-2" style={{ color: '#8A7D64' }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop scroll arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll events left"
              className="btn-press w-10 h-10 flex items-center justify-center border transition-colors"
              style={{ borderColor: '#3A3026', color: '#C4B896', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8A85F'; (e.currentTarget as HTMLElement).style.color = '#C8A85F'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3026'; (e.currentTarget as HTMLElement).style.color = '#C4B896'; }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll events right"
              className="btn-press w-10 h-10 flex items-center justify-center border transition-colors"
              style={{ borderColor: '#3A3026', color: '#C4B896', background: 'transparent' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8A85F'; (e.currentTarget as HTMLElement).style.color = '#C8A85F'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3026'; (e.currentTarget as HTMLElement).style.color = '#C4B896'; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6"
          role="tablist"
          aria-label="Filter by genre"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="btn-press flex-shrink-0 font-sans text-xs font-medium tracking-wide px-4 py-2 border transition-all duration-200 min-h-[36px]"
              style={{
                borderColor: activeCategory === cat ? '#C8A85F' : '#3A3026',
                background: activeCategory === cat ? 'rgba(200,168,95,0.12)' : 'transparent',
                color: activeCategory === cat ? '#C8A85F' : '#8A7D64',
                letterSpacing: '0.05em',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-2"
          aria-live="polite"
        >
          {filtered.length === 0 ? (
            <p className="font-sans text-sm py-12" style={{ color: '#8A7D64' }}>
              No events in this category right now. Check back soon.
            </p>
          ) : (
            filtered.map(event => (
              <div key={event.id} className="snap-start flex-shrink-0">
                <EventCard event={event} variant="default" />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
