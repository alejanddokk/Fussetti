import { bindRailPlayback } from "./rail-motion.mjs?v=vitrina1";

const wrap = (index, length) => ((index % length) + length) % length;
const label = index => String(index + 1).padStart(2, "0");

export function productShot(piece, alt = "", loading = "lazy") {
  const source = piece.image.startsWith("https://") ? piece.image : "assets/" + piece.image;
  return `<span class="product-shot" data-shot="${piece.scene}"><img src="${source}" alt="${alt}" loading="${loading}" decoding="async" draggable="false"></span>`;
}

export function createGallery(pieces, shop, reducedMotion) {
  const gallery = document.querySelector(".gallery");
  const viewport = gallery.querySelector(".gallery-viewport");
  const track = gallery.querySelector(".gallery-track");
  const thumbList = gallery.querySelector(".gallery-thumbs");
  const count = gallery.querySelector("#stage-count");
  const name = gallery.querySelector("#piece-title");
  const category = gallery.querySelector("#piece-category");
  const details = gallery.querySelector("#piece-sub");
  const link = gallery.querySelector("#piece-link");
  const rotation = gallery.querySelector("[data-gallery-rotation]");
  const caption = name.parentElement;
  let selected = -1;
  let position = 0;
  let width = viewport.clientWidth;
  let drag = null;
  let settle = 0;
  let ignoredClickUntil = 0;
  let captionAnimation;

  const surfaces = pieces.map((piece, index) => {
    const product = document.createElement("a");
    product.className = "gallery-item";
    product.href = shop + piece.route;
    product.draggable = false;
    product.setAttribute("aria-label", "Ver ficha de " + piece.title);
    product.innerHTML = productShot(piece, "", index < 2 || index === pieces.length - 1 ? "eager" : "lazy");
    return product;
  });
  track.replaceChildren(...surfaces);

  const thumbs = pieces.map((piece, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-thumb";
    button.setAttribute("aria-label", piece.title);
    button.innerHTML = productShot(piece);
    button.addEventListener("click", () => goTo(index));
    return button;
  });
  thumbList.append(...thumbs);

  function stepSize() {
    return width * (width < 620 ? .54 : .43);
  }

  function offset(index, center) {
    return wrap(index - center + pieces.length / 2, pieces.length) - pieces.length / 2;
  }

  function updateSelection(index, animate) {
    if (selected === index) return;
    selected = index;
    const piece = pieces[index];
    count.textContent = label(index) + " / " + String(pieces.length).padStart(2, "0");
    name.textContent = piece.title;
    category.textContent = piece.category;
    details.textContent = piece.description;
    link.href = shop + piece.route;
    gallery.dataset.activeIndex = index;
    thumbs.forEach((thumb, i) => thumb.setAttribute("aria-pressed", String(i === index)));
    surfaces.forEach((surface, i) => {
      surface.tabIndex = i === index ? 0 : -1;
      surface.dataset.active = String(i === index);
    });
    if (animate && !reducedMotion.matches) {
      captionAnimation?.cancel();
      captionAnimation = caption.animate(
        [{ opacity: .55, translate: "0 6px" }, { opacity: 1, translate: "0 0" }],
        { duration: 380, easing: "ease-out" }
      );
    }
  }

  function paint(next, animate = true) {
    position = next;
    updateSelection(wrap(Math.round(next), pieces.length), animate);
    for (const [index, surface] of surfaces.entries()) {
      const delta = offset(index, position);
      const distance = Math.abs(delta);
      const visible = distance < 1.6;
      const marker = String(visible);
      if (surface.dataset.visible !== marker) {
        surface.dataset.visible = marker;
        surface.setAttribute("aria-hidden", String(!visible));
      }
      if (!visible) continue;
      surface.style.setProperty("--offset", delta * stepSize() + "px");
      surface.style.setProperty("--rise", Math.min(distance, 2) * 25 + "px");
      surface.style.setProperty("--scale", Math.max(.42, 1 - distance * .29));
      surface.style.setProperty("--opacity", Math.max(0, 1 - distance * .54));
      surface.style.zIndex = String(40 - Math.floor(distance * 12));
    }
  }

  const playback = bindRailPlayback({
    viewport, scope: gallery, toggle: rotation,
    blocked: () => Boolean(drag || settle),
    advance: delta => paint(position + delta / 7000),
    onReduced: () => { cancelAnimationFrame(settle); settle = 0; captionAnimation?.cancel(); paint(Math.round(position), false); },
    onMode: playing => caption.setAttribute("aria-live", playing ? "off" : "polite")
  });

  function goTo(index, transferFocus = false) {
    cancelAnimationFrame(settle);
    settle = 0;
    const from = position;
    const to = Math.round(from + offset(index, from));
    playback.hold();
    if (reducedMotion.matches || Math.abs(to - from) < .001) {
      paint(to, false);
      if (transferFocus) surfaces[selected].focus({ preventScroll: true });
      return;
    }
    const started = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - started) / 470);
      paint(from + (to - from) * (1 - (1 - t) ** 3));
      settle = t < 1 ? requestAnimationFrame(tick) : 0;
      if (!settle) {
        if (transferFocus) surfaces[selected].focus({ preventScroll: true });
        playback.refresh();
      }
    };
    settle = requestAnimationFrame(tick);
  }

  viewport.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0 || drag) return;
    cancelAnimationFrame(settle);
    settle = 0;
    ignoredClickUntil = 0;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, base: position, active: false };
    playback.refresh();
  });
  viewport.addEventListener("pointermove", event => {
    if (!drag || event.pointerId !== drag.id) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(y) > 11 && Math.abs(y) > Math.abs(x)) {
        drag = null;
        playback.hold();
        return;
      }
      if (Math.abs(x) < 8) return;
      drag.active = true;
      gallery.dataset.dragging = "true";
      viewport.setPointerCapture(event.pointerId);
    }
    if (!reducedMotion.matches) paint(drag.base - x / stepSize(), false);
  });

  function release(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const movement = drag;
    drag = null;
    gallery.dataset.dragging = "false";
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if (!movement.active) {
      playback.hold();
      return;
    }
    ignoredClickUntil = performance.now() + 400;
    const dx = movement.x - event.clientX;
    const moved = !cancelled && Math.abs(dx) > Math.min(64, stepSize() * .22);
    const start = Math.round(movement.base);
    goTo(moved ? (reducedMotion.matches ? start + Math.sign(dx) : Math.round(movement.base + dx / stepSize() + Math.sign(dx) * .29)) : start);
  }

  document.addEventListener("pointerup", event => release(event));
  document.addEventListener("pointercancel", event => release(event, true));
  viewport.addEventListener("lostpointercapture", event => {
    if (event.target === viewport) release(event, true);
  });
  viewport.addEventListener("click", event => {
    if (!event.detail || performance.now() >= ignoredClickUntil) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  gallery.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const index = wrap(selected + (event.key === "ArrowRight" ? 1 : -1), pieces.length);
    goTo(index, surfaces.includes(document.activeElement));
    if (thumbList.contains(event.target)) thumbs[index].focus({ preventScroll: true });
  });
  gallery.querySelectorAll("[data-step]").forEach(button => {
    button.addEventListener("click", () => goTo(selected + Number(button.dataset.step)));
  });

  new ResizeObserver(() => {
    width = viewport.clientWidth;
    paint(position, false);
  }).observe(viewport);
  paint(0, false);
}
