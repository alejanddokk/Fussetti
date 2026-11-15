const shop = "./alternativa/";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const desktopPointer = matchMedia("(pointer: fine) and (min-width: 741px)");

const pieces = [
  { scene: "wave", category: "Motos", title: "Honda Wave 110 S", word: "WAVE", description: "Tu próximo camino.", image: "honda.jpg", route: "#producto/honda-wave-110-s" },
  { scene: "philips", category: "TV y audio", title: "Smart TV Philips 50″", word: "PHILIPS", description: "Pantalla de 50″ · UHD 4K", image: "philips.jpg", route: "#producto/hogar-3-1" },
  { scene: "rca", category: "Climatización", title: "Aire acondicionado RCA", word: "RCA", description: "5400 W · Frío / calor", image: "rca.jpg", route: "#producto/cyber-3081", offer: { name: "Aire acondicionado RCA 5400 W", old: "$ 1.061.800,00", price: "$ 1.000.000,00", installments: "$ 333.333,33" } },
  { scene: "viking", category: "Bicicletas", title: "Viking X Jump", word: "VIKING", description: "Aluminio · 8 velocidades · Rodado 26", image: "viking.png", route: "#producto/cyber-3515", offer: { name: "Bicicleta Viking X Jump R26", old: "$ 833.500,00", price: "$ 816.500,00", installments: "$ 272.166,66" } },
  { scene: "oven", category: "Hornos eléctricos", title: "Horno eléctrico Kanji", word: "KANJI", description: "100 litros · HE100G", image: "kanji-oven.png", route: "#producto/hogar-0-1", offer: { name: "Horno eléctrico Kanji 100 L", old: "$ 260.300,00", price: "$ 234.270,00", installments: "$ 78.090,00" } },
  { scene: "fridge", category: "Heladeras", title: "Heladera Kanji 138 L", word: "KANJI", description: "138 litros · Sistema cíclico", image: "kanji-fridge.jpg", route: "#producto/cyber-3703", offer: { name: "Heladera Kanji 138 L", old: "$ 462.300,00", price: "$ 437.300,00", installments: "$ 145.766,66" } }
];

const departments = [
  ["Hogar", "#hogar", "hogar.jpg"],
  ["Electrodomésticos", "#electrodomesticos", "electro.jpg"],
  ["Tecnología", "#tecnologia", "tecno.jpg"],
  ["TV y audio", "#tv-audio", "audio.png"],
  ["Climatización", "#catalogo?cat=Climatizaci%C3%B3n"],
  ["Jardín", "#catalogo?cat=Jard%C3%ADn"],
  ["Motos", "#motos-focus", "honda.jpg"],
  ["Repuestos", "#catalogo?cat=Repuestos", "motul.webp"]
];

const offers = document.querySelector("#offers");
for (const index of [2, 4, 5, 3]) {
  const piece = pieces[index];
  const { name, old, price, installments } = piece.offer;
  const link = document.createElement("a");
  link.className = "offer-card reveal";
  link.href = shop + piece.route;
  link.innerHTML = `
    <div class="offer-photo"><span>CYBER DEMO</span><img src="assets/${piece.image}" alt="" loading="lazy" decoding="async"></div>
    <div class="offer-meta"><h3>${name}</h3><del>${old}</del><strong>${price}</strong><small>3 cuotas demo desde ${installments}</small><span class="text-link">Ver ficha <span aria-hidden="true">↗</span></span></div>
  `;
  offers.append(link);
}

const departmentList = document.querySelector("#department-list");
for (const [title, route, image] of departments) {
  const link = document.createElement("a");
  link.className = image ? "department reveal" : "department compact reveal";
  link.href = shop + route;
  if (image) {
    const photo = document.createElement("div");
    photo.className = "department-media";
    photo.innerHTML = `<img src="assets/${image}" alt="" loading="lazy" decoding="async">`;
    link.append(photo);
  }
  const text = document.createElement("span");
  text.className = "department-label";
  text.innerHTML = `<span>${title}</span><span aria-hidden="true">↗</span>`;
  link.append(text);
  departmentList.append(link);
}

const exhibit = document.querySelector(".exhibit");
const exhibitImage = exhibit.querySelector(".exhibit-image");
const exhibitWord = exhibit.querySelector(".exhibit-word");
const iris = exhibit.querySelector(".exhibit-iris");
const title = document.querySelector("#piece-title");
const category = document.querySelector("#piece-category");
const description = document.querySelector("#piece-sub");
const pieceLink = document.querySelector("#piece-link");
const count = document.querySelector("#stage-count");
const selectionButtons = [...document.querySelectorAll("[data-piece]")];
let selection = 0;
let stageAnimations = [];
const preparedImages = new Map();

function prepareImage(piece) {
  if (!preparedImages.has(piece.image)) {
    const img = new Image();
    img.src = "assets/" + piece.image;
    preparedImages.set(piece.image, img);
  }
  return preparedImages.get(piece.image);
}

function showPiece(index) {
  const next = (index + pieces.length) % pieces.length;
  if (next === selection) return;
  selection = next;
  const piece = pieces[next];
  stageAnimations.forEach(animation => animation.cancel());

  exhibit.dataset.scene = piece.scene;
  selectionButtons.forEach((button, i) => button.setAttribute("aria-pressed", i === next));
  exhibitWord.textContent = piece.word;
  const image = prepareImage(piece);
  image.alt = piece.title;
  image.className = piece.scene === "wave" ? "" : "photo-tile";
  exhibitImage.classList.toggle("wave-mask", piece.scene === "wave");
  exhibitImage.replaceChildren(image);
  category.textContent = piece.category;
  title.textContent = piece.title;
  description.textContent = piece.description;
  pieceLink.href = shop + piece.route;
  count.textContent = String(next + 1).padStart(2, "0") + " / " + String(pieces.length).padStart(2, "0");

  if (!reduceMotion.matches) {
    const ease = { duration: 650, easing: "cubic-bezier(.17,.75,.24,1)" };
    stageAnimations = [
      exhibitImage.animate([
        { opacity: 0, transform: "perspective(900px) translate3d(22px,16px,-92px) rotateY(-10deg)", clipPath: "inset(0 32% 0 32%)" },
        { opacity: 1, transform: "perspective(900px) translate3d(0,0,0) rotateY(0)", clipPath: "inset(0 0 0 0)" }
      ], ease),
      iris.animate([{ transform: "rotate(11deg) scale(.7)", opacity: .15 }, { transform: "rotate(-13deg) scale(1)", opacity: 1 }], { ...ease, duration: 840 }),
      exhibitWord.animate([{ opacity: 0, transform: "translate(-47%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], ease)
    ];
  }
  prepareImage(pieces[(next + 1) % pieces.length]);
}

selectionButtons.forEach(button => button.addEventListener("click", () => showPiece(Number(button.dataset.piece))));
document.querySelectorAll("[data-step]").forEach(button => button.addEventListener("click", () => showPiece(selection + Number(button.dataset.step))));
document.querySelector("[data-hero-product]").addEventListener("click", () => showPiece(0));
const showroom = document.querySelector(".showroom");
const warmRoom = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {
    pieces.forEach(prepareImage);
    warmRoom.disconnect();
  }
}, { rootMargin: "120px" });
warmRoom.observe(showroom);

const ads = [...document.querySelectorAll("[data-ad]")];
const adCount = document.querySelector("#ad-count");
let adIndex = 0;
document.querySelectorAll("[data-ad-step]").forEach(button => button.addEventListener("click", () => {
  adIndex = (adIndex + Number(button.dataset.adStep) + ads.length) % ads.length;
  ads.forEach((ad, index) => { ad.hidden = index !== adIndex; });
  adCount.textContent = (adIndex + 1) + " / " + ads.length;
  if (!reduceMotion.matches) {
    ads[adIndex].animate([{ opacity: .25, transform: "scale(1.035)" }, { opacity: 1, transform: "scale(1)" }], { duration: 350, easing: "ease-out" });
  }
}));

const menu = document.querySelector("#mobile-nav");
const toggle = document.querySelector(".menu-button");
function setMenu(open) {
  toggle.setAttribute("aria-expanded", open);
  menu.hidden = !open;
  if (open && !reduceMotion.matches) {
    menu.animate([{ opacity: 0, transform: "translateY(-9px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 190, easing: "ease-out" });
  }
}
toggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", event => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    toggle.focus();
  }
});

if (!reduceMotion.matches) {
  try {
    if (!location.hash || location.hash === "#inicio") {
      if (!sessionStorage.getItem("fussetti-intro")) {
        document.documentElement.classList.add("is-intro");
        sessionStorage.setItem("fussetti-intro", "seen");
      }
    }
  } catch {}

  const reveals = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      reveals.unobserve(target);
      if (!reduceMotion.matches) {
        target.animate([{ opacity: .25, transform: "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, easing: "cubic-bezier(.18,.72,.23,1)" });
      }
    });
  }, { threshold: .14 });
  document.querySelectorAll(".reveal").forEach(element => reveals.observe(element));
}
const hero = document.querySelector(".hero");
const heroObject = document.querySelector(".hero-object");
hero.addEventListener("pointermove", event => {
  if (!desktopPointer.matches || reduceMotion.matches) return;
  const bounds = hero.getBoundingClientRect();
  heroObject.style.setProperty("--mx", ((event.clientX - bounds.left) / bounds.width - .5) * 55 + "px");
  heroObject.style.setProperty("--my", ((event.clientY - bounds.top) / bounds.height - .5) * 33 + "px");
});
hero.addEventListener("pointerleave", () => {
  heroObject.style.removeProperty("--mx");
  heroObject.style.removeProperty("--my");
});

const searchDialog = document.querySelector("#catalog-search");
let searchReturn;
document.querySelectorAll("[data-search-open]").forEach(link => link.addEventListener("click", event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  searchReturn = link.closest("#mobile-nav") ? toggle : link;
  searchDialog.showModal();
}));
searchDialog.addEventListener("close", () => searchReturn?.focus({ preventScroll: true }));
document.querySelector("#home-search-form").addEventListener("submit", event => {
  event.preventDefault();
  const searchInput = document.querySelector("#home-search-query");
  const query = searchInput.value.trim();
  if (!query) {
    searchInput.value = "";
    searchInput.reportValidity();
    return;
  }
  searchDialog.close();
  location.assign(shop + "#buscar?" + new URLSearchParams({ q: query }));
});

const campaignDialog = document.querySelector("#campaign-dialog");
const expandedAd = document.querySelector("#campaign-expanded-image");
const adDescription = document.querySelector("#ad-description");
document.querySelector("[data-ad-open]").addEventListener("click", () => {
  const photo = ads[adIndex].querySelector("img");
  expandedAd.src = photo.src;
  expandedAd.alt = photo.alt;
  campaignDialog.showModal();
  campaignDialog.querySelector(".campaign-dialog-scroll").scrollLeft = 0;
});
document.querySelectorAll("[data-ad-step]").forEach(button => button.addEventListener("click", () => {
  adDescription.textContent = adIndex === 0
    ? "Publicidad de referencia sobre financiación con DNI."
    : "Publicidad de referencia sobre compras web y cuotas.";
}));

function refreshCartBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem("fussetti-alternativa-demo-v1"))?.cart;
    const quantity = Array.isArray(cart) ? cart.reduce((units, line) => units + Math.max(0, Number(line.qty) || 0), 0) : 0;
    document.querySelectorAll("[data-cart-count]").forEach(badge => {
      badge.hidden = quantity === 0;
      badge.textContent = quantity;
    });
  } catch {}
}
refreshCartBadge();
window.addEventListener("pageshow", refreshCartBadge);
window.addEventListener("storage", refreshCartBadge);
