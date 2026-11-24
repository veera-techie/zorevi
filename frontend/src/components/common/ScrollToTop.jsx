import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that navigating to any new route
 * scrolls the window to the top immediately (0, 0) without interference from
 * browser scroll restoration or CSS smooth scrolling.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent browser from automatically restoring previous scroll positions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      // Temporarily override any CSS smooth scrolling on html/body for instant top jump
      const html = document.documentElement;
      const prevBehavior = html ? html.style.scrollBehavior : '';
      if (html) html.style.scrollBehavior = 'auto';

      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      // Repeat in next frame and microtask to catch asynchronous DOM updates/image layouts
      const rAF = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        if (html) html.style.scrollBehavior = prevBehavior;
      });

      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }, 30);

      return () => {
        cancelAnimationFrame(rAF);
        clearTimeout(timer);
        if (html) html.style.scrollBehavior = prevBehavior;
      };
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, search, hash]);

  return null;
}


