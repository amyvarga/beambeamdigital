'use client';

import { useEffect } from 'react';

export default function ActiveNavObserver() {
  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavFromHash() {
      const hash = window.location.hash;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (hash && link.getAttribute('href') === hash) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('hashchange', highlightNavFromHash);
    highlightNavFromHash();

    return () => {
      window.removeEventListener('hashchange', highlightNavFromHash);
    };
  }, []);

  return null;
}
