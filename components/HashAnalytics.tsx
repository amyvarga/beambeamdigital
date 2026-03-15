'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function HashAnalytics() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '/';
      track('Section View', { section: hash });
    };

    // Track the initial hash on page load
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}
