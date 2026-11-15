import {e,icon} from '../nueva/ui.mjs';
import {product} from './domain.mjs';

// Adapted from the HorizonX Interactive Hover Button HTML export; source in references/horizonx.
export function action(label,attrs='',cls=''){
 return `<button class="button hx-action ${cls}" ${attrs}><span class="ihb-fill" aria-hidden="true"></span><span class="ihb-rest">${e(label)}</span><span class="ihb-swap" aria-hidden="true">${e(label)} ${icon('arrow',17)}</span></button>`;
}

// Signal Tooltip: HorizonX / uiverse.io/jarsaniya_1588/big-goose-52 (MIT upstream).
export function signal(label,text,id,tone='default'){
 return `<span class="hx-signal" data-tone="${tone}"><button type="button" class="stt-trigger" aria-expanded="false" aria-controls="${id}" aria-describedby="${id}"><span class="stt-label">${e(label)}</span><span aria-hidden="true">ⓘ</span></button><span class="stt-tooltip" role="tooltip" id="${id}">${e(text)}</span></span>`;
}

export function productLabel(p){
 if(['fussetti-official','fussetti-mercadolibre'].includes(p.source))return {name:p.name,model:''};
 const split=p.name.lastIndexOf(' - ');
 return split<0?{name:p.name,model:''}:{name:p.name.slice(0,split),model:p.name.slice(split+3)};
}

export function comparisonRail(s,page){
 if(!s.compare.length||!['inicio','catalogo','producto','favoritos','resultados'].includes(page))return '';
 return `<aside class="comparison-rail" aria-label="Tu selección para comparar"><div class="container comparison-rail-inner"><div class="rail-heading">${icon('grid',19)}<span><b>Tu comparación</b><small>${s.compare.length} de 3 productos</small></span></div><div class="rail-products">${s.compare.map(id=>{const p=product(s,id);return p?`<div class="rail-product"><img src="${e(p.image)}" alt=""><span title="${e(p.name)}">${e(productLabel(p).name)}</span><button data-compare="${e(id)}" aria-label="Quitar ${e(p.name)} de comparación">×</button></div>`:''}).join('')}</div><a class="button small" href="#comparar">Ver diferencias ${icon('arrow',16)}</a></div></aside>`;
}
