import { useEffect, useState } from 'react';

/**
 * Preloads a list of image URLs and reports progress. Stays "not ready"
 * for at least `minDurationMs` so the loading screen never just flashes
 * by on a fast/cached load. Pass a stable `urls` reference.
 */
export function useImagePreloader(urls: string[], minDurationMs = 1400) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const total = urls.length;
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDurationMs - elapsed);
      setTimeout(() => {
        if (!cancelled) setReady(true);
      }, wait);
    };

    if (total === 0) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    urls.forEach(url => {
      const img = new Image();
      const settle = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count === total) finish();
      };
      img.onload = settle;
      img.onerror = settle; // count failures too — never hang the screen
      img.src = url;
    });

    return () => {
      cancelled = true;
    };
  }, [urls, minDurationMs]);

  const progress = urls.length === 0 ? 1 : loaded / urls.length;
  return { ready, progress };
}
