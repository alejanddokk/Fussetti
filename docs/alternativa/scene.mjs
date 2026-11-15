const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const curve = "cubic-bezier(.18,.68,.3,1)";
let observer;
const headings = "h1, h2, h3";
const cards = ".product-card, .sf-card, .tf-category, .decision-compare-card, .part-result-card, .branch-card";
const menus = ".sf-area-nav, .care-nav, .guide-type-nav, .tv-focus-heading > a, .tf-category-grid";

function enter(element, delay, isHeading) {
  const start = isHeading ? "0 13px" : "0 8px";
  element.animate(
    [{ opacity: .38, translate: start }, { opacity: 1, translate: "0 0" }],
    { duration: isHeading ? 620 : 490, delay, easing: curve, fill: "backwards" }
  );
}

export function revealRoute() {
  observer?.disconnect();
  if (reducedMotion.matches) return;
  const main = document.querySelector("main#contenido");
  if (!main) return;
  const elements = [
    ...main.querySelectorAll([headings, cards, menus].join(", "))
  ].filter(element => !element.closest('.sr-only, .moto-sr, [hidden], [inert], [data-moto-slide], [data-focus-summary]'));

  observer = new IntersectionObserver(entries => {
    let visibleIndex = 0;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (reducedMotion.matches || !target.isConnected) continue;
      const isHeading = target.matches(headings);
      enter(target, Math.min(visibleIndex++ * 35, 140), isHeading);
      if (isHeading && target.previousElementSibling?.matches('.eyebrow, .parts-kicker, .tf-kicker, .tv-eyebrow, .hs-kicker')) {
        enter(target.previousElementSibling, 0, false);
      }
      if (isHeading && target.nextElementSibling?.matches("p")) enter(target.nextElementSibling, 95, false);
    }
  }, { threshold: .12 });
  for (const element of elements) {
    if (element.matches(headings) && element.closest(cards)) continue;
    observer.observe(element);
  }
}
