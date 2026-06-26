import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { App } from './App.jsx';
import { locales } from './i18n.js';

function normalizePath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const maybeLocale = parts[0];
  const locale = locales.includes(maybeLocale) ? maybeLocale : 'en';
  const page = locales.includes(maybeLocale) ? parts[1] || 'home' : 'home';

  if (!locales.includes(maybeLocale)) {
    window.history.replaceState({}, '', `/${locale}/${page === 'home' ? '' : page}`);
  }

  return { locale, page };
}

function Root() {
  const [route, setRoute] = useState(normalizePath);

  useEffect(() => {
    const onPopState = () => setRoute(normalizePath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useMemo(
    () => (locale, page = route.page) => {
      const safePage = page === 'home' ? '' : page;
      const path = `/${locale}/${safePage}`;
      window.history.pushState({}, '', path);
      setRoute({ locale, page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [route.page]
  );

  return <App route={route} navigate={navigate} />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
