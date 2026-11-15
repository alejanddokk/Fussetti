import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs';
import {bestPose} from './hogar-mas-vendidos.mjs';
import {sectorHref} from './sector-model.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Editorial selection from the catalogue snapshot; this is not a sales ranking.
export const tvGroups=[
 {key:'tvfocus',title:'Una pantalla para cada plan.',label:'TELEVISORES',ids:['3294','3296','3286','3321'],href:sectorHref('tv-audio','televisores')},
 {key:'soundfocus',title:'Dale play a tu momento.',label:'PARLANTES Y AURICULARES',ids:['2131','2158','1720','1722'],href:sectorHref('tv-audio','sonido')}
];
export const tvShowcaseUi=Object.fromEntries(tvGroups.map(g=>[g.key,{id:''}]));
const frames={
 '3294':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/3294.jpg',box:[54,177,692,424]},
 '3296':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/3296.jpg',box:[65,190,670,435]},
 '3286':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/3286.jpg',box:[115,225,575,370]},
 '3321':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/3321.jpg',box:[55,210,675,435]},
 '2131':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/2131.jpg',box:[50,270,700,270]},
 '2158':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/2158.jpg',box:[215,65,365,700]},
 '1720':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/1720.jpg',box:[235,165,345,515]},
 '1722':{photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/tv-showcase/1722.jpg',box:[65,120,670,565]}
};
export function tvShowcaseRecords(s,rows,ids){
 return ids.flatMap(id=>{
  const row=rows.find(x=>x.id_oficial===id);if(!row)return [];
  const stored=product(s,'official-'+id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id}};
  return [{id,row,p,price:unitPrice(s,p),...frames[id]}];
 });
}
const price=r=>r.p.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price);
const installments=r=>r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.';
const image=r=>`<svg viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="${e(r.photo)}" x="0" y="0" width="800" height="800"/></svg>`;
function hero(s,rows){
 const r=tvShowcaseRecords(s,rows,['3294'])[0];
 return `<section class="tv-hero"><div class="container tv-hero-grid"><div class="tv-hero-copy"><p class="tv-eyebrow">TV Y AUDIO · FUSSETTI</p><h1>Tus planes.<br><em>En otra dimensión.</em></h1><p>La próxima serie, el próximo partido, tu música. Encontrá cómo disfrutar cada momento.</p><div class="tv-hero-links"><a href="${e(sectorHref('tv-audio','televisores'))}">Explorar televisores ${icon('arrow',16)}</a><a href="${e(sectorHref('tv-audio','sonido'))}">Explorar sonido ${icon('arrow',16)}</a></div></div><div class="tv-hero-visual" aria-hidden="true"><span class="tv-orbit tv-orbit-one"></span><span class="tv-orbit tv-orbit-two"></span><svg viewBox="54 177 692 424" preserveAspectRatio="xMidYMid meet"><image href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/3294.jpg" x="0" y="0" width="800" height="800"/></svg><span class="tv-visual-label">UNA NUEVA FORMA DE VER</span></div></div>${r?`<div class="container tv-hero-product"><div><span>EN PRIMER PLANO</span><strong>${e(r.row.nombre)}</strong><a href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',14)}</a></div><div class="tv-hero-price"><small>PRECIO PUBLICADO</small><strong>${e(price(r))}</strong><span>${e(installments(r))}</span></div><div class="tv-hero-actions">${buyButton(s,r.p,true)}<button type="button" data-quick="${e(r.p.id)}">Vista rápida ${icon('arrow',14)}</button></div></div>`:''}<p class="container tv-hero-note">Precio y cuotas del catálogo oficial relevado al 4/11/2026 · Stock, compra y entrega demo.</p></section>`;
}
function groupView(s,rows,g){
 const records=tvShowcaseRecords(s,rows,g.ids),k=g.key,index=Math.max(0,records.findIndex(r=>r.id===tvShowcaseUi[k].id));
 if(!records.length)return `<section class="tv-focus-empty container"><h2>${e(g.title)}</h2><p>No hay productos disponibles en este escenario demo.</p><a href="${e(g.href)}">Ver catálogo ${icon('arrow',14)}</a></section>`;
 return `<section class="tv-focus" data-${k}-showroom aria-labelledby="${k}-title"><div class="container tv-focus-heading"><div><p class="tv-eyebrow">SELECCIÓN FUSSETTI / ${e(g.label)}</p><h2 id="${k}-title">${e(g.title)}</h2></div><a href="${e(g.href)}">Ver categoría ${icon('arrow',16)}</a></div><div class="tv-focus-stage" data-${k}-stage role="group" aria-roledescription="${records.length>1?'carrusel':'producto destacado'}" aria-label="${e(g.label)}. Usá las flechas, Inicio o Fin para elegir." tabindex="0">${records.map((r,i)=>`<button type="button" class="tv-focus-item" data-${k}-item="${i}" data-${k}-id="${r.id}" aria-label="Ver ${e(r.row.nombre)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}>${image(r)}</button>`).join('')}${records.length>1?`<div class="gf-arrows tv-focus-arrows"><button type="button" data-${k}-prev aria-label="Producto anterior">${icon('arrow',20)}</button><button type="button" data-${k}-next aria-label="Producto siguiente">${icon('arrow',20)}</button></div>`:''}</div><div class="container gf-details tv-focus-details">${records.map((r,i)=>`<article class="tv-focus-summary" data-${k}-panel="${i}" ${i===index?'':'hidden inert'}><div><p class="tv-eyebrow">${e(r.row.marca||'FUSSETTI')} / ${e(g.label)}</p><h3>${e(r.row.nombre)}</h3><span>Ref. ${e(r.row.referencia||r.id)}</span></div><div class="gf-price tv-focus-price"><small>PRECIO PUBLICADO</small><strong>${e(price(r))}</strong><p>${e(installments(r))}</p><span>Stock y entrega demo</span></div><div class="tv-focus-actions"><a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a>${buyButton(s,r.p,true)}<button type="button" data-quick="${e(r.p.id)}">Vista rápida ${icon('arrow',14)}</button></div></article>`).join('')}</div>${records.length>1?`<div class="container tv-focus-selector" aria-label="Elegir ${e(g.label)}">${records.map((r,i)=>`<button type="button" data-${k}-select="${i}" aria-label="Seleccionar ${e(r.row.nombre)}" aria-pressed="${i===index}"><span>${String(i+1).padStart(2,'0')}</span><span>${e(r.row.nombre)}</span></button>`).join('')}</div>`:''}<p class="container tv-focus-note">Fotos, precios y cuotas del catálogo oficial relevado al 4/11/2026 · Stock, compra y entrega demo.</p><p class="sr-only" data-${k}-status role="status"></p></section>`;
}
export function tvShowcase(s,rows){return hero(s,rows)+tvGroups.map(g=>groupView(s,rows,g)).join('')}
export function bindTvShowcase(host){const clean=tvGroups.map(g=>bindHomeShowroom(host,{prefix:g.key,ui:tvShowcaseUi[g.key],pose:bestPose,heading:'h3',scrollSelector:true,pauseSummaryHover:true}));return ()=>clean.forEach(fn=>fn())}
