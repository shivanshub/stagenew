import { Link } from 'react-router-dom';
import { ArrowRight, Music, Theater, Mic2, Zap, Calendar, Clock, MapPin, Search } from 'lucide-react';
import { EVENTS, FEATURED_EVENT } from '../data/events';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';

const GENRES = [
  { label: 'Classical Music', icon: Music,    count: '143 events' },
  { label: 'Theatre',         icon: Theater,  count: '89 events'  },
  { label: 'Dance',           icon: Zap,      count: '67 events'  },
  { label: 'Comedy',          icon: Mic2,     count: '52 events'  },
];

const CITIES = [
  { label: 'Mumbai',    count: '342 events' },
  { label: 'Delhi NCR', count: '281 events' },
  { label: 'Bengaluru', count: '215 events' },
  { label: 'Chennai',   count: '94 events'  },
];

export default function HomePage() {
  const featuredEvents = EVENTS.filter(e => e.isFeatured);
  const hero = FEATURED_EVENT;

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════
          HERO SECTION (DARK) - Matching Screenshot Exact Layout
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[86vh] flex flex-col items-center justify-center text-center overflow-hidden" style={{ padding: '120px 24px 80px', backgroundColor: '#14110D' }}>
        
        {/* Background Image & Glow */}
        <div aria-hidden="true" className="absolute inset-0">
          <img
            src={hero.heroImage || hero.image}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          {/* Subtle gradient to merge image with background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#14110D]/50 via-transparent to-[#14110D]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110D] via-transparent to-transparent" />
          
          {/* Centered glow behind text */}
          <div className="absolute left-1/2 top-[40%] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" 
               style={{ 
                 background: 'radial-gradient(circle, rgba(163, 137, 82, 0.15) 0%, transparent 60%)',
                 filter: 'blur(30px)' 
               }} 
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1000px]">
          
          {/* Label */}
          <div className="inline-flex items-center gap-[16px] mb-8">
            <span className="h-px w-[40px] bg-brand-goldDeep inline-block" />
            <span className="font-mono text-[11px] font-medium tracking-[0.2em] uppercase text-[#8A7340]">
              Discover · RSVP · Never miss out
            </span>
            <span className="h-px w-[40px] bg-brand-goldDeep inline-block" />
          </div>

          {/* Title */}
          <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[#F7F4EE] mx-auto mb-6" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
            Unlock your city's<br className="hidden sm:block" />
            <em className="italic font-normal"> live</em> entertainment.
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic font-normal text-[#C9C1B2] mx-auto mb-12 max-w-[54ch] leading-relaxed" style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}>
            Curated theatre, comedy, music and dance across India — the<br className="hidden sm:block" /> grassroots nights the big ticketing apps never surface.
          </p>

          {/* Search Bar Container */}
          <div role="search" className="rounded-[8px] p-4 max-w-[920px] mx-auto mb-8" style={{ background: 'rgba(20, 17, 13, 0.4)', border: '1px solid rgba(247, 244, 238, 0.1)' }}>
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* Query Input */}
              <div className="relative flex-1">
                <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-inkMute">
                  <Search size={18} strokeWidth={1.5} />
                </span>
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  className="w-full h-[52px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[4px] pl-[44px] pr-4 text-[14px] font-sans placeholder:text-[#8A8278] focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              {/* Date Button */}
              <button type="button" className="h-[52px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[4px] px-4 text-[14px] font-sans flex items-center justify-between min-w-[180px] hover:border-brand-gold transition-colors text-left">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-inkMute" />
                  Any date
                </span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

              {/* Location Button */}
              <button type="button" className="h-[52px] bg-[#1E1A14] border border-[rgba(247,244,238,0.15)] text-[#F7F4EE] rounded-[4px] px-4 text-[14px] font-sans flex items-center justify-between min-w-[180px] hover:border-brand-gold transition-colors text-left">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-inkMute" />
                  All India
                </span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

              {/* Search Submit */}
              <button type="button" className="h-[52px] bg-[#C8A85F] text-[#14110D] font-sans font-bold text-[12px] tracking-[0.15em] uppercase rounded-[4px] px-8 hover:bg-[#D4B570] transition-colors flex items-center justify-center gap-2 flex-shrink-0">
                <Search size={16} strokeWidth={2.5} />
                Search
              </button>
            </div>
          </div>

          {/* Quick Chips */}
          <div className="flex gap-3 flex-wrap justify-center mb-16">
            {['Theatre in Mumbai', 'Classical this weekend', 'Stand-up comedy', 'Free RSVP'].map(chip => (
              <button key={chip} type="button" className="h-[38px] px-5 border border-[rgba(247,244,238,0.2)] bg-transparent text-[#C9C1B2] text-[12px] font-sans rounded-[4px] hover:border-brand-gold hover:text-[#F7F4EE] transition-colors">
                {chip}
              </button>
            ))}
          </div>

          {/* Stat Strip */}
          <div className="border-t border-[rgba(247,244,238,0.1)] pt-10 mt-10 w-full max-w-[800px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { n: '12k+', l: 'Events listed' },
                { n: '340+', l: 'Venues' },
                { n: '8k+', l: 'Artists' },
                { n: '50k+', l: 'Members' },
              ].map(stat => (
                <div key={stat.l}>
                  <div className="font-serif text-[36px] text-[#F7F4EE] font-medium leading-none mb-2">{stat.n}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A8278]">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom divider line spanning full width matching screenshot */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-[rgba(247,244,238,0.1)]" />
      </section>

      {/* ══════════════════════════════════════════════
          TRUST STRIP (DARK BG)
      ══════════════════════════════════════════════ */}
      <section className="bg-brand-bg text-brand-ink">
        <div className="max-w-container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-3">
            
            <div className="py-9 pr-8 flex gap-4 items-start border-b border-brand-hairline">
              <span aria-hidden="true" className="w-12 h-12 rounded-full flex-shrink-0 bg-brand-goldSoft border border-brand-gold grid place-items-center text-brand-goldBright">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2M13 17v2M13 11v2"></path></svg>
              </span>
              <div>
                <h3 className="font-serif font-medium text-[18px] m-0 mb-1.5 mt-0.5">Free RSVP in seconds</h3>
                <p className="text-[13px] text-brand-inkMute leading-[1.55] m-0 font-light max-w-[34ch]">Claim your spot and get a reminder. No checkout, no fuss — you only pay the organiser if there's a ticket.</p>
              </div>
            </div>

            <div className="py-9 px-8 flex gap-4 items-start border-b border-brand-hairline md:border-l">
              <span aria-hidden="true" className="w-12 h-12 rounded-full flex-shrink-0 bg-brand-goldSoft border border-brand-gold grid place-items-center text-brand-goldBright">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              </span>
              <div>
                <h3 className="font-serif font-medium text-[18px] m-0 mb-1.5 mt-0.5">Curated, not crawled</h3>
                <p className="text-[13px] text-brand-inkMute leading-[1.55] m-0 font-light max-w-[34ch]">Every listing is hand-picked by our team — the grassroots gigs and gallery nights the big apps overlook.</p>
              </div>
            </div>

            <div className="py-9 pl-8 flex gap-4 items-start border-b border-brand-hairline md:border-l">
              <span aria-hidden="true" className="w-12 h-12 rounded-full flex-shrink-0 bg-brand-goldSoft border border-brand-gold grid place-items-center text-brand-goldBright">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
              </span>
              <div>
                <h3 className="font-serif font-medium text-[18px] m-0 mb-1.5 mt-0.5">Never miss the night</h3>
                <p className="text-[13px] text-brand-inkMute leading-[1.55] m-0 font-light max-w-[34ch]">Add to calendar, bookmark and share. We nudge you before doors open — on web and the Android app.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EVENTS CAROUSEL (DARK BG)
      ══════════════════════════════════════════════ */}
      <EventCarousel
        events={EVENTS}
        title="This week on stage"
        subtitle="Happening soon"
      />

      {/* ══════════════════════════════════════════════
          CATEGORIES GRID (DARK BG)
      ══════════════════════════════════════════════ */}
      <section id="categories" className="bg-brand-bg text-brand-ink py-[72px]">
        <div className="max-w-container mx-auto px-10">
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-7 bg-brand-gold inline-block" />
              <span className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-brand-goldBright">
                Find your scene
              </span>
            </div>
            <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] m-0" style={{ fontSize: 'clamp(28px,3vw,38px)' }}>
              Browse <em className="italic">by category</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {GENRES.map(({ label, count }) => (
              <a
                key={label}
                href="#"
                className="relative aspect-[16/11] overflow-hidden rounded-[4px] cursor-pointer bg-brand-bgWarm text-brand-ink no-underline block p-6 group border border-brand-hairline"
              >
                <div className="absolute inset-0 bg-brand-bgWarm transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bgWarm/90 to-transparent" />
                
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <h3 className="font-serif text-[23px] font-medium m-0 text-brand-ink">{label}</h3>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-inkMute mt-1.5">{count}</span>
                </div>
              </a>
            ))}
          </div>

          {/* ─── CITIES GRID ─── */}
          <div className="mb-8 border-t border-[rgba(247,244,238,0.1)] pt-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-7 bg-brand-gold inline-block" />
              <span className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-brand-goldBright">
                Local events
              </span>
            </div>
            <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] m-0" style={{ fontSize: 'clamp(28px,3vw,38px)' }}>
              Browse <em className="italic">by city</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES.map(({ label, count }) => (
              <a
                key={label}
                href="#"
                className="relative aspect-[16/11] overflow-hidden rounded-[4px] cursor-pointer bg-brand-bgWarm text-brand-ink no-underline block p-6 group border border-brand-hairline"
              >
                <div className="absolute inset-0 bg-brand-bgWarm transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bgWarm/90 to-transparent" />
                
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2 text-brand-goldBright">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[23px] font-medium m-0 text-brand-ink">{label}</h3>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-inkMute mt-1.5">{count}</span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED/POPULAR SECTION (WARM BG)
      ══════════════════════════════════════════════ */}
      <section className="bg-brand-bgWarm text-brand-ink py-[72px]">
        <div className="max-w-container mx-auto px-10">

          <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-7 bg-brand-gold inline-block" />
                <span className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-brand-goldBright">
                  Most RSVP'd
                </span>
              </div>
              <h2 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] m-0" style={{ fontSize: 'clamp(28px,3vw,38px)' }}>
                Popular <em className="italic">right now</em>
              </h2>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-brand-ink font-medium border-b border-brand-gold pb-1 no-underline whitespace-nowrap hover:gap-3 transition-all">
              View all popular
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {featuredEvents[0] && (
              <div className="lg:col-span-2">
                <EventCard event={featuredEvents[0]} variant="wide" />
              </div>
            )}

            <div className="flex flex-col gap-4">
              {EVENTS.slice(1, 4).map(event => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT SECTION (WARM BG)
      ══════════════════════════════════════════════ */}
      <section id="about" className="bg-brand-bgWarm text-brand-ink py-[80px]">
        <div className="max-w-container mx-auto px-10">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-7 bg-brand-gold inline-block" />
              <span className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase text-brand-goldBright">
                The Stage Time
              </span>
            </div>
            
            <p className="font-serif font-normal leading-[1.3] tracking-[-0.01em] text-brand-ink m-0 mb-6" style={{ fontSize: 'clamp(23px,2.6vw,32px)' }}>
              Not a ticketing app — a way to find India's live culture before it sells out, and to remember the night it's on.
            </p>
            <p className="text-[15.5px] leading-[1.75] text-brand-inkSoft font-light m-0 mb-8 max-w-[64ch]">
              Mainstream platforms surface stadium tours and blockbuster releases. The Stage Time is built for everything in between — the black-box theatre revival, the open-mic that becomes someone's first headline set, the Sufi evening in a lakeside lawn. RSVP in seconds to claim your spot and get a reminder; if there's a ticket, we hand you straight to the organiser.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-[19px] font-medium m-0 mb-2.5">What we do</h4>
                <p className="text-[14px] leading-[1.7] text-brand-inkSoft font-light m-0">
                  Hand-pick performing-arts events across cities, organise them by date, category and venue, and make discovery feel like reading a good listings magazine — not scrolling a marketplace.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-[19px] font-medium m-0 mb-2.5">Why RSVP</h4>
                <p className="text-[14px] leading-[1.7] text-brand-inkSoft font-light m-0">
                  It takes 2 seconds and helps organisers gauge interest. You get a calendar invite, and if the event has a ticket link, you get it instantly in your inbox. No spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
