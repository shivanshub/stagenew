import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryStrip from './components/CategoryStrip';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 font-sans text-sm px-4 py-2"
        style={{ background: '#C8A85F', color: '#14110D' }}
      >
        Skip to main content
      </a>

      {/* Unified top navigation — Navbar + Category strip as one block */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: '#14110D', borderBottom: '1px solid rgba(247,244,238,0.09)' }}
      >
        <Navbar />
        <CategoryStrip />
      </div>

      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/events/:slug" element={<EventDetailsPage />} />
        <Route path="*"             element={<HomePage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
