import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'EVENTS',     href: '/#events' },
  { label: 'CATEGORIES', href: '/#categories' },
  { label: 'VENUES',     href: '/#venues' },
  { label: 'ABOUT',      href: '/#about' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signIn, signOut, loading } = useAuth();

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header role="banner" className="w-full">
      <nav
        aria-label="Primary"
        className="max-w-container mx-auto flex items-center justify-between gap-6 flex-wrap h-[70px] px-6 md:px-10"
      >
        {/* ── Logo ──────────────────────────────── */}
        <Link
          to="/"
          aria-label="The Stage Time — home"
          className="flex items-center gap-3 flex-shrink-0"
        >
          {/* Logo image (WebP) */}
          <img
            src="/logo.webp"
            alt="The Stage Time"
            aria-hidden="true"
            className="flex-shrink-0 rounded-full"
            style={{ width: 42, height: 42, objectFit: 'cover' }}
          />
          {/* Wordmark */}
          <span
            className="hidden sm:inline font-serif font-medium tracking-[0.2em] uppercase text-[15px] pt-[2px]"
            style={{ color: 'var(--st-ink)' }}
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
              className="text-[10px] tracking-[0.15em] uppercase font-sans font-bold transition-colors pt-[2px]"
              style={{ color: 'var(--st-ink-soft)' }}
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
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            className="theme-toggle"
          >
            <Search size={16} strokeWidth={2} />
          </button>

          {/* Bookmarks */}
          <button
            type="button"
            aria-label="Bookmarks"
            className="theme-toggle"
          >
            <Bookmark size={16} strokeWidth={2} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark'
              ? <Sun size={16} strokeWidth={2} />
              : <Moon size={16} strokeWidth={2} />
            }
          </button>

          {/* Sign in / User profile */}
          {loading ? null : user ? (
            <div className="ml-2 flex items-center gap-2">
              {user.photo && <img src={user.photo} alt="" className="w-8 h-8 rounded-full" />}
              <span className="text-[11px] tracking-[0.1em] uppercase font-sans">{user.name ?? user.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-2 text-[10px] tracking-[0.15em] uppercase font-sans font-bold rounded-[4px] transition-colors ml-1"
                style={{
                  background: 'var(--st-btn-invert-bg)',
                  color: 'var(--st-btn-invert-text)',
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="ml-2 px-6 py-2.5 text-[11px] tracking-[0.15em] uppercase font-sans font-bold rounded-[4px] transition-colors"
              style={{
                background: 'var(--st-btn-invert-bg)',
                color: 'var(--st-btn-invert-text)',
              }}
            >
              SIGN IN
            </button>
          )}
        </div>

        {/* ── Mobile: search + theme + hamburger ─────────── */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            className="theme-toggle"
          >
            <Search size={18} />
          </button>
          {/* Theme Toggle mobile */}
          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {theme === 'dark'
              ? <Sun size={17} strokeWidth={2} />
              : <Moon size={17} strokeWidth={2} />
            }
          </button>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(v => !v)}
            className="theme-toggle"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t"
          style={{ background: 'var(--st-nav-bg)', borderColor: 'var(--st-hairline)' }}
        >
          <nav aria-label="Mobile navigation" className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 border-b text-[13px] tracking-[0.18em] uppercase font-medium transition-colors"
                style={{ borderColor: 'var(--st-hairline)', color: 'var(--st-ink-soft)' }}
              >
                {link.label}
              </a>
            ))}
            {loading ? null : user ? (
              <>
                <div className="py-3 border-b" style={{ borderColor: 'var(--st-hairline)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {user.photo && <img src={user.photo} alt="" className="w-8 h-8 rounded-full" />}
                    <span className="text-[12px] tracking-[0.1em]">{user.name ?? user.email}</span>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="mt-2 w-full text-center py-3 text-[11px] tracking-[0.2em] uppercase font-bold rounded-[4px]"
                  style={{ background: 'var(--st-btn-invert-bg)', color: 'var(--st-btn-invert-text)' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                className="mt-4 text-center py-3 text-[11px] tracking-[0.2em] uppercase font-bold rounded-[4px] w-full"
                style={{ background: 'var(--st-btn-invert-bg)', color: 'var(--st-btn-invert-text)' }}
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
