import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '../data/events';

interface HeroSlideshowProps {
  events: Event[];
}

export default function HeroSlideshow({ events }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length, isPaused]);

  const goToPrev = () => setCurrentIndex((current) => (current - 1 + events.length) % events.length);
  const goToNext = () => setCurrentIndex((current) => (current + 1) % events.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  };

  const currentEvent = events[currentIndex];

  if (!events || events.length === 0) return null;

  return (
    <div 
      className="relative w-full max-w-[1000px] mx-auto min-h-[480px] rounded-[12px] overflow-hidden group outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Promoted events"
    >
      <style>{`
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .text-animate {
          animation: slideUpFade 250ms ease-out 100ms both;
        }
        @media (prefers-reduced-motion: reduce) {
          .text-animate { animation: none; opacity: 1; transform: translateY(0); }
          .fill-animate { animation: none !important; width: 100% !important; }
        }
      `}</style>

      {/* Background Slides */}
      {events.map((event, index) => (
        <div
          key={event.id}
          className="absolute inset-0 transition-opacity duration-[600ms] ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? 'auto' : 'none',
          }}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={event.heroImage || event.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110D] via-[#14110D]/40 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div 
        key={currentIndex}
        className="absolute inset-0 flex flex-col justify-end py-8 px-12 md:p-12 z-10"
      >
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <span className="bg-[#C8A85F] text-[#14110D] text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">
            Promoted
          </span>
        </div>

        <div className="text-animate max-w-[600px] mb-8">
          <span className="inline-block border border-[#C8A85F] text-[#C8A85F] px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase mb-4">
            {currentEvent.category}
          </span>
          <h2 className="font-serif text-[40px] md:text-[56px] leading-[1.05] text-[#F7F4EE] font-medium mb-3">
            {currentEvent.title}
          </h2>
          <p className="font-mono text-[11px] md:text-[13px] tracking-[0.15em] text-[#C8A85F] uppercase mb-4">
            {currentEvent.venue} · {currentEvent.date}
          </p>

          {/* Price + urgency row */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="font-sans text-[14px] font-semibold text-[#F7F4EE]">
              {currentEvent.price === 0 ? 'Free RSVP' : currentEvent.priceLabel}
            </span>
            {currentEvent.seatsLeft !== undefined && currentEvent.seatsLeft <= 50 && (
              <span className="flex items-center gap-1.5 font-sans text-[12px] font-medium px-3 py-1 rounded-full"
                style={{ background: 'rgba(220,60,60,0.15)', color: '#F87171', border: '1px solid rgba(220,60,60,0.3)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F87171] animate-pulse inline-block" />
                Only {currentEvent.seatsLeft} spots left
              </span>
            )}
          </div>

          <Link
            to={`/event/${currentEvent.slug}`}
            className="inline-flex items-center justify-center bg-[#C8A85F] text-[#14110D] font-bold text-[12px] tracking-[0.15em] uppercase rounded-full px-8 py-3.5 hover:bg-[#D4B570] transition-colors"
          >
            RSVP Now &rarr;
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 bg-[rgba(20,17,13,0.6)] backdrop-blur text-[#F7F4EE] rounded-full grid place-items-center transition-opacity z-20 hover:bg-[rgba(20,17,13,0.8)]"
        aria-label="Previous event"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 bg-[rgba(20,17,13,0.6)] backdrop-blur text-[#F7F4EE] rounded-full grid place-items-center transition-opacity z-20 hover:bg-[rgba(20,17,13,0.8)]"
        aria-label="Next event"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Progress Bars */}
      <div className="absolute bottom-6 left-8 right-8 z-20">
        <div className="hidden sm:flex gap-1 w-full max-w-[400px] mx-auto">
          {events.map((_, idx) => (
            <div 
              key={idx} 
              className="flex-1 h-[3px] bg-[rgba(247,244,238,0.2)] rounded-full overflow-hidden cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              <div 
                className={`h-full bg-[#C8A85F] rounded-full ${
                  idx === currentIndex 
                    ? (isPaused ? 'w-full' : 'fill-animate') 
                    : (idx < currentIndex ? 'w-full' : 'w-0')
                }`}
                style={{ 
                  animation: idx === currentIndex && !isPaused ? 'fillBar 5s linear forwards' : 'none',
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex sm:hidden justify-center gap-2">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-[#C8A85F]' : 'bg-[rgba(247,244,238,0.2)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
