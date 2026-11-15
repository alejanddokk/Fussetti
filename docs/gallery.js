const wrap = (index, length) => ((index % length) + length) % length;
const label = index => String(index + 1).padStart(2, "0");

export function productShot(piece, alt = "", loading = "lazy") {
  return `<span class="product-shot" data-shot="${piece.scene}"><img src="assets/${piece.image}" alt="${alt}" loading="${loading}" decoding="async" draggable="false"></span>`;
}

export function createGallery(pieces, shop, reducedMotion) {
  const gallery = document.querySelector(".gallery");
  const viewport = gallery.querySelector(".gallery-viewport");
  const track = gallery.querySelector(".gallery-track");
  const word = gallery.querySelector(".gallery-word");
  const lamp = gallery.querySelector(".gallery-lamp");
  const thumbList = gallery.querySelector(".gallery-thumbs");
  const count = gallery.querySelector("#stage-count");
  const name = gallery.querySelector("#piece-title");
  const category = gallery.querySelector("#piece-category");
  const details = gallery.querySelector("#piece-sub");
  const link = gallery.querySelector("#piece-link");
  const dialog = document.querySelector("#showroom-photo");
  const photoTitle = dialog.querySelector("h2");
  const zoomPhoto = dialog.querySelector("[data-zoom-photo]");
  let selected = 0;
  let position = 0;
  let width = viewport.clientWidth;
  let drag = null;
  let blockedClick = false;
  let captionAnimation;
  let wordAnimation;
  let lightAnimation;

  const surfaces = pieces.map((piece, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item";
    button.dataset.slot = index;
    button.innerHTML = productShot(piece, "", index < 2 || index === pieces.length - 1 ? "eager" : "lazy");
    button.addEventListener("click", () => {
      if (index === selected) openPhoto();
      else goTo(index);
    });
    return button;
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
    return width * (width < 700 ? .52 : .345);
  }

  function offset(index, center) {
    return wrap(index - center + pieces.length / 2, pieces.length) - pieces.length / 2;
  }

  function paint() {
    for (const [index, surface] of surfaces.entries()) {
      const delta = offset(index, position);
      const distance = Math.abs(delta);
      surface.style.setProperty("--offset", delta * stepSize() + "px");
      surface.style.setProperty("--rise", Math.min(distance, 2) * 27 + "px");
      surface.style.setProperty("--scale", Math.max(.42, 1 - distance * .35));
      surface.style.setProperty("--angle", Math.max(-1, Math.min(1, delta)) * 13 + "deg");
      surface.style.setProperty("--opacity", Math.max(0, 1 - distance * .47));
      surface.style.zIndex = String(40 - Math.floor(distance * 12));
      surface.dataset.visible = String(distance < 1.75);
    }
  }

  function updateSelection(animate) {
    const piece = pieces[selected];
    gallery.dataset.scene = piece.scene;
    word.textContent = piece.word;
    count.textContent = label(selected) + " / " + String(pieces.length).padStart(2, "0");
    name.textContent = piece.title;
    category.textContent = piece.category;
    details.textContent = piece.description;
    link.href = shop + piece.route;

    thumbs.forEach((thumb, index) => thumb.setAttribute("aria-pressed", String(index === selected)));
    surfaces.forEach((surface, index) => {
      const active = index === selected;
      surface.tabIndex = active ? 0 : -1;
      surface.dataset.active = String(active);
      surface.setAttribute("aria-label", (active ? "Ampliar foto de " : "Mostrar ") + pieces[index].title);
    });
    if (animate && !reducedMotion.matches) {
      captionAnimation?.cancel();
      wordAnimation?.cancel();
      lightAnimation?.cancel();
      captionAnimation = name.parentElement.animate(
        [{ opacity: .25, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 420, easing: "cubic-bezier(.19,.72,.25,1)" }
      );
      lightAnimation = lamp.animate(
        [{ opacity: .5 }, { opacity: 1.12, offset: .42 }, { opacity: 1 }],
        { duration: 650, easing: "ease-out" }
      );
      wordAnimation = word.animate(
        [{ opacity: 0, transform: "translate(-48%,8px)" }, { opacity: 1, transform: "translate(-50%,0)" }],
        { duration: 590, easing: "cubic-bezier(.19,.72,.25,1)" }
      );
    }
  }

  function goTo(index) {
    const next = wrap(index, pieces.length);
    const changed = next !== selected;
    const transferFocus = surfaces.includes(document.activeElement);
    selected = next;
    position = next;
    if (changed) updateSelection(true);
    paint();
    if (transferFocus) surfaces[selected].focus({ preventScroll: true });
  }

  function openPhoto() {
    const piece = pieces[selected];
    photoTitle.textContent = piece.title;
    zoomPhoto.innerHTML = productShot(piece, piece.title, "eager");
    dialog.showModal();
  }

  function release(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const movement = drag;
    drag = null;
    gallery.dataset.dragging = "false";
    if (!movement.active) return;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    const distance = movement.startX - event.clientX;
    const velocity = (movement.startX - movement.lastX) / Math.max(1, performance.now() - movement.startTime);
    const commit = Math.abs(distance) > Math.min(75, stepSize() * .24) || (Math.abs(distance) > 22 && Math.abs(velocity) > .38);
    blockedClick = !cancelled;
    goTo(cancelled || !commit ? selected : selected + Math.sign(distance));
  }

  viewport.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0 || drag) return;
    blockedClick = false;
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, startTime: performance.now(), active: false };
  });
  viewport.addEventListener("pointermove", event => {
    if (!reducedMotion.matches && event.pointerType === "mouse") {
      const bounds = viewport.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      viewport.style.setProperty("--light-shift", (x * 94) + "px");
      viewport.style.setProperty("--lean-x", (x * 7) + "deg");
      viewport.style.setProperty("--lean-y", (-y * 5) + "deg");
    }
    if (!drag || event.pointerId !== drag.id) return;
    const x = event.clientX - drag.startX;
    const y = event.clientY - drag.startY;
    if (!drag.active) {
      if (Math.abs(y) > 12 && Math.abs(y) > Math.abs(x)) {
        drag = null;
        return;
      }
      if (Math.abs(x) < 9) return;
      drag.active = true;
      gallery.dataset.dragging = "true";
      viewport.setPointerCapture(event.pointerId);
    }
    drag.lastX = event.clientX;
    position = selected - Math.max(-1.16, Math.min(1.16, x / stepSize()));
    paint();
  });
  viewport.addEventListener("pointerleave", () => {
    for (const property of ["--light-shift", "--lean-x", "--lean-y"]) viewport.style.removeProperty(property);
    if (drag && !drag.active) drag = null;
  });
  viewport.addEventListener("pointerup", event => release(event));
  viewport.addEventListener("pointercancel", event => release(event, true));
  viewport.addEventListener("lostpointercapture", event => {
    if (event.target === viewport && drag?.id === event.pointerId) release(event, true);
  });
  viewport.addEventListener("click", event => {
    if (!blockedClick) return;
    event.preventDefault();
    event.stopPropagation();
    blockedClick = false;
  }, true);

  gallery.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    goTo(selected + (event.key === "ArrowRight" ? 1 : -1));
    if (thumbList.contains(event.target)) thumbs[selected].focus({ preventScroll: true });
  });
  gallery.querySelectorAll("[data-step]").forEach(button => {
    button.addEventListener("click", () => goTo(selected + Number(button.dataset.step)));
  });
  gallery.querySelector("[data-showroom-zoom]").addEventListener("click", openPhoto);
  document.querySelector("[data-hero-product]").addEventListener("click", () => goTo(0));

  const resize = new ResizeObserver(() => {
    width = viewport.clientWidth;
    paint();
  });
  resize.observe(viewport);

  updateSelection(false);
  paint();
}
