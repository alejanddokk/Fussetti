import { createGallery, productShot } from "./gallery.js?v=fotos2";

const shop = "./alternativa/";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const pieces = [
  { scene: "wave", category: "Motos", title: "Honda Wave 110 S", description: "Tu próximo camino.", image: "wave-110-transparent.webp", route: "#producto/honda-wave-110-s" },
  { scene: "philips", category: "TV y audio", title: "Smart TV Philips 50″", description: "Pantalla de 50″ · UHD 4K", image: "philips.jpg", route: "#producto/hogar-3-1" },
  { scene: "rca", category: "Climatización", title: "Aire acondicionado RCA", description: "5400 W · Frío / calor", image: "rca.jpg", route: "#producto/cyber-3081", offer: { name: "Aire acondicionado RCA 5400 W", old: "$ 1.061.800,00", price: "$ 1.000.000,00", installments: "$ 333.333,33" } },
  { scene: "viking", category: "Bicicletas", title: "Viking X Jump", description: "Aluminio · 8 velocidades · Rodado 26", image: "viking.png", route: "#producto/cyber-3515", offer: { name: "Bicicleta Viking X Jump R26", old: "$ 833.500,00", price: "$ 816.500,00", installments: "$ 272.166,66" } },
  { scene: "oven", category: "Hornos eléctricos", title: "Horno eléctrico Kanji", description: "100 litros · HE100G", image: "kanji-oven.png", route: "#producto/hogar-0-1", offer: { name: "Horno eléctrico Kanji 100 L", old: "$ 260.300,00", price: "$ 234.270,00", installments: "$ 78.090,00" } },
  { scene: "fridge", category: "Heladeras", title: "Heladera Kanji 138 L", description: "138 litros · Sistema cíclico", image: "kanji-fridge.jpg", route: "#producto/cyber-3703", offer: { name: "Heladera Kanji 138 L", old: "$ 462.300,00", price: "$ 437.300,00", installments: "$ 145.766,66" } }
];

const departments = [
  ["Hogar", "#hogar", "hogar.jpg"],
  ["Electrodomésticos", "#electrodomesticos", "electro.jpg"],
  ["Tecnología", "#tecnologia", "tecno.jpg"],
  ["TV y audio", "#tv-audio", "audio.png"],
  ["Climatización", "#catalogo?cat=Climatizaci%C3%B3n", "rca.jpg"],
  ["Jardín", "#catalogo?cat=Jard%C3%ADn", "fogonero-tromen.jpg"],
  ["Motos", "#motos-focus", "wave-110-transparent.webp"],
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
    <div class="offer-photo"><span class="offer-label">CYBER DEMO</span>${productShot(piece)}</div>
    <div class="offer-meta"><h3>${name}</h3><del>${old}</del><strong>${price}</strong><small>3 cuotas demo desde ${installments}</small><span class="text-link">Ver ficha <span aria-hidden="true">↗</span></span></div>
  `;
  offers.append(link);
}

const departmentList = document.querySelector("#department-list");
const preview = document.querySelector(".directory-preview");
const previewPhoto = document.querySelector("#department-photo");
const previewLabel = document.querySelector("#department-photo-label");
let activeDepartment;
let requestedDepartment;
let previewAnimation;
const preparedPhotos = new Map();
const departmentLinks = departments.map(([title, route]) => {
  const link = document.createElement("a");
  link.className = "directory-link reveal";
  link.href = shop + route;
  link.innerHTML = `<span>${title}</span><span aria-hidden="true">↗</span>`;
  return link;
});

function prepareDepartmentPhoto(index) {
  if (preparedPhotos.has(index)) return preparedPhotos.get(index);
  const [title, , image] = departments[index];
  const scene = { Motos: "wave", Repuestos: "motul", Jardín: "garden" }[title] || image.split(".")[0];
  const photo = document.createElement("div");
  photo.innerHTML = productShot({ scene, image }, "", "eager");
  const shot = photo.firstElementChild;
  const imageNode = shot.querySelector("img");
  const prepared = imageNode.decode()
    .then(() => ({ title, scene, shot }))
    .catch(() => { preparedPhotos.delete(index); return null; });
  preparedPhotos.set(index, prepared);
  return prepared;
}

async function showDepartment(index) {
  requestedDepartment = index;
  if (activeDepartment === index) return;
  const photo = await prepareDepartmentPhoto(index);
  if (!photo || requestedDepartment !== index) return;

  activeDepartment = index;
  previewAnimation?.cancel();
  preview.dataset.department = photo.scene;
  previewLabel.textContent = photo.title;
  previewPhoto.replaceChildren(photo.shot);
  departmentLinks.forEach((link, i) => { link.dataset.preview = String(i === index); });
  if (!reduceMotion.matches) {
    previewAnimation = previewPhoto.animate(
      [{ opacity: .72, translate: "5px 0" }, { opacity: 1, translate: "0 0" }],
      { duration: 280, easing: "ease-out" }
    );
  }
}

departmentLinks.forEach((link, index) => {
  link.addEventListener("pointerenter", () => showDepartment(index));
  link.addEventListener("focus", () => showDepartment(index));
});
departmentList.append(...departmentLinks);
showDepartment(0);
const prewarmDirectory = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  prewarmDirectory.disconnect();
  departments.forEach((_, index) => prepareDepartmentPhoto(index));
}, { rootMargin: "220px" });
prewarmDirectory.observe(preview);

createGallery(pieces, shop, reduceMotion);

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
  for (const heading of document.querySelectorAll(".section-heading h2, .road h2, .support h2")) {
    const lines = heading.innerHTML.split(/<br\s*\/?\s*>/i);
    heading.replaceChildren(...lines.flatMap((line, index) => {
      const crop = document.createElement("span");
      crop.className = "title-slice";
      const text = document.createElement("span");
      text.innerHTML = line;
      crop.append(text);
      return index === 0 ? [crop] : [document.createTextNode(" "), crop];
    }));
  }

  const ease = "cubic-bezier(.18,.72,.23,1)";
  const reveals = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      reveals.unobserve(target);
      if (reduceMotion.matches) continue;
      const heading = target.querySelectorAll(".title-slice > span");
      const copy = target.querySelectorAll(
        ".eyebrow, :scope > p, .road-copy .action, .support-links a, " +
        ".offer-meta > *, .ads-head h3, .ad-note"
      );
      if (heading.length) {
        heading.forEach((line, index) => {
          const from = "translateY(106%)";
          line.animate([{ transform: from }, { transform: "translate(0,0)" }], {
            duration: 770, delay: 74 + index * 95, easing: ease, fill: "backwards"
          });
        });
      } else {
        target.animate([{ opacity: .38, transform: "translateY(17px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, easing: ease });
      }
      copy.forEach((element, index) => {
        const side = element.matches(".support-links a");
        const transform = side ? "translateX(-12px)" : "translateY(11px)";
        element.animate([{ opacity: .12, transform }, { opacity: 1, transform: "none" }], {
          duration: 520, delay: Math.min(index * 47, 235) + (heading.length && index > 0 ? 105 : 0), easing: ease, fill: "backwards"
        });
      });
    }
  }, { threshold: .12 });
  document.querySelectorAll(".reveal, .footer-top, .footer-bottom").forEach(element => reveals.observe(element));
}
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
