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
    <main id="main-content" className="bg-[#14110D] text-[#F7F4EE] min-h-screen pb-20">

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
                {event.category}
              </span>
            </div>
            <h1 className="font-serif text-white font-medium mb-2" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.1 }}>
              {event.title}
            </h1>
            <p className="font-serif italic text-[20px] md:text-[24px] text-[#C9C1B2]">
              {event.subtitle || `Presented by The Stage Time`}
            </p>
          </div>

          {/* Desktop Meta Strip */}
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
                  <div className="font-serif text-[20px] font-medium text-[#C8A85F] mb-0.5">{event.price === 0 ? 'Free Entry' : `₹${event.price}`}</div>
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

            {/* Mobile Meta Strip */}
            <div className="lg:hidden grid grid-cols-2 gap-4 p-5 mb-10 rounded-[8px] bg-[#1E1A14] border border-[rgba(247,244,238,0.10)]">
              {[
                { icon: Calendar, label: 'Date',     value: event.date     },
                { icon: Clock,    label: 'Time',     value: event.time     },
                { icon: MapPin,   label: 'Venue',    value: event.venue    },
                { icon: Globe,    label: 'Language', value: event.language },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-widest uppercase text-[#8A8278]">
                    <Icon size={10} />
                    {label}
                  </div>
                  <p className="font-sans text-[13px] font-medium text-[#F7F4EE] truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* i. About this event */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">i.</span>
                About this event
              </h2>
              <div className="font-sans text-[15px] leading-[1.8] text-[#C9C1B2]">
                {event.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-6">
                    {i === 0 ? (
                      <span className="float-left text-[64px] font-serif leading-[0.8] mr-3 mt-1 text-[#F7F4EE]">
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
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">ii.</span>
                Programme highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[rgba(247,244,238,0.10)]">
                {[
                  "Over 60 curated craft booths from Karnataka, Tamil Nadu & Kerala",
                  "Live acoustic performances across two outdoor stages, Fri–Sun",
                  "Regional food village with 20+ home kitchens and street vendors",
                  "Free kids' zone with storytelling and block-printing workshops",
                  "Evening screenings of shortlisted Kannada indie films",
                  "All-ages, wheelchair-accessible venue with parking",
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border-b border-r border-[rgba(247,244,238,0.10)] bg-[#1E1A14] flex gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#C8A85F] mt-1 flex-shrink-0">0{idx + 1}</span>
                    <p className="font-sans text-[14px] leading-relaxed text-[#C9C1B2]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* iii. Organized by */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">iii.</span>
                Organized by
              </h2>
              <div className="bg-[#1E1A14] border border-[rgba(247,244,238,0.10)] p-8 flex flex-col sm:flex-row gap-6">
                <div className="w-16 h-16 bg-[#221D16] border border-[rgba(200,168,95,0.25)] flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-[28px] text-[#C8A85F]">{event.artist.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-serif text-[22px] text-[#F7F4EE] mb-1">{event.artist}</h3>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C8A85F] mb-3">Independent Cultural Platform</div>
                  <p className="font-sans text-[13px] leading-relaxed text-[#C9C1B2]">
                    {event.artistBio || "An independent cultural platform championing art, live music and community since 2019."}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue — mobile only (desktop sees this in the sidebar map card) */}
            <div className="lg:hidden mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">iv.</span>
                Venue
              </h2>
              <div className="bg-[#1E1A14] border border-[rgba(200,168,95,0.15)] rounded-[8px] overflow-hidden">
                {/* Map placeholder */}
                <div className="w-full h-[160px] bg-[#221D16] relative flex items-center justify-center">
                  <MapPin size={28} className="text-[#C8A85F]" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(247,244,238,0.05)]" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-[rgba(247,244,238,0.05)]" />
                  <div className="absolute top-0 bottom-0 right-1/4 w-[2px] bg-[rgba(247,244,238,0.04)]" />
                </div>
                {/* Venue info */}
                <div className="p-6">
                  <h3 className="font-serif text-[20px] font-medium text-[#F7F4EE] mb-1">{event.venue}</h3>
                  <p className="font-sans text-[13px] text-[#8A8278] mb-5">{event.city}, India</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] font-semibold text-[#C8A85F] hover:text-[#F7F4EE] transition-colors uppercase"
                  >
                    <MapPin size={12} />
                    Get Directions ↗
                  </a>
                </div>
              </div>
            </div>

            {/* v. Questions? */}
            <div className="mb-16">
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">v.</span>
                Questions?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#1E1A14] border border-[rgba(247,244,238,0.10)] p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#221D16] border border-[rgba(200,168,95,0.25)] flex items-center justify-center text-[#C8A85F]">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Call</div>
                    <div className="font-sans text-[15px] font-medium text-[#F7F4EE]">+91 98454 21170</div>
                  </div>
                </div>
                <div className="bg-[#1E1A14] border border-[rgba(247,244,238,0.10)] p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#221D16] border border-[rgba(200,168,95,0.25)] flex items-center justify-center text-[#C8A85F]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#8A8278] mb-1">Email</div>
                    <div className="font-sans text-[15px] font-medium text-[#F7F4EE]">hello@thestage.in</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Facebook,  label: 'Facebook'  },
                  { icon: Twitter,   label: 'Twitter'   },
                  { icon: Globe,     label: 'Website'   },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="bg-[#1E1A14] border border-[rgba(247,244,238,0.10)] px-4 py-2.5 flex items-center gap-2 font-sans text-[11px] font-medium text-[#C9C1B2] hover:text-[#F7F4EE] hover:border-[#C8A85F] transition-colors rounded-[4px]"
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* v. Fine print */}
            <div className="mb-10">
              <h2 className="font-serif text-[28px] mb-6 text-[#F7F4EE]">
                <span className="italic text-[#C8A85F] mr-3 font-serif text-[24px]">vi.</span>
                Fine print
              </h2>
              <ul className="space-y-3 font-sans text-[13.5px] text-[#C9C1B2] pl-4 marker:text-[#C8A85F]" style={{ listStyleType: 'disc' }}>
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
              <div
                className="bg-[#1E1A14] text-[#F7F4EE] rounded-[8px] overflow-hidden"
                style={{ border: '1px solid rgba(200,168,95,0.22)' }}
              >
                {/* Top */}
                <div className="p-8 pb-6">
                  <div className="flex justify-between items-start mb-6 font-mono text-[10px] tracking-[0.2em] text-[#8A8278] leading-relaxed">
                    <div>ADMISSION</div>
                    <div className="text-right">
                      NO. 004<br />
                      2026 - APR<br />
                      STG - FST
                    </div>
                  </div>
                  <h2 className="font-serif text-[42px] font-medium leading-none text-[#C8A85F]">
                    {event.price === 0 ? 'Free Entry' : `₹${event.price}`}
                  </h2>
                </div>

                <div className="border-t border-dashed border-[rgba(200,168,95,0.20)] mx-4" />

                {/* Actions */}
                <div className="p-8 py-6 flex flex-col gap-3">
                  <button className="w-full bg-[#C8A85F] hover:bg-[#D4B570] text-[#14110D] font-sans font-bold text-[11px] tracking-[0.15em] uppercase py-4 rounded-[4px] flex items-center justify-center gap-2 transition-colors">
                    Reserve Your Spot ↗
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#221D16] border border-[rgba(247,244,238,0.10)] hover:border-[#C8A85F] text-[#F7F4EE] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors">
                      + Attending
                    </button>
                    <button className="flex-1 bg-[#221D16] border border-[rgba(247,244,238,0.10)] hover:border-[#C8A85F] text-[#F7F4EE] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] transition-colors">
                      Maybe
                    </button>
                  </div>
                  <button className="w-full bg-[#221D16] border border-[rgba(247,244,238,0.10)] hover:border-[#C8A85F] text-[#F7F4EE] font-sans font-bold text-[10px] tracking-[0.15em] uppercase py-3 rounded-[4px] flex items-center justify-center gap-2 transition-colors">
                    <Calendar size={14} />
                    Add to Calendar
                  </button>
                </div>

                <div className="border-t border-dashed border-[rgba(200,168,95,0.20)] mx-4" />

                {/* Attendees */}
                <div className="p-8 py-6 relative">
                  {/* Perforation notch — matches page bg */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#14110D] rounded-full" />
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {(['#A38952', '#4A7C6F', '#5C5470', '#2A2520'] as const).map((color, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-sans font-bold border-2 border-[#1E1A14] flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {['SS', 'RK', 'AN', '+281'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-[#F7F4EE]">284 attending</div>
                      <div className="font-sans text-[12px] text-[#8A8278]">Shilpa, Rahul and 282 others</div>
                    </div>
                  </div>
                </div>

                {/* Contact strip */}
                <div className="border-t border-[rgba(247,244,238,0.08)] bg-[#221D16] p-8 pt-6">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[#8A8278] uppercase mb-4">
                    Contact the Organizer
                  </div>
                  <div className="font-sans text-[18px] font-medium text-[#F7F4EE] mb-1">
                    +91 98454 21170
                  </div>
                  <div className="font-sans text-[14px] text-[#C9C1B2] mb-6">
                    hello@thestage.in
                  </div>
                  <div className="flex gap-3">
                    {(['IG', 'FB', 'X'] as const).map(s => (
                      <button
                        key={s}
                        className="w-10 h-10 rounded-[4px] border border-[rgba(247,244,238,0.12)] flex items-center justify-center hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors text-[#C9C1B2] font-serif text-[14px]"
                      >
                        {s}
                      </button>
                    ))}
                    <button className="flex-1 rounded-[4px] border border-[rgba(247,244,238,0.12)] flex items-center justify-center gap-2 hover:border-[#C8A85F] hover:text-[#C8A85F] transition-colors text-[11px] font-sans font-semibold text-[#C9C1B2]">
                      <Globe size={12} />
                      Website
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div
                className="bg-[#1E1A14] text-[#F7F4EE] rounded-[8px] p-6"
                style={{ border: '1px solid rgba(200,168,95,0.15)' }}
              >
                <div className="w-full h-[180px] bg-[#221D16] rounded-[4px] mb-6 relative overflow-hidden flex items-center justify-center">
                  <MapPin size={24} className="text-[#C8A85F]" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[rgba(247,244,238,0.06)]" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-[rgba(247,244,238,0.06)]" />
                </div>
                <h3 className="font-serif text-[22px] font-medium mb-1 text-[#F7F4EE]">
                  {event.venue}
                </h3>
                <p className="font-sans text-[13px] text-[#8A8278] mb-6">
                  {event.city}, India
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-[0.2em] font-semibold text-[#C8A85F] hover:text-[#F7F4EE] transition-colors flex items-center gap-2"
                >
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
            style={{ borderColor: 'rgba(247,244,238,0.10)' }}
          >
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8A85F] mb-3">More from the season</div>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-none text-[#F7F4EE]">
                  You might <em className="italic">also like</em>
                </h2>
              </div>
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] font-bold uppercase text-[#C9C1B2] hover:text-[#C8A85F] transition-colors border-b border-[rgba(247,244,238,0.25)] pb-1 hover:border-[#C8A85F]"
              >
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
          MOBILE STICKY BOTTOM BAR
      ══════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.4)]"
        aria-label="Reserve Spot"
        role="region"
        style={{ background: '#1E1A14', borderColor: 'rgba(247,244,238,0.10)' }}
      >
        <div className="flex items-center justify-between gap-4 max-w-container mx-auto">
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[22px] font-semibold leading-none mb-1 text-[#C8A85F]">
              {event.price === 0 ? 'Free' : `₹${event.price}`}
            </span>
            <span className="font-sans text-xs truncate text-[#8A8278]">
              {event.date} · {event.venue}
            </span>
          </div>
          <button
            type="button"
            className="flex-shrink-0 bg-[#C8A85F] hover:bg-[#D4B570] text-[#14110D] font-sans font-bold text-[11px] tracking-[0.15em] uppercase px-6 py-3.5 rounded-[4px] transition-colors duration-200 min-h-[48px] flex items-center gap-2"
          >
            Reserve Spot
            <ChevronRight size={14} />
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
