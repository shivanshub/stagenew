import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'EVENTS',     href: '/#events' },
  { label: 'CATEGORIES', href: '/#categories' },
  { label: 'VENUES',     href: '/#venues' },
  { label: 'ABOUT',      href: '/#about' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-250"
        style={{
          background: scrolled || menuOpen ? '#14110D' : '#14110D', // Solid dark to match screenshot
          borderBottom: '1px solid rgba(247,244,238,0.10)',
        }}
      >
        <nav
          aria-label="Primary"
          className="max-w-container mx-auto flex items-center justify-between gap-6 flex-wrap h-[70px] px-6 md:px-10"
        >
          {/* ── Logo ──────────────────────────────── */}
          <Link
            to="/"
            aria-label="The Stage Time — home"
            className="flex items-center gap-4 flex-shrink-0"
          >
            {/* Monogram circle */}
            <span
              aria-hidden="true"
              className="flex-shrink-0 grid place-items-center rounded-full"
              style={{
                width: 36, height: 36,
                border: '1px solid #A38952',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 16,
                color: '#C8A85F',
              }}
            >
              S
            </span>
            {/* Wordmark */}
            <span
              className="hidden sm:inline font-serif font-medium tracking-[0.2em] uppercase text-[#F7F4EE] text-[15px] pt-[2px]"
            >
              THE STAGE TIME
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────── */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] tracking-[0.15em] uppercase font-sans font-bold text-[#C9C1B2] hover:text-[#F7F4EE] transition-colors pt-[2px]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop actions ───────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="w-10 h-10 grid place-items-center bg-transparent border-0 cursor-pointer text-[#C9C1B2] hover:text-[#F7F4EE] hover:bg-[#F7F4EE]/5 rounded-full transition-colors"
            >
              <Search size={16} strokeWidth={2} />
            </button>

            {/* Bookmarks */}
            <button
              type="button"
              aria-label="Bookmarks"
              className="w-10 h-10 grid place-items-center bg-transparent border-0 cursor-pointer text-[#C9C1B2] hover:text-[#F7F4EE] hover:bg-[#F7F4EE]/5 rounded-full transition-colors"
            >
              <Bookmark size={16} strokeWidth={2} />
            </button>

            {/* Sign in */}
            <Link
              to="/login"
              className="ml-2 bg-[#F7F4EE] text-[#14110D] px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-sans font-bold rounded-[4px] hover:bg-[#C8A85F] transition-colors"
            >
              SIGN IN
            </Link>
          </div>

          {/* ── Mobile: search + hamburger ─────────── */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className="w-10 h-10 grid place-items-center bg-transparent border-0 cursor-pointer text-[#C9C1B2]"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(v => !v)}
              className="w-10 h-10 grid place-items-center bg-transparent border-0 cursor-pointer text-[#C9C1B2]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ──────────────────────────── */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="border-t border-[rgba(247,244,238,0.1)] bg-[#14110D]"
          >
            <nav aria-label="Mobile navigation" className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-3 border-b border-[rgba(247,244,238,0.1)] text-[13px] tracking-[0.18em] uppercase text-[#C9C1B2] font-medium hover:text-[#F7F4EE]"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="mt-4 text-center py-3 bg-[#F7F4EE] text-[#14110D] text-[11px] tracking-[0.2em] uppercase font-bold rounded-[4px]"
              >
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Nav spacer */}
      <div aria-hidden="true" style={{ height: 70 }} />
    </>
  );
}
