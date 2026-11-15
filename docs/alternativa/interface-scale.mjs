// Desktop reading scale applies to the complete retail page, including dialogs.
// Moto routes keep their existing presentation and geometry.
export function applyInterfaceScale(moto){document.documentElement.toggleAttribute('data-retail-scale',!moto)}
export function pageZoom(){return Number.parseFloat(getComputedStyle(document.body).zoom)||1}
