let activeFrame: number | null = null;
let removeInputListeners: (() => void) | null = null;

export function cancelElementScroll() {
  if (activeFrame !== null) {
    cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }

  removeInputListeners?.();
  removeInputListeners = null;
}

export function scrollElementToTop(element: HTMLElement) {
  cancelElementScroll();

  const scrollMarginTop = Number.parseFloat(
    window.getComputedStyle(element).scrollMarginTop,
  ) || 0;
  const startY = window.scrollY;
  const maximumY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const targetY = Math.min(
    maximumY,
    Math.max(0, startY + element.getBoundingClientRect().top - scrollMarginTop),
  );
  const distance = targetY - startY;
  const duration = 300;

  if (
    Math.abs(distance) < 1 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo({ top: targetY, behavior: 'auto' });
    return;
  }

  let startTime: number | null = null;
  const cancelOnInput = () => cancelElementScroll();

  window.addEventListener('wheel', cancelOnInput, { passive: true });
  window.addEventListener('touchstart', cancelOnInput, { passive: true });
  removeInputListeners = () => {
    window.removeEventListener('wheel', cancelOnInput);
    window.removeEventListener('touchstart', cancelOnInput);
  };

  const animate = (time: number) => {
    startTime ??= time;
    const progress = Math.min((time - startTime) / duration, 1);
    const easedProgress = progress < 0.5
      ? 16 * Math.pow(progress, 5)
      : 1 - Math.pow(-2 * progress + 2, 5) / 2;

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      activeFrame = requestAnimationFrame(animate);
    } else {
      activeFrame = null;
      removeInputListeners?.();
      removeInputListeners = null;
    }
  };

  activeFrame = requestAnimationFrame(animate);
}
