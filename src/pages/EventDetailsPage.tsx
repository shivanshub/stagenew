import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Globe, ChevronRight, Bookmark, Share2, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { getEventBySlug, getRelatedEvents } from '../data/events';
import EventCard from '../components/EventCard';

export default function EventDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const event = slug ? getEventBySlug(slug) : undefined;

  if (!event) {
    return <Navigate to="/" replace />;
  }

  const related = getRelatedEvents(event.slug, event.category);

  return (
    <main id="main-content" className="bg-[#FAF9F5] text-[#14110D] min-h-screen pb-20">

      {/* ══════════════════════════════════════════════
          HERO IMAGE & DESKTOP META STRIP
      ══════════════════════════════════════════════ */}
      <section
        aria-label="Event hero"
        className="relative w-full overflow-hidden flex flex-col justify-end"
        style={{ minHeight: 'clamp(400px, 60vw, 680px)' }}
      >
        <img
          src={event.heroImage || event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.65)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110D]/90 via-[#14110D]/30 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-8 left-0 right-0 max-w-[1200px] mx-auto px-6 md:px-10 flex justify-between items-start z-20">
          <Link to="/" className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.4)] backdrop-blur-sm">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.4)] backdrop-blur-sm">
              <Bookmark size={16} />
            </button>
            <button className="w-10 h-10 rounded-[4px] border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-white hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors bg-[rgba(20,17,13,0.4)] backdrop-blur-sm">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 pt-32 pb-0 w-full">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#C8A85F]" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A85F]">
                {event.category.replace(' · ', ' · ')}
              </span>
            </div>
            <h1 className="font-serif text-white font-medium mb-2" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.1 }}>
              {event.title}
            </h1>
            <p className="font-serif italic text-[20px] md:text-[24px] text-[#EAE6DF]">
              {event.subtitle || `Presented by The Stage Time`}
            </p>
          </div>

          {/* Desktop Meta Strip (Translucent Dark) */}
          <div className="hidden lg:block w-full bg-[rgba(20,17,13,0.6)] backdrop-blur-md border-t border-[rgba(255,255,255,0.05)]">
            <div className="max-w-[1200px] mx-auto px-10">
              <div className="grid grid-cols-4 divide-x divide-[rgba(255,255,255,0.05)]">
                <div className="py-6 pr-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-2">Dates</div>
                  <div className="font-sans text-[16px] font-semibold text-white mb-1">{event.date}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">{event.time}</div>
                </div>
                <div className="py-6 px-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-2">Venue</div>
                  <div className="font-sans text-[16px] font-semibold text-white mb-1 truncate">{event.venue}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2] truncate">{event.city}, India</div>
                </div>
                <div className="py-6 px-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-2">Admission</div>
                  <div className="font-serif text-[20px] font-medium text-[#C8A85F] mb-0.5">{event.price === 'Free' || event.price === '0' ? 'Free Entry' : `₹${event.price}`}</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">{event.priceLabel || 'Tickets available'}</div>
                </div>
                <div className="py-6 pl-6">
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-2">Attending</div>
                  <div className="font-sans text-[16px] font-semibold text-white mb-1">284</div>
                  <div className="font-sans text-[12px] text-[#C9C1B2]">Shilpa, Rahul +282</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-10 md:py-16">

          {/* ── LEFT: Details ─────────────────────────── */}
          <article className="lg:col-span-2" aria-label="Event details">

            {/* Mobile Meta Strip (shown only on mobile since desktop hero has it) */}
            <div className="lg:hidden grid grid-cols-2 gap-4 p-5 mb-10 rounded-[8px] bg-white border border-[#EAE6DF]">
              {[
                { icon: Calendar, label: 'Date', value: event.date },
                { icon: Clock, label: 'Time', value: event.time },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Globe, label: 'Language', value: event.language },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-widest uppercase text-[#8A8278]">
                    <Icon size={10} />
                    {label}
                  </div>
                  <p className="font-sans text-[13px] font-medium text-[#14110D] truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Section i. About this event */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#14110D]">
                <span className="italic text-[#A38952] mr-3 font-serif text-[24px]">i.</span>
                About this event
              </h2>
              <div className="font-sans text-[15px] leading-[1.8] text-[#5C5750]">
                {event.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {i === 0 ? (
                      <span className="float-left text-[64px] font-serif leading-[0.8] mr-3 mt-1 text-[#14110D]">
                        {para.charAt(0)}
                      </span>
                    ) : null}
                    {i === 0 ? para.substring(1) : para}
                  </p>
                ))}
              </div>
            </div>

            {/* Section ii. Programme highlights */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#14110D]">
                <span className="italic text-[#A38952] mr-3 font-serif text-[24px]">ii.</span>
                Programme highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#EAE6DF]">
                {[
                  "Over 60 curated craft booths from Karnataka, Tamil Nadu & Kerala",
                  "Live acoustic performances across two outdoor stages, Fri–Sun",
                  "Regional food village with 20+ home kitchens and street vendors",
                  "Free kids' zone with storytelling and block-printing workshops",
                  "Evening screenings of shortlisted Kannada indie films",
                  "All-ages, wheelchair-accessible venue with parking"
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border-b border-r border-[#EAE6DF] bg-white flex gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#A38952] mt-1 flex-shrink-0">0{idx+1}</span>
                    <p className="font-sans text-[14px] leading-relaxed text-[#5C5750]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section iii. Organized by */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#14110D]">
                <span className="italic text-[#A38952] mr-3 font-serif text-[24px]">iii.</span>
                Organized by
              </h2>
              <div className="bg-white border border-[#EAE6DF] p-8 flex flex-col sm:flex-row gap-6">
                <div className="w-16 h-16 bg-[#EBE7DF] border border-[#D6D0C4] flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[28px] text-[#14110D]">{event.artist.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-serif text-[22px] text-[#14110D] mb-1">{event.artist}</h3>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A38952] mb-3">Independent Cultural Platform</div>
                  <p className="font-sans text-[13px] leading-relaxed text-[#5C5750]">
                    {event.artistBio || "An independent cultural platform championing art, live music and community since 2019."}
                  </p>
                </div>
              </div>
            </div>

            {/* Section iv. Questions? */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#14110D]">
                <span className="italic text-[#A38952] mr-3 font-serif text-[24px]">iv.</span>
                Questions?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-[#EAE6DF] p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D6D0C4] flex items-center justify-center text-[#A38952]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Call</div>
                    <div className="font-sans text-[15px] font-medium text-[#14110D]">+91 98454 21170</div>
                  </div>
                </div>
                <div className="bg-white border border-[#EAE6DF] p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#D6D0C4] flex items-center justify-center text-[#A38952]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Email</div>
                    <div className="font-sans text-[15px] font-medium text-[#14110D]">hello@thestage.in</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white border border-[#EAE6DF] px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[#5C5750] hover:text-[#14110D] hover:border-[#A38952] transition-colors rounded-[4px]">
                  <Instagram size={14} /> Instagram
                </button>
                <button className="bg-white border border-[#EAE6DF] px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[#5C5750] hover:text-[#14110D] hover:border-[#A38952] transition-colors rounded-[4px]">
                  <Facebook size={14} /> Facebook
                </button>
                <button className="bg-white border border-[#EAE6DF] px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[#5C5750] hover:text-[#14110D] hover:border-[#A38952] transition-colors rounded-[4px]">
                  <Twitter size={14} /> Twitter
                </button>
                <button className="bg-white border border-[#EAE6DF] px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[#5C5750] hover:text-[#14110D] hover:border-[#A38952] transition-colors rounded-[4px]">
                  <Globe size={14} /> Website
                </button>
              </div>
            </div>

            {/* Section v. Fine print */}
            <div className="mb-10">
              <h2 className="font-serif text-[28px] mb-6 text-[#14110D]">
                <span className="italic text-[#A38952] mr-3 font-serif text-[24px]">v.</span>
                Fine print
              </h2>
              <ul className="space-y-3 font-sans text-[13.5px] text-[#5C5750] pl-4 marker:text-[#A38952]" style={{ listStyleType: 'disc' }}>
                <li>Entry is free. Workshops and listening-room passes are separately ticketed.</li>
                <li>No re-entry after 10:30 PM. Last food orders 10:15 PM.</li>
                <li>Outside food & alcohol not permitted. Smoking only in designated zones.</li>
                <li>Festival reserves the right to refuse entry. All minors must be accompanied.</li>
              </ul>
            </div>

          </article>

          {/* ── RIGHT: Ticket Sidebar (Desktop) ──────── */}
          <aside
            aria-label="Reserve your spot"
            className="hidden lg:block lg:w-[380px]"
          >
            <div className="sticky top-24 flex flex-col gap-4">
              
              {/* Ticket Card */}
              <div className="bg-[#FAF9F5] text-[#14110D] rounded-[8px] overflow-hidden shadow-sm" style={{ border: '1px solid #EAE6DF' }}>
                {/* Top Section */}
                <div className="p-8 pb-6">
                  <div className="flex justify-between items-start mb-6 font-mono text-[10px] tracking-[0.2em] text-[#8A8278] leading-relaxed">
                    <div>ADMISSION</div>
                    <div className="text-right">
                      NO. 004<br/>
                      2026 - APR<br/>
                      STG - FST
                    </div>
                  </div>
                  <h2 className="font-serif text-[42px] font-medium leading-none" style={{ color: '#2B5E56' }}>
                    {event.price === 'Free' || event.price === '0' ? 'Free Entry' : `₹${event.price}`}
                  </h2>
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-[#D6D0C4] mx-4" />

                {/* Action Buttons */}
                <div className="p-8 py-6 flex flex-col gap-3">
                  <button className="w-full bg-[#A38952] hover:bg-[#8A7340] text-white font-sans font-bold text-[11px] tracking-[0.15em] uppercase py-4 rounded-[4px] flex items-center justify-center gap-2 transition-colors">
                    Reserve Your Spot ↗
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white border border-[#D6D0C4] hover:border-[#A38952] text-[#14110D] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors">
                      + Attending
                    </button>
                    <button className="flex-1 bg-white border border-[#D6D0C4] hover:border-[#A38952] text-[#14110D] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors">
                      Maybe
                    </button>
                  </div>
                  <button className="w-full bg-white border border-[#D6D0C4] hover:border-[#A38952] text-[#14110D] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] flex items-center justify-center gap-2 transition-colors">
                    <Calendar size={14} />
                    Add to Calendar
                  </button>
                </div>

                {/* Dashed line */}
                <div className="border-t border-dashed border-[#D6D0C4] mx-4" />

                {/* Attendees */}
                <div className="p-8 py-6 relative">
                  {/* Top center semi-circle cutout to mimic ticket perforation */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#FAF9F5] rounded-full" />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['#A38952', '#2B5E56', '#5C5470', '#14110D'].map((color, i) => (
                        <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-sans font-bold border-2 border-[#FFFFFF] flex-shrink-0" style={{ backgroundColor: color }}>
                          {['SS', 'RK', 'AN', '+281'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-[#14110D]">284 attending</div>
                      <div className="font-sans text-[12px] text-[#8A8278]">Shilpa, Rahul and 282 others</div>
                    </div>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="border-t border-[#EAE6DF] bg-[#FFFFFF] p-8 pt-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#8A8278] uppercase mb-4">
                    Contact the Organizer
                  </div>
                  <div className="font-sans text-[18px] font-medium text-[#14110D] mb-1">
                    +91 98454 21170
                  </div>
                  <div className="font-sans text-[14px] text-[#5C5750] mb-6">
                    hello@thestage.in
                  </div>
                  <div className="flex gap-3">
                    {/* Social Buttons */}
                    <button className="w-10 h-10 rounded-[4px] border border-[#D6D0C4] flex items-center justify-center hover:border-[#A38952] transition-colors text-[#14110D] font-serif text-[14px]">
                      IG
                    </button>
                    <button className="w-10 h-10 rounded-[4px] border border-[#D6D0C4] flex items-center justify-center hover:border-[#A38952] transition-colors text-[#14110D] font-serif text-[14px]">
                      FB
                    </button>
                    <button className="w-10 h-10 rounded-[4px] border border-[#D6D0C4] flex items-center justify-center hover:border-[#A38952] transition-colors text-[#14110D] font-serif text-[14px]">
                      X
                    </button>
                    <button className="flex-1 rounded-[4px] border border-[#D6D0C4] flex items-center justify-center gap-2 hover:border-[#A38952] transition-colors text-[11px] font-sans font-semibold text-[#14110D]">
                      <Globe size={12} />
                      Website
                    </button>
                  </div>
                </div>

              </div>

              {/* Map Card */}
              <div className="bg-[#FFFFFF] text-[#14110D] rounded-[8px] p-6 shadow-sm" style={{ border: '1px solid #EAE6DF' }}>
                <div className="w-full h-[180px] bg-[#EBE7DF] rounded-[4px] mb-6 relative overflow-hidden flex items-center justify-center">
                  <MapPin size={24} className="text-[#A38952]" />
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#DFDACD]" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-[#DFDACD]" />
                </div>
                <h3 className="font-serif text-[22px] font-medium mb-1">
                  {event.venue}
                </h3>
                <p className="font-sans text-[13px] text-[#8A8278] mb-6">
                  {event.city}, India
                </p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.2em] font-semibold text-[#14110D] hover:text-[#A38952] transition-colors flex items-center gap-2">
                  GET DIRECTIONS ↗
                </a>
              </div>

            </div>
          </aside>

        </div>

        {/* ══════════════════════════════════════════════
            RELATED EVENTS
        ══════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section
            aria-label="Related events"
            className="py-16 border-t mb-32 lg:mb-16"
            style={{ borderColor: '#EAE6DF' }}
          >
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A38952] mb-3">More from the season</div>
                <h2
                  className="font-serif text-3xl md:text-4xl font-semibold leading-none"
                  style={{ color: '#14110D' }}
                >
                  You might <em className="italic">also like</em>
                </h2>
              </div>
              <Link to="/" className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] font-bold uppercase text-[#14110D] hover:text-[#A38952] transition-colors border-b border-[#14110D] pb-1 hover:border-[#A38952]">
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

      {/* ══════════════════════════════════════════════
          MOBILE STICKY BOTTOM BAR (RSVP)
          Only visible on mobile — hidden on lg+
      ══════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        aria-label="Reserve Spot"
        role="region"
        style={{ background: '#FFFFFF', borderColor: '#EAE6DF' }}
      >
        <div className="flex items-center justify-between gap-4 max-w-container mx-auto">
          {/* Left: Price + Meta */}
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[22px] font-semibold leading-none mb-1" style={{ color: '#2B5E56' }}>
              {event.price === 'Free' || event.price === '0' ? 'Free' : `₹${event.price}`}
            </span>
            <span className="font-sans text-xs truncate" style={{ color: '#8A8278' }}>
              {event.date} · {event.venue}
            </span>
          </div>

          {/* Right: CTA */}
          <button
            type="button"
            className="flex-shrink-0 font-sans font-bold text-[11px] tracking-[0.15em] uppercase px-6 py-3.5 rounded-[4px] transition-colors duration-200 min-h-[48px] flex items-center gap-2"
            style={{ background: '#A38952', color: '#FFFFFF' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#8A7340'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#A38952'; }}
          >
            Reserve Spot
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Seats low warning in bottom bar */}
        {event.seatsLeft !== undefined && event.seatsLeft < 30 && (
          <p
            className="font-sans text-[11px] text-center mt-3"
            style={{ color: '#E8935A' }}
            role="alert"
          >
            ⚠ Only {event.seatsLeft} spots left
          </p>
        )}
      </div>

    </main>
  );
}
