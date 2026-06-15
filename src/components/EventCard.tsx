import { Link } from 'react-router-dom';
import type { Event } from '../data/events';
import { MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'wide' | 'compact';
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/events/${event.slug}`}
        className="flex gap-4 group card-hover items-start p-3 border-b"
        style={{ borderColor: '#3A3026' }}
      >
        <div
          className="flex-shrink-0 w-16 h-16 overflow-hidden"
          style={{ background: '#24201A' }}
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <span
            className="font-sans text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: '#C8A85F', letterSpacing: '0.18em' }}
          >
            {event.category}
          </span>
          <h3
            className="font-serif text-sm font-medium mt-0.5 leading-snug line-clamp-2"
            style={{ color: '#F7F4EE' }}
          >
            {event.title}
          </h3>
          <p className="font-sans text-xs mt-1" style={{ color: '#8A7D64' }}>
            {event.date} · {event.city}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'wide') {
    return (
      <Link
        to={`/events/${event.slug}`}
        className="relative flex gap-0 group card-hover overflow-hidden"
        style={{ background: '#1C1712', border: '1px solid #3A3026' }}
      >
        {/* Image — left 40% */}
        <div className="w-2/5 relative overflow-hidden flex-shrink-0" style={{ minHeight: 220 }}>
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 card-img-overlay" />
        </div>

        {/* Content — right 60% */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-sans text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5"
                style={{ background: 'rgba(200,168,95,0.12)', color: '#C8A85F', letterSpacing: '0.18em' }}
              >
                {event.category}
              </span>
              {event.seatsLeft !== undefined && event.seatsLeft < 30 && (
                <span
                  className="font-sans text-[10px] font-medium tracking-wide"
                  style={{ color: '#E8935A' }}
                >
                  {event.seatsLeft} seats left
                </span>
              )}
            </div>

            <h3
              className="font-serif text-xl lg:text-2xl font-semibold leading-tight mb-1"
              style={{ color: '#F7F4EE' }}
            >
              {event.title}
            </h3>
            {event.subtitle && (
              <p className="font-sans text-sm mb-3" style={{ color: '#8A7D64' }}>
                {event.subtitle}
              </p>
            )}
            <p className="font-sans text-sm leading-relaxed line-clamp-2" style={{ color: '#C4B896' }}>
              {event.description}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-sans" style={{ color: '#8A7D64' }}>
                <Clock size={11} />
                <span>{event.date} · {event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-sans" style={{ color: '#8A7D64' }}>
                <MapPin size={11} />
                <span>{event.venue}, {event.city}</span>
              </div>
            </div>
            <span
              className="font-serif text-lg font-medium"
              style={{ color: '#C8A85F' }}
            >
              {event.priceLabel}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default vertical card
  return (
    <Link
      to={`/events/${event.slug}`}
      className="relative flex flex-col group card-hover overflow-hidden flex-shrink-0"
      style={{
        background: '#1C1712',
        border: '1px solid #3A3026',
        width: '260px',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 180 }}>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 card-img-overlay" />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 font-sans text-[9px] font-semibold tracking-widest uppercase px-2 py-1"
          style={{ background: 'rgba(20,17,13,0.82)', color: '#C8A85F', letterSpacing: '0.16em' }}
        >
          {event.category}
        </span>

        {/* New badge */}
        {event.isNew && (
          <span
            className="absolute top-3 right-3 font-sans text-[9px] font-semibold tracking-widest uppercase px-2 py-1"
            style={{ background: '#C8A85F', color: '#14110D', letterSpacing: '0.14em' }}
          >
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-serif text-base font-semibold leading-snug mb-1 line-clamp-2"
          style={{ color: '#F7F4EE' }}
        >
          {event.title}
        </h3>
        {event.artist && (
          <p className="font-sans text-xs mb-3 line-clamp-1" style={{ color: '#8A7D64' }}>
            {event.artist}
          </p>
        )}

        <div className="mt-auto pt-3 border-t flex items-center justify-between" style={{ borderColor: '#3A3026' }}>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 font-sans text-xs" style={{ color: '#8A7D64' }}>
              <Clock size={10} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1 font-sans text-xs" style={{ color: '#8A7D64' }}>
              <MapPin size={10} />
              <span>{event.city}</span>
            </div>
          </div>
          <span className="font-sans text-sm font-semibold" style={{ color: '#C8A85F' }}>
            ₹{event.price}+
          </span>
        </div>

        {event.seatsLeft !== undefined && event.seatsLeft < 30 && (
          <p className="font-sans text-[10px] mt-2" style={{ color: '#E8935A' }}>
            Only {event.seatsLeft} seats left
          </p>
        )}
      </div>
    </Link>
  );
}
