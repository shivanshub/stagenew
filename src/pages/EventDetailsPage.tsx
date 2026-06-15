import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Globe, AlertCircle, ChevronRight } from 'lucide-react';
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
    <main id="main-content">

      {/* ══════════════════════════════════════════════
          HERO IMAGE
      ══════════════════════════════════════════════ */}
      <section
        aria-label="Event hero"
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(320px, 55vw, 580px)' }}
      >
        <img
          src={event.heroImage || event.image}
          alt={event.title}
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.55)' }}
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0 max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="btn-press inline-flex items-center gap-2 font-sans text-sm px-4 py-2.5 border transition-colors duration-200 min-h-[44px]"
            style={{ borderColor: 'rgba(247,244,238,0.2)', color: '#C4B896', background: 'rgba(20,17,13,0.5)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8A85F'; (e.currentTarget as HTMLElement).style.color = '#C8A85F'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,244,238,0.2)'; (e.currentTarget as HTMLElement).style.color = '#C4B896'; }}
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-container mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-sans text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1"
              style={{ background: 'rgba(200,168,95,0.18)', color: '#C8A85F', letterSpacing: '0.2em' }}
            >
              {event.category}
            </span>
            {event.isNew && (
              <span
                className="font-sans text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1"
                style={{ background: '#C8A85F', color: '#14110D', letterSpacing: '0.14em' }}
              >
                New
              </span>
            )}
          </div>
          <h1
            className="font-serif font-semibold leading-tight"
            style={{
              color: '#F7F4EE',
              fontSize: 'clamp(1.9rem, 5vw, 3.5rem)',
            }}
          >
            {event.title}
          </h1>
          {event.subtitle && (
            <p
              className="font-sans text-base mt-1"
              style={{ color: '#C4B896' }}
            >
              {event.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════════════ */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 md:py-14">

          {/* ── LEFT: Details ─────────────────────────── */}
          <article className="lg:col-span-2" aria-label="Event details">

            {/* Quick meta strip */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 mb-8"
              style={{ background: '#1C1712', border: '1px solid #3A3026' }}
            >
              {[
                { icon: Calendar, label: 'Date', value: event.date },
                { icon: Clock, label: 'Time', value: event.time },
                { icon: MapPin, label: 'Venue', value: event.venue },
                { icon: Globe, label: 'Language', value: event.language },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#8A7D64', letterSpacing: '0.15em' }}>
                    <Icon size={10} />
                    {label}
                  </div>
                  <p className="font-sans text-sm font-medium" style={{ color: '#F7F4EE' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Seats warning (if low) */}
            {event.seatsLeft !== undefined && event.seatsLeft < 40 && (
              <div
                className="flex items-center gap-3 px-4 py-3 mb-6"
                role="alert"
                style={{ background: 'rgba(232,147,90,0.1)', border: '1px solid rgba(232,147,90,0.3)' }}
              >
                <AlertCircle size={16} style={{ color: '#E8935A', flexShrink: 0 }} />
                <p className="font-sans text-sm" style={{ color: '#E8935A' }}>
                  <strong>{event.seatsLeft} seats</strong> remaining. Book soon to avoid missing out.
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mb-10">
              <h2
                className="font-serif text-xl md:text-2xl font-semibold mb-4"
                style={{ color: '#F7F4EE' }}
              >
                About the Performance
              </h2>
              <div className="gold-rule mb-6" />
              {event.longDescription.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-base leading-relaxed mb-4"
                  style={{ color: '#C4B896' }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* About the Artist */}
            <div
              className="p-6 md:p-8 mb-8"
              style={{ background: '#1C1712', border: '1px solid #3A3026' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1" style={{ background: '#3A3026' }} />
                <span
                  className="font-sans text-[10px] font-semibold tracking-widest uppercase flex-shrink-0"
                  style={{ color: '#C8A85F', letterSpacing: '0.22em' }}
                >
                  The Artist
                </span>
                <div className="h-px flex-1" style={{ background: '#3A3026' }} />
              </div>

              <h3
                className="font-serif text-lg md:text-xl font-semibold mb-3"
                style={{ color: '#F7F4EE' }}
              >
                {event.artist}
              </h3>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: '#C4B896' }}
              >
                {event.artistBio}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="font-sans text-xs px-3 py-1.5"
                  style={{ background: '#1C1712', border: '1px solid #3A3026', color: '#8A7D64' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Additional info */}
            <div
              className="p-5"
              style={{ background: '#0F0D09', border: '1px solid #3A3026' }}
            >
              <h3
                className="font-sans text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#C8A85F', letterSpacing: '0.2em' }}
              >
                Event Info
              </h3>
              <dl className="grid grid-cols-2 gap-y-3">
                {[
                  ['Duration', event.duration],
                  ['Age Rating', event.ageRating],
                  ['Language', event.language],
                  ['City', event.city],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-sans text-xs" style={{ color: '#8A7D64' }}>{k}</dt>
                    <dd className="font-sans text-sm font-medium mt-0.5" style={{ color: '#C4B896' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </article>

          {/* ── RIGHT: Ticket Sidebar (Desktop) ──────── */}
          <aside
            aria-label="Book tickets"
            className="hidden lg:block"
          >
            <div
              className="sticky top-24 ticket-card p-6"
            >
              {/* Price */}
              <div className="mb-6">
                <p className="font-sans text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#8A7D64', letterSpacing: '0.18em' }}>
                  Tickets from
                </p>
                <p className="font-serif text-3xl font-semibold" style={{ color: '#C8A85F' }}>
                  ₹{event.price}
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: '#8A7D64' }}>
                  {event.priceLabel}
                </p>
              </div>

              {/* Event summary */}
              <div
                className="p-4 mb-6 space-y-3"
                style={{ background: '#0F0D09' }}
              >
                <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#C4B896' }}>
                  <Calendar size={13} style={{ color: '#C8A85F', flexShrink: 0 }} />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#C4B896' }}>
                  <Clock size={13} style={{ color: '#C8A85F', flexShrink: 0 }} />
                  {event.time} · {event.duration}
                </div>
                <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#C4B896' }}>
                  <MapPin size={13} style={{ color: '#C8A85F', flexShrink: 0 }} />
                  {event.venue}
                </div>
                <div className="flex items-center gap-2 font-sans text-sm" style={{ color: '#C4B896' }}>
                  <Users size={13} style={{ color: '#C8A85F', flexShrink: 0 }} />
                  {event.ageRating}
                </div>
              </div>

              {/* Seats left */}
              {event.seatsLeft !== undefined && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-xs" style={{ color: '#8A7D64' }}>Seats available</span>
                    <span
                      className="font-sans text-xs font-semibold"
                      style={{ color: event.seatsLeft < 30 ? '#E8935A' : '#C8A85F' }}
                    >
                      {event.seatsLeft} left
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1" style={{ background: '#24201A' }}>
                    <div
                      className="h-1 transition-all"
                      style={{
                        width: `${Math.min((event.seatsLeft / 200) * 100, 100)}%`,
                        background: event.seatsLeft < 30 ? '#E8935A' : '#C8A85F',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Book button */}
              <button
                type="button"
                className="btn-press w-full font-sans font-semibold text-sm py-4 transition-colors duration-200 min-h-[52px] mb-3 flex items-center justify-center gap-2"
                style={{ background: '#C8A85F', color: '#14110D' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#D4B96E'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C8A85F'; }}
              >
                Book Tickets
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                className="btn-press w-full font-sans text-sm py-3 transition-colors duration-200 border min-h-[44px]"
                style={{ borderColor: '#3A3026', color: '#8A7D64' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8A85F'; (e.currentTarget as HTMLElement).style.color = '#C8A85F'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#3A3026'; (e.currentTarget as HTMLElement).style.color = '#8A7D64'; }}
              >
                Save to Wishlist
              </button>

              {/* Trust note */}
              <p className="font-sans text-[11px] text-center mt-4" style={{ color: '#3A3026' }}>
                Secure payment · Instant confirmation
              </p>
            </div>
          </aside>

        </div>

        {/* ══════════════════════════════════════════════
            VENUE SECTION
        ══════════════════════════════════════════════ */}
        <section
          aria-label="Venue"
          className="py-10 border-t mb-12"
          style={{ borderColor: '#3A3026' }}
        >
          <h2
            className="font-serif text-xl md:text-2xl font-semibold mb-6"
            style={{ color: '#F7F4EE' }}
          >
            Venue
          </h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div
              className="sm:w-1/3 p-5"
              style={{ background: '#1C1712', border: '1px solid #3A3026' }}
            >
              <h3
                className="font-serif text-base font-semibold mb-1"
                style={{ color: '#F7F4EE' }}
              >
                {event.venue}
              </h3>
              <p className="font-sans text-sm" style={{ color: '#8A7D64' }}>
                {event.city}, India
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-xs mt-4 gold-link transition-colors"
                style={{ color: '#C8A85F' }}
              >
                <MapPin size={12} />
                Get Directions
              </a>
            </div>

            {/* Map placeholder */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{ minHeight: 200, background: '#1C1712', border: '1px solid #3A3026' }}
            >
              <img
                src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/0,0,1/600x200?access_token=placeholder`}
                alt={`Map showing ${event.venue}`}
                className="w-full h-full object-cover"
                style={{ opacity: 0 }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2" style={{ color: '#3A3026' }} />
                  <p className="font-sans text-xs" style={{ color: '#3A3026' }}>
                    {event.venue}, {event.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            RELATED EVENTS
        ══════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section
            aria-label="Related events"
            className="py-10 border-t mb-32 lg:mb-16"
            style={{ borderColor: '#3A3026' }}
          >
            <div className="flex items-end justify-between mb-8">
              <h2
                className="font-serif text-xl md:text-2xl font-semibold"
                style={{ color: '#F7F4EE' }}
              >
                More in {event.category}
              </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {related.map(evt => (
                <div key={evt.id} className="flex-shrink-0 snap-start">
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
        className="sticky-bottom-bar lg:hidden"
        aria-label="Book tickets"
        role="region"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Price + Meta */}
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-xl font-semibold" style={{ color: '#C8A85F' }}>
              ₹{event.price}+
            </span>
            <span className="font-sans text-xs truncate" style={{ color: '#8A7D64' }}>
              {event.date} · {event.venue}
            </span>
          </div>

          {/* Right: CTA */}
          <button
            type="button"
            className="btn-press flex-shrink-0 font-sans font-semibold text-sm px-6 py-3.5 transition-colors duration-200 min-h-[48px] flex items-center gap-2"
            style={{ background: '#C8A85F', color: '#14110D' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#D4B96E'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C8A85F'; }}
          >
            Book Tickets
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Seats low warning in bottom bar */}
        {event.seatsLeft !== undefined && event.seatsLeft < 30 && (
          <p
            className="font-sans text-[11px] text-center mt-2"
            style={{ color: '#E8935A' }}
            role="alert"
          >
            ⚠ Only {event.seatsLeft} seats left
          </p>
        )}
      </div>

    </main>
  );
}
