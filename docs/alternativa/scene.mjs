const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

export function revealRoute() {
  if (reducedMotion.matches) return;
  const page = document.querySelector("main#contenido > section");
  if (!page) return;
  page.animate([
    { opacity: .78, transform: "translateY(7px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 340, easing: "cubic-bezier(.18,.68,.3,1)" });
}
