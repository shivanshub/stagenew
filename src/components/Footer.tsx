import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter } from 'lucide-react';

const FOOTER_LINKS = {
  Discover: ['Events', 'Artists', 'Venues', 'Cities', 'Genres'],
  Company: ['About Us', 'Press Kit', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Use', 'Refund Policy', 'Accessibility'],
};

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t mt-24"
      style={{ borderColor: '#3A3026', background: '#0F0D09' }}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-6" aria-label="The Stage Time">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#A38952" strokeWidth="1.5" />
                </svg>
                <span className="font-serif text-xl font-semibold relative z-10" style={{ color: '#C8A85F' }}>
                  S
                </span>
              </div>
              <div>
                <p className="font-serif text-base tracking-brand uppercase" style={{ color: '#F7F4EE', letterSpacing: '0.18em' }}>
                  The Stage Time
                </p>
                <p className="font-sans text-[10px] tracking-widest uppercase" style={{ color: '#8A7D64', letterSpacing: '0.22em' }}>
                  India's Live Arts
                </p>
              </div>
            </Link>

            <p className="font-sans text-sm leading-relaxed max-w-xs" style={{ color: '#8A7D64' }}>
              Curating India's finest live performing arts — classical music, theatre, dance, comedy, folk, and beyond. One stage at a time.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-8">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border gold-link transition-colors"
                  style={{ borderColor: '#3A3026', color: '#8A7D64' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3
                className="font-sans text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ color: '#C8A85F', letterSpacing: '0.2em' }}
              >
                {group}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-sans text-sm gold-link transition-colors"
                      style={{ color: '#8A7D64' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Gold rule */}
        <div className="gold-rule" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs" style={{ color: '#8A7D64' }}>
            © 2025 The Stage Time. All rights reserved.
          </p>
          <p className="font-sans text-xs" style={{ color: '#3A3026' }}>
            Made with care for India's performing artists.
          </p>
        </div>

      </div>
    </footer>
  );
}
