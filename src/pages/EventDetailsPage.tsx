import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Globe, ChevronRight, Bookmark, Share2, Phone, Mail, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { getEventBySlug, getRelatedEvents } from '../data/events';
import EventCard from '../components/EventCard';
import { useTheme } from '../context/ThemeContext';

// ── Category-matched photo sets ───────────────────────────────────
const GALLERY_SETS: Record<string, string[]> = {
  theatre: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1598387993441-a364f854cca9?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
  ],
  comedy: [
    'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1561489422-45c5df1dd6b3?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1542385151-efd9000785b0?auto=format&fit=crop&w=1400&q=80',
  ],
  music: [
    'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c090be8bf52?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1540039155732-d674d40d4c3f?auto=format&fit=crop&w=1400&q=80',
  ],
  dance: [
    'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1519925610903-381054cc2a1c?auto=format&fit=crop&w=1400&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c090be8bf52?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=80',
  ],
};

function getGallery(category: string, eventImage: string): string[] {
  const key = category.toLowerCase();
  let imgs: string[] = GALLERY_SETS.default;
  for (const k of Object.keys(GALLERY_SETS)) {
    if (key.includes(k)) { imgs = GALLERY_SETS[k]; break; }
  }
  // Prepend the actual event image as the first slide
  return [eventImage, ...imgs];
}

// ── Hero Image Slider ─────────────────────────────────────────────
function HeroSlider({ images, title, subtitle, category }: {
  images: string[];
  title: string;
  subtitle: string;
  category: string;
}) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  // Touch swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      aria-label="Event photo slider"
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'clamp(380px, 58vw, 660px)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? 'auto' : 'none' }}
        >
          <img
            src={src}
            alt={`${title} — photo ${i + 1}`}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.62)' }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Dark gradient overlay (bottom) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#14110D]/95 via-[#14110D]/25 to-transparent pointer-events-none" />

      {/* Top bar: back + actions */}
      <div className="absolute top-8 left-0 right-0 max-w-[1200px] mx-auto px-6 md:px-10 flex justify-between items-start z-20">
        <Link
          to="/"
          className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm">
            <Bookmark size={16} />
          </button>
          <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(20,17,13,0.55)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(20,17,13,0.55)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}
      >
        <ChevronRightIcon size={20} />
      </button>

      {/* Dot indicators + counter */}
      <div className="absolute bottom-[148px] md:bottom-[160px] left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        {/* Dot strip */}
        <div className="flex items-center gap-[6px]">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="transition-all duration-300 rounded-full pointer-events-auto"
              style={{
                width: i === idx ? 22 : 7,
                height: 7,
                background: i === idx ? '#C8A85F' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
        {/* Counter pill */}
        <div
          className="font-mono text-[10px] tracking-[0.15em] text-white/70 px-3 py-1 rounded-full pointer-events-none"
          style={{ background: 'rgba(20,17,13,0.5)', backdropFilter: 'blur(4px)' }}
        >
          {idx + 1} / {images.length}
        </div>
      </div>

      {/* Event title / meta at bottom of slider */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-0 w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-8 md:pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-[#C8A85F]" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A85F]">
              {category}
            </span>
          </div>
          <h1 className="font-serif text-white font-medium mb-2" style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', lineHeight: 1.1 }}>
            {title}
          </h1>
          <p className="font-serif italic text-[18px] md:text-[22px] text-[#C9C1B2]">
            {subtitle}
          </p>
        </div>

        {/* Desktop Meta Strip */}
        <div className="hidden lg:block w-full bg-[rgba(20,17,13,0.65)] backdrop-blur-md border-t border-[rgba(255,255,255,0.05)]">
          <div className="max-w-[1200px] mx-auto px-10">
            <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.05)]">
              <div className="py-5 pr-6">
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Dates</div>
                <div className="font-sans text-[15px] font-semibold text-white leading-tight">
                  {/* event date injected via prop — we'll pass it as part of parent */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main EventDetailsPage ─────────────────────────────────────────
export default function EventDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;
  const { theme } = useTheme();

  // Slider state — lifted so indicator bar lives below the image
  const [sliderIdx, setSliderIdx] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashIndicator = useCallback(() => {
    setShowIndicator(true);
    if (indicatorTimer.current) clearTimeout(indicatorTimer.current);
    indicatorTimer.current = setTimeout(() => setShowIndicator(false), 1800);
  }, []);

  useEffect(() => () => { if (indicatorTimer.current) clearTimeout(indicatorTimer.current); }, []);

  if (!event) return <Navigate to="/" replace />;

  const related = getRelatedEvents(event.slug, event.category);
  const sliderImages = getGallery(event.category, event.heroImage || event.image);

  // Theme tokens
  const bg      = theme === 'dark' ? '#14110D' : '#FAF8F3';
  const bgCard  = theme === 'dark' ? '#1E1A14' : '#F2EFE8';
  const bgCard2 = theme === 'dark' ? '#221D16' : '#EDE9E0';
  const ink     = theme === 'dark' ? '#F7F4EE' : '#14110D';
  const inkSoft = theme === 'dark' ? '#C9C1B2' : '#4A3F32';
  const inkMute = theme === 'dark' ? '#8A8278'  : '#7A6F64';
  const hairline = theme === 'dark' ? 'rgba(247,244,238,0.10)' : 'rgba(20,17,13,0.10)';
  const stickyBg = theme === 'dark' ? 'rgba(20,17,13,0.96)' : 'rgba(242,239,232,0.96)';

  return (
    <main id="main-content" style={{ background: bg, color: ink, minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ══════════════════════════════════════════════
          HERO PHOTO SLIDER
      ══════════════════════════════════════════════ */}
      <section aria-label="Event hero" className="relative w-full overflow-hidden" style={{ minHeight: 'clamp(380px, 58vw, 660px)' }}>
        <SliderControls
          images={sliderImages}
          idx={sliderIdx}
          setIdx={setSliderIdx}
          onNavigate={flashIndicator}
          title={event.title}
          subtitle={event.subtitle || 'Presented by The Stage Time'}
          category={event.category}
          event={event}
        />
      </section>

      {/* ── Photo indicator bar — lives BELOW the image ──────────── */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center gap-[7px] py-3 transition-all duration-300"
        style={{
          background: bg,
          opacity: showIndicator ? 1 : 0,
          height: showIndicator ? 36 : 0,
          overflow: 'hidden',
          paddingTop: showIndicator ? 10 : 0,
          paddingBottom: showIndicator ? 10 : 0,
        }}
      >
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSliderIdx(i); flashIndicator(); }}
            aria-label={`Photo ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === sliderIdx ? 20 : 6,
              height: 6,
              background: i === sliderIdx ? '#C8A85F' : inkMute,
            }}
          />
        ))}
        <span
          className="font-mono text-[10px] tracking-[0.14em] ml-2"
          style={{ color: inkMute }}
        >
          {sliderIdx + 1} / {sliderImages.length}
        </span>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-10 md:py-16">

          {/* ── LEFT: Details ─────────────────────────── */}
          <article className="lg:col-span-2" aria-label="Event details">

            {/* Mobile Meta Strip */}
            <div className="lg:hidden grid grid-cols-2 gap-4 p-5 mb-10 rounded-[8px]"
              style={{ background: bgCard, border: `1px solid ${hairline}` }}>
              {[
                { icon: Calendar, label: 'Date',     value: event.date     },
                { icon: Clock,    label: 'Time',     value: event.time     },
                { icon: MapPin,   label: 'Venue',    value: event.venue    },
                { icon: Globe,    label: 'Language', value: event.language },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-widest uppercase" style={{ color: inkMute }}>
                    <Icon size={10} />
                    {label}
                  </div>
                  <p className="font-sans text-[13px] font-medium truncate" style={{ color: ink }}>{value}</p>
                </div>
              ))}
            </div>

            {/* i. About this event */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>i.</span>
                About this event
              </h2>
              <div className="font-sans text-[15px] leading-[1.8]" style={{ color: inkSoft }}>
                {event.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {i === 0 ? (
                      <span className="float-left text-[64px] font-serif leading-[0.8] mr-3 mt-1" style={{ color: ink }}>
                        {para.charAt(0)}
                      </span>
                    ) : null}
                    {i === 0 ? para.substring(1) : para}
                  </p>
                ))}
              </div>
            </div>

            {/* ii. Programme highlights */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>ii.</span>
                Programme highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l" style={{ borderColor: hairline }}>
                {[
                  "Over 60 curated craft booths from Karnataka, Tamil Nadu & Kerala",
                  "Live acoustic performances across two outdoor stages, Fri–Sun",
                  "Regional food village with 20+ home kitchens and street vendors",
                  "Free kids' zone with storytelling and block-printing workshops",
                  "Evening screenings of shortlisted Kannada indie films",
                  "All-ages, wheelchair-accessible venue with parking",
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border-b border-r flex gap-4" style={{ borderColor: hairline, background: bgCard }}>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#C8A85F] mt-1 flex-shrink-0">0{idx + 1}</span>
                    <p className="font-sans text-[14px] leading-relaxed" style={{ color: inkSoft }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* iii. Organized by */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>iii.</span>
                Organized by
              </h2>
              <div className="p-8 flex flex-col sm:flex-row gap-6" style={{ background: bgCard, border: `1px solid ${hairline}` }}>
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0" style={{ background: bgCard2, border: '1px solid rgba(200,168,95,0.25)' }}>
                  <span className="font-serif text-[28px] text-[#C8A85F]">{event.artist.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-serif text-[22px] mb-1" style={{ color: ink }}>{event.artist}</h3>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C8A85F] mb-3">Independent Cultural Platform</div>
                  <p className="font-sans text-[13px] leading-relaxed" style={{ color: inkSoft }}>
                    {event.artistBio || "An independent cultural platform championing art, live music and community since 2019."}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue — mobile only */}
            <div className="lg:hidden mb-16">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>iv.</span>
                Venue
              </h2>
              <div className="rounded-[8px] overflow-hidden" style={{ background: bgCard, border: '1px solid rgba(200,168,95,0.15)' }}>
                <div className="w-full h-[160px] relative flex items-center justify-center" style={{ background: bgCard2 }}>
                  <MapPin size={28} className="text-[#C8A85F]" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{ background: hairline }} />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px]" style={{ background: hairline }} />
                  <div className="absolute top-0 bottom-0 right-1/4 w-[2px]" style={{ background: hairline }} />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-[20px] font-medium mb-1" style={{ color: ink }}>{event.venue}</h3>
                  <p className="font-sans text-[13px] mb-5" style={{ color: inkMute }}>{event.city}, India</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] font-semibold text-[#C8A85F] uppercase"
                  >
                    <MapPin size={12} /> Get Directions ↗
                  </a>
                </div>
              </div>
            </div>

            {/* v. Questions? */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>v.</span>
                Questions?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { icon: Phone, label: 'Call', value: '+91 98454 21170' },
                  { icon: Mail,  label: 'Email', value: 'hello@thestage.in' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-6 flex items-center gap-4" style={{ background: bgCard, border: `1px solid ${hairline}` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#C8A85F]" style={{ background: bgCard2, border: '1px solid rgba(200,168,95,0.25)' }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: inkMute }}>{label}</div>
                      <div className="font-sans text-[15px] font-medium" style={{ color: ink }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Facebook,  label: 'Facebook'  },
                  { icon: Twitter,   label: 'Twitter'   },
                  { icon: Globe,     label: 'Website'   },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium transition-colors rounded-[4px]"
                    style={{ background: bgCard, border: `1px solid ${hairline}`, color: inkSoft }}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* vi. Fine print */}
            <div className="mb-10">
              <h2 className="font-serif text-[28px] mb-6" style={{ color: ink }}>
                <span className="italic mr-3 font-serif text-[24px]" style={{ color: '#C8A85F' }}>vi.</span>
                Fine print
              </h2>
              <ul className="space-y-3 font-sans text-[13.5px] pl-4 marker:text-[#C8A85F]" style={{ color: inkSoft, listStyleType: 'disc' }}>
                <li>Entry is free. Workshops and listening-room passes are separately ticketed.</li>
                <li>No re-entry after 10:30 PM. Last food orders 10:15 PM.</li>
                <li>Outside food &amp; alcohol not permitted. Smoking only in designated zones.</li>
                <li>Festival reserves the right to refuse entry. All minors must be accompanied.</li>
              </ul>
            </div>

          </article>

          {/* ── RIGHT: Ticket Sidebar (Desktop) ──────── */}
          <aside aria-label="Reserve your spot" className="hidden lg:block lg:w-[380px]">
            <div className="sticky top-24 flex flex-col gap-4">

              {/* Ticket Card */}
              <div className="rounded-[8px] overflow-hidden" style={{ background: bgCard, border: '1px solid rgba(200,168,95,0.22)' }}>
                <div className="p-8 pb-6">
                  <div className="flex justify-between items-start mb-6 font-mono text-[10px] tracking-[0.2em] leading-relaxed" style={{ color: inkMute }}>
                    <div>ADMISSION</div>
                    <div className="text-right">NO. 004<br />2026 - APR<br />STG - FST</div>
                  </div>
                  <h2 className="font-serif text-[42px] font-medium leading-none text-[#C8A85F]">
                    {event.price === 0 ? 'Free Entry' : `₹${event.price}`}
                  </h2>
                </div>

                <div className="border-t border-dashed border-[rgba(200,168,95,0.20)] mx-4" />

                <div className="p-8 py-6 flex flex-col gap-3">
                  <button className="w-full bg-[#C8A85F] hover:bg-[#D4B570] text-[#14110D] font-sans font-bold text-[11px] tracking-[0.15em] uppercase py-4 rounded-[4px] flex items-center justify-center gap-2 transition-colors">
                    Reserve Your Spot ↗
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors" style={{ background: bgCard2, border: `1px solid ${hairline}`, color: ink }}>
                      + Attending
                    </button>
                    <button className="flex-1 font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors" style={{ background: bgCard2, border: `1px solid ${hairline}`, color: ink }}>
                      Maybe
                    </button>
                  </div>
                  <button className="w-full font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] flex items-center justify-center gap-2 transition-colors" style={{ background: bgCard2, border: `1px solid ${hairline}`, color: ink }}>
                    <Calendar size={14} /> Add to Calendar
                  </button>
                </div>

                <div className="border-t border-dashed border-[rgba(200,168,95,0.20)] mx-4" />

                <div className="p-8 py-6 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full" style={{ background: bg }} />
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {(['#A38952', '#4A7C6F', '#5C5470', '#2A2520'] as const).map((color, i) => (
                        <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-sans font-bold border-2 flex-shrink-0"
                          style={{ backgroundColor: color, borderColor: bgCard }}>
                          {['SS', 'RK', 'AN', '+281'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold" style={{ color: ink }}>284 attending</div>
                      <div className="font-sans text-[12px]" style={{ color: inkMute }}>Shilpa, Rahul and 282 others</div>
                    </div>
                  </div>
                </div>

                <div className="border-t p-8 pt-6" style={{ background: bgCard2, borderColor: hairline }}>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: inkMute }}>Contact the Organizer</div>
                  <div className="font-sans text-[18px] font-medium mb-1" style={{ color: ink }}>+91 98454 21170</div>
                  <div className="font-sans text-[14px] mb-6" style={{ color: inkSoft }}>hello@thestage.in</div>
                  <div className="flex gap-3">
                    {(['IG', 'FB', 'X'] as const).map(s => (
                      <button key={s} className="w-10 h-10 rounded-[4px] border flex items-center justify-center transition-colors font-serif text-[14px]"
                        style={{ borderColor: hairline, color: inkSoft }}>
                        {s}
                      </button>
                    ))}
                    <button className="flex-1 rounded-[4px] border flex items-center justify-center gap-2 text-[11px] font-sans font-semibold"
                      style={{ borderColor: hairline, color: inkSoft }}>
                      <Globe size={12} /> Website
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="rounded-[8px] p-6" style={{ background: bgCard, border: '1px solid rgba(200,168,95,0.15)' }}>
                <div className="w-full h-[180px] rounded-[4px] mb-6 relative overflow-hidden flex items-center justify-center" style={{ background: bgCard2 }}>
                  <MapPin size={24} className="text-[#C8A85F]" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{ background: hairline }} />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px]" style={{ background: hairline }} />
                </div>
                <h3 className="font-serif text-[22px] font-medium mb-1" style={{ color: ink }}>{event.venue}</h3>
                <p className="font-sans text-[13px] mb-6" style={{ color: inkMute }}>{event.city}, India</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-[0.2em] font-semibold text-[#C8A85F] hover:text-[#F7F4EE] transition-colors flex items-center gap-2">
                  GET DIRECTIONS ↗
                </a>
              </div>

            </div>
          </aside>

        </div>

        {/* Related Events */}
        {related.length > 0 && (
          <section aria-label="Related events" className="py-16 border-t mb-32 lg:mb-16" style={{ borderColor: hairline }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A85F] mb-3">More from the season</div>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-none" style={{ color: ink }}>
                  You might <em className="italic">also like</em>
                </h2>
              </div>
              <Link to="/" className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] font-bold uppercase transition-colors border-b pb-1"
                style={{ color: inkSoft, borderColor: hairline }}>
                ALL EVENTS ↗
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {related.map(evt => (
                <div key={evt.id} className="flex-shrink-0 w-[280px] snap-start">
                  <EventCard event={evt} variant="default" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
        aria-label="Reserve Spot" role="region"
        style={{ background: stickyBg, borderColor: hairline, backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center justify-between gap-4 max-w-container mx-auto">
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[22px] font-semibold leading-none mb-1 text-[#C8A85F]">
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </span>
            <span className="font-sans text-xs truncate" style={{ color: inkMute }}>
              {event.date} · {event.venue}
            </span>
          </div>
          <button type="button" className="flex-shrink-0 bg-[#C8A85F] hover:bg-[#D4B570] text-[#14110D] font-sans font-bold text-[11px] tracking-[0.15em] uppercase px-6 py-3.5 rounded-[4px] transition-colors duration-200 min-h-[48px] flex items-center gap-2">
            Reserve Spot <ChevronRight size={14} />
          </button>
        </div>
        {event.seatsLeft !== undefined && event.seatsLeft < 30 && (
          <p className="font-sans text-[11px] text-center mt-3 text-[#E8935A]" role="alert">
            ⚠ Only {event.seatsLeft} spots left
          </p>
        )}
      </div>

    </main>
  );
}

// ── Slider Controls — no internal dots/counter, state driven from parent ──
function SliderControls({ images, idx, setIdx, onNavigate, title, subtitle, category, event }: {
  images: string[];
  idx: number;
  setIdx: React.Dispatch<React.SetStateAction<number>>;
  onNavigate: () => void;
  title: string;
  subtitle: string;
  category: string;
  event: ReturnType<typeof getEventBySlug>;
}) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = () => { setIdx(i => (i - 1 + images.length) % images.length); onNavigate(); };
  const next = () => { setIdx(i => (i + 1) % images.length); onNavigate(); };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current ?? 0));
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) dx < 0 ? next() : prev();
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="absolute inset-0" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Slides */}
      {images.map((src, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === idx ? 1 : 0 }}>
          <img src={src} alt={`${title} — photo ${i + 1}`}
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.62)' }}
            loading={i === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#14110D]/95 via-[#14110D]/20 to-transparent pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-8 left-0 right-0 max-w-[1200px] mx-auto px-6 md:px-10 flex justify-between items-start z-20">
        <Link to="/" className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm">
            <Bookmark size={16} />
          </button>
          <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.45)] backdrop-blur-sm">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button onClick={prev} aria-label="Previous photo"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(20,17,13,0.55)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} aria-label="Next photo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(20,17,13,0.55)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>
        <ChevronRightIcon size={20} />
      </button>

      {/* Event title — pinned to bottom of image */}
      <div className="absolute bottom-0 left-0 right-0 z-10 w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-8 md:pb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-[#C8A85F]" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A85F]">{category}</span>
          </div>
          <h1 className="font-serif text-white font-medium mb-1" style={{ fontSize: 'clamp(34px, 5vw, 66px)', lineHeight: 1.1 }}>
            {title}
          </h1>
          <p className="font-serif italic text-[17px] md:text-[21px] text-[#C9C1B2]">{subtitle}</p>
        </div>

        {/* Desktop meta strip */}
        {event && (
          <div className="hidden lg:block w-full bg-[rgba(20,17,13,0.65)] backdrop-blur-md border-t border-[rgba(255,255,255,0.05)]">
            <div className="max-w-[1200px] mx-auto px-10">
              <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.05)]">
                <div className="py-5 pr-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Dates</div>
                  <div className="font-sans text-[15px] font-semibold text-white">{event.date}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">{event.time}</div>
                </div>
                <div className="py-5 px-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Venue</div>
                  <div className="font-sans text-[15px] font-semibold text-white truncate">{event.venue}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2] truncate">{event.city}, India</div>
                </div>
                <div className="py-5 px-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Admission</div>
                  <div className="font-serif text-[19px] font-medium text-[#C8A85F]">{event.price === 0 ? 'Free Entry' : `₹${event.price}`}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">{event.priceLabel || 'Tickets available'}</div>
                </div>
                <div className="py-5 pl-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Attending</div>
                  <div className="font-sans text-[15px] font-semibold text-white">284</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">Shilpa, Rahul +282</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
