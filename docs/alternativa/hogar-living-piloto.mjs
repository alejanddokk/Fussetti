import {product,unitPrice,money} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {springCurve,morphFrames} from './hogar-combo-motion.mjs';
import {e,icon} from '../nueva/ui.mjs';

// The room is illustrative; the two visible products are unmodified catalogue photos.
export const livingPieces=[
 {id:'3627',short:'Sillón Piero',type:'SILLÓN',frame:'35 205 690 420',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/3627.jpg',place:'sofa',hint:'Revisá las medidas de tu espacio y del sillón.'},
 {id:'3444',short:'Rack Domus',type:'RACK',frame:'150 350 500 155',photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/3444.jpg',place:'rack',hint:'Revisá el ancho disponible y las medidas del rack.'}
];
export function livingRecords(s,rows){
 return livingPieces.flatMap(piece=>{
  const row=rows.find(r=>r.id_oficial===piece.id);if(!row)return [];
  const stored=product(s,'official-'+piece.id),p=stored||{id:'official-'+piece.id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock:initialOfficialStock(row),branchIds:s.branches.map(b=>b.id),official:{id:piece.id}};
  return [{...piece,row,p,price:unitPrice(s,p)}];
 });
}
const price=r=>r.p.price===r.row.precio_centavos?r.row.precio_texto:money(r.price);
const installments=r=>r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las cuotas en la ficha.':'Consultá las cuotas en la ficha.';
const img=r=>`<svg viewBox="${r.frame}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="${e(r.photo)}" width="800" height="800"/></svg>`;
export function livingPilot(s,rows){
 const items=livingRecords(s,rows);
 return `<section class="living-pilot" data-living-pilot aria-labelledby="living-heading"><div class="container living-grid"><div class="living-intro"><p class="living-eyebrow">HOGAR FUSSETTI · IDEAS PARA VIVIRLO</p><h1 id="living-heading">Un living para <em>compartir.</em></h1><p>Encontrá las piezas que le dan lugar a tus mejores momentos.</p><div class="living-intro-actions"><button type="button" class="button" data-home-go="home-spaces">Explorar ambientes ${icon('arrow',17)}</button><a href="#catalogo?cat=Hogar&amp;lista=1" class="living-catalog-link">Ver todo Hogar ${icon('arrow',16)}</a></div><div class="living-small-note"><span aria-hidden="true">✳</span> Tocá los puntos y conocé cada producto.</div></div><div class="living-room" aria-label="Living ilustrativo con productos del catálogo"><div class="living-room-image" aria-hidden="true"></div>${items.map(r=>`<div class="living-object living-object-${r.place}" aria-hidden="true">${img(r)}</div>`).join('')}${items.map(r=>`<button type="button" class="living-pin living-pin-${r.place}" data-living-pin="${r.id}" aria-expanded="false" aria-controls="living-card-${r.id}" aria-label="Conocer ${e(r.short)}"><span aria-hidden="true">+</span></button>`).join('')}<span class="living-room-index">01 <span>/</span> LIVING</span><span class="living-room-caption">COMPOSICIÓN ILUSTRATIVA · FOTOS DEL CATÁLOGO</span></div><div class="living-panels" aria-live="polite"><div class="living-panel-invitation" data-living-placeholder><span>EL LIVING, A TU MANERA</span><p>Elegí un punto de la imagen para ver cada pieza.</p></div>${items.map(r=>`<article class="living-card" id="living-card-${r.id}" data-living-card="${r.id}" hidden inert><button type="button" class="living-card-close" data-living-close aria-label="Cerrar detalle de ${e(r.short)}">×</button><div class="living-card-photo">${img(r)}</div><div class="living-card-content"><span class="living-card-type">${e(r.type)} · FUSSETTI</span><h2>${e(r.short)}</h2><p class="living-card-name">${e(r.row.nombre)}</p><small>PRECIO PUBLICADO · 4/11/2026</small><strong>${e(price(r))}</strong><p class="living-card-payments">${e(installments(r))}</p><p class="living-card-hint">${e(r.hint)}</p><div class="living-card-actions"><a class="button outline" href="#producto-oficial/${e(r.id)}">Ver producto ${icon('arrow',15)}</a>${buyButton(s,r.p,true)}</div><button type="button" class="living-card-quick" data-quick="${e(r.p.id)}">Vista rápida ${icon('arrow',14)}</button></div></article>`).join('')}</div><div class="living-bottom"><span>Productos vendidos por separado · Stock, pago y entrega demo</span><button type="button" data-combo-open="living">Ver las dos piezas ${icon('arrow',16)}</button></div></div></section><div class="container home-welcome-trust"><a href="#guia?cat=Hogar">${icon('settings',19)}<span><b>Te ayudamos a elegir</b><small>Guía y datos para decidir</small></span>${icon('arrow',15)}</a><a href="#sucursales">${icon('pin',19)}<span><b>Estamos cerca</b><small>Encontrá tu sucursal</small></span>${icon('arrow',15)}</a><a href="#consulta">${icon('heart',19)}<span><b>Contá con nosotros</b><small>Prepará una consulta demo</small></span>${icon('arrow',15)}</a></div>`;
}

// HorizonX Morph Dialog: a sampled spring expands the selected point into the
// product card. Native buttons and disclosure semantics keep the flow usable
// with keyboard and reduced motion; commerce actions use the existing checkout.
export function bindLivingPilot(host){
 const root=host.querySelector('[data-living-pilot]');if(!root)return ()=>{};
 const abort=new AbortController(),signal=abort.signal,pins=[...root.querySelectorAll('[data-living-pin]')],cards=[...root.querySelectorAll('[data-living-card]')],placeholder=root.querySelector('[data-living-placeholder]'),animations=new Set(),reduce=matchMedia('(prefers-reduced-motion: reduce)');let active='';
 function select(id,focusPin=false){
  const selected=cards.find(card=>card.dataset.livingCard===id),trigger=pins.find(pin=>pin.dataset.livingPin===id);if(id&&!selected)return;
  animations.forEach(a=>a.cancel());animations.clear();active=id;
  pins.forEach(pin=>pin.setAttribute('aria-expanded',String(pin.dataset.livingPin===id)));
  cards.forEach(card=>{const show=card===selected;card.hidden=!show;card.inert=!show});placeholder.hidden=!!selected;
  if(selected&&trigger&&!reduce.matches){const media=selected.querySelector('.living-card-photo'),start=trigger.getBoundingClientRect(),sheet=selected.getBoundingClientRect(),photo=media.getBoundingClientRect();if(sheet.width&&sheet.height&&photo.width&&photo.height){const curve=springCurve(.1,200),frames=morphFrames(start,sheet,photo,curve.samples,{cardRadius:24,radius:12});for(const [node,keys] of [[selected,frames.sheet],[media,frames.media]]){const a=node.animate(keys,{duration:curve.duration,easing:'linear'});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a))}}}
  if(focusPin)trigger?.focus({preventScroll:true});
 }
 pins.forEach(pin=>pin.addEventListener('click',()=>{const next=active===pin.dataset.livingPin?'':pin.dataset.livingPin;select(next);if(next){const card=cards.find(item=>item.dataset.livingCard===next),rect=card.getBoundingClientRect();if(rect.bottom>window.innerHeight-70||rect.top<55)card.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'nearest'})}},{signal}));
 root.querySelectorAll('[data-living-close]').forEach(button=>button.addEventListener('click',()=>{const previous=active;select('');pins.find(pin=>pin.dataset.livingPin===previous)?.focus()},{signal}));
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();event.stopPropagation();const previous=active;select('');pins.find(pin=>pin.dataset.livingPin===previous)?.focus()}},{signal});
 return ()=>{abort.abort();animations.forEach(a=>a.cancel());animations.clear()};
}
