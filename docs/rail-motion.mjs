export function bindRailPlayback({ viewport, scope, toggle, advance, blocked = () => false, onMode = () => {}, onReduced = () => {} }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const { signal } = listeners;
  let inView = false;
  let paused = false;
  let frame = 0;
  let wake = 0;
  let previous = 0;
  let resumeAt = 0;
  let disposed = false;
  let playing;

  function setPlaying(value) {
    if (playing === value) return;
    playing = value;
    scope.dataset.playing = String(value);
    onMode(value);
  }

  function canRun() {
    const active = document.activeElement;
    const keyboardFocus = active !== toggle && scope.contains(active) && active?.matches(":focus-visible");
    return !disposed && inView && !paused && !reduced.matches && !document.hidden &&
      !keyboardFocus && !blocked() && !document.querySelector("dialog[open]");
  }

  function tick(now) {
    frame = 0;
    if (!canRun()) {
      setPlaying(false);
      return;
    }
    const delta = previous ? Math.min(now - previous, 42) : 0;
    previous = now;
    if (delta) advance(delta);
    frame = requestAnimationFrame(tick);
  }

  function refresh() {
    cancelAnimationFrame(frame);
    clearTimeout(wake);
    previous = 0;
    toggle.hidden = reduced.matches;
    const label = paused ? "Reanudar" : "Pausar";
    if (toggle.textContent !== label) toggle.textContent = label;
    if (!canRun()) {
      setPlaying(false);
      return;
    }
    const delay = resumeAt - performance.now();
    if (delay > 0) {
      setPlaying(false);
      wake = setTimeout(refresh, delay);
      return;
    }
    setPlaying(true);
    frame = requestAnimationFrame(tick);
  }

  function hold(duration = 1150) {
    resumeAt = performance.now() + duration;
    refresh();
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    refresh();
  }, { threshold: .18 });
  observer.observe(viewport);

  toggle.addEventListener("click", () => {
    paused = !paused;
    resumeAt = 0;
    refresh();
  }, { signal });
  scope.addEventListener("focusin", refresh, { signal });
  scope.addEventListener("focusout", () => queueMicrotask(refresh), { signal });
  document.addEventListener("visibilitychange", refresh, { signal });
  document.addEventListener("close", refresh, { signal, capture: true });
  reduced.addEventListener("change", () => {
    if (reduced.matches) onReduced();
    refresh();
  }, { signal });
  refresh();

  return {
    hold,
    refresh,
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      clearTimeout(wake);
      observer.disconnect();
      listeners.abort();
    }
  };
}
