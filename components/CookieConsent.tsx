'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const STORAGE_KEY = 'cookie-consent';
const GA_ID = 'G-BXPKJRMJD0';
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

type Consent = 'granted' | 'denied';

function readConsent(): Consent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!stored || Date.now() - stored.timestamp > TWO_YEARS_MS) return null;
    return stored.value === 'granted' || stored.value === 'denied' ? stored.value : null;
  } catch {
    return null;
  }
}

function saveConsent(value: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, timestamp: Date.now() }));
  } catch {
    // Storage blocked: the choice still applies for this page view
  }
}

function deleteGoogleAnalyticsCookies() {
  const rootDomain = window.location.hostname.replace(/^www\./, '');
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = expired;
    document.cookie = `${expired}; domain=.${rootDomain}`;
  });
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available after mount
    setConsent(stored);
    setShowBar(stored === null || window.location.hash === '#cookie-settings');

    // Any link to #cookie-settings (e.g. in the cookie policy) reopens the bar
    function handleClick(event: MouseEvent) {
      const link = (event.target as Element).closest('a[href$="#cookie-settings"]');
      if (!link) return;
      event.preventDefault();
      setShowBar(true);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function accept() {
    saveConsent('granted');
    setConsent('granted');
    setShowBar(false);
  }

  function decline() {
    saveConsent('denied');
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    deleteGoogleAnalyticsCookies();
    setConsent('denied');
    setShowBar(false);
  }

  return (
    <>
      {consent === 'granted' && <GoogleAnalytics />}
      {showBar && (
        <div className="cookie-bar" role="region" aria-label="Cookie consent">
          <p>
            I use cookies to analyse website traffic and improve your browsing experience. By
            clicking &quot;Continue&quot;, you consent to my <Link href="/cookie-policy">cookie policy</Link>.
          </p>
          <div className="cookie-bar-buttons">
            <button type="button" className="cookie-bar-decline" onClick={decline}>
              Decline
            </button>
            <button type="button" className="cookie-bar-continue" onClick={accept}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
