import { useState, useEffect } from 'react';
import { Event } from '../data/events';

const WORKER_URL = import.meta.env.VITE_WORKER_URL as string;

export function useEvents(category?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = category
      ? `${WORKER_URL}/events?category=${encodeURIComponent(category)}`
      : `${WORKER_URL}/events`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch events');
        return r.json() as Promise<Event[]>;
      })
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { events, loading, error };
}

export function useEvent(slug: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${WORKER_URL}/events/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Event not found');
        return r.json() as Promise<Event>;
      })
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { event, loading, error };
}
