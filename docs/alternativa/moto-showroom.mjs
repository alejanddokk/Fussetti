import {motoJourneyView} from './moto-journey.mjs?v=credit-options1';
import {e,icon} from '../nueva/ui.mjs';
import {money,unitPrice,product} from './domain.mjs';
import {availableHere} from './product-views.mjs';
import {catalogueFacts} from './knowledge.mjs';

const HONDA='https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/honda-logo.svg';
const FUSSETTI='https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/1e1516fa4fa9500a.png';
const photos={'honda-cb300':'cb300.jpg','honda-xr-300':'xr-300.jpg','honda-wave-110-s':'wave-110.jpg','honda-navi':'navi.jpg','honda-cb-125f':'cb-125f.jpg','honda-xr190':'xr-190.webp','honda-xr150l':'xr-150l.png'};
const stories={'honda-xr-300':'Hay caminos que te dan ganas de salir.','honda-wave-110-s':'Tu próxima rutina puede tener dos ruedas.','honda-navi':'Un toque distinto para todos tus días.','honda-cb-125f':'Dale otro ritmo a tus planes.'};
const link=(text,url,cls='')=>`<a class="${cls}" href="${e(url)}">${text}</a>`;
const pUrl=p=>'#producto/'+encodeURIComponent(p.id);
const name=p=>p.name.replace(/^HONDA\s+/i,'');
const photo=p=>photos[p.id]?'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/'+photos[p.id]:p.image;
export {photo as motoPhoto,name as motoName};
export const motoInventory=s=>s.products.filter(p=>p.type==='motorcycle');
export function showroomModels(s){
 const order=['honda-xr-300','honda-wave-110-s','honda-navi','honda-cb-125f'];
 return [...motoInventory(s)].sort((a,b)=>Number(b.stock>0)-Number(a.stock>0)||(order.includes(a.id)?order.indexOf(a.id):99)-(order.includes(b.id)?order.indexOf(b.id):99));
}
export function isMotoExperience(s,r){
 const [page,id]=r.path;
 if(page==='motos'||page==='motos-focus')return true;
 if(page==='catalogo'&&(r.q.get('cat')==='Motos'||r.q.get('tipo')==='motorcycle'))return true;
 if(['producto','reserva'].includes(page)&&product(s,id)?.type==='motorcycle')return true;
 if(page==='guia')return r.q.get('tipo')==='motorcycle'||r.q.get('cat')==='Motos'||(!r.q.has('tipo')&&!r.q.has('cat')&&!s.guide.selection&&s.guide.type==='motorcycle');
 if(page==='resultados'&&s.guide.type==='motorcycle')return true;
 if(page==='comparar'&&s.compare.length&&s.compare.every(id=>product(s,id)?.type==='motorcycle'))return true;
 return r.q.get('motos')==='1'&&['catalogo','sucursales','sucursal','taller','services','financiacion','consulta','consultas','carrito','cuenta','favoritos','pedido'].includes(page);
}
export function motoHeader(){return '<span class="moto-demo-badge">Modo demostración</span>'}
function modelActions(s,p){
 return `<div class="moto-slide-actions">${link('Conocer el modelo '+icon('arrow',18),pUrl(p),'button')}${!p.stock?'<button class="button outline" disabled>Sin stock demo</button>':availableHere(s,p)?link('Reservar en demo','#reserva/'+encodeURIComponent(p.id),'button outline'):link('Elegir sucursal',pUrl(p),'button outline')}</div>`;
}
export function motoDetails(s,p){
 const fact=catalogueFacts(p).find(a=>a.label==='Estilo');
 return `<span class="moto-slide-kicker">HONDA ${fact?' / '+e(fact.value):''}</span><h2>${e(name(p))}</h2><p>${e(stories[p.id]||'Elegí el modelo que acompañe tus próximos planes.')}</p>
 <div class="moto-price" data-available="${Boolean(p.stock&&availableHere(s,p))}"><small>PRECIO DE REFERENCIA DEMO</small><strong>${money(unitPrice(s,p))}</strong><span>${!p.stock?'Sin stock en el escenario demo':availableHere(s,p)?'Disponible en demo · reserva sin cobro':'Consultá otra sucursal demo'}</span></div>
 ${modelActions(s,p)}<a class="moto-finance-link" href="#reserva/${encodeURIComponent(p.id)}?kind=finance">${icon('settings',16)} Simulá una financiación ${icon('arrow',15)}</a>`;
}
function modelSlide(s,p,i,total){
 return `<article class="moto-slide" data-moto-slide="${e(p.id)}" data-active="${i===0}" role="group" aria-roledescription="diapositiva" aria-label="${i+1} de ${total}: ${e(p.name)}" ${i?'hidden inert aria-hidden="true"':''}>
 <div class="container moto-slide-inner"><div class="moto-slide-copy">${motoDetails(s,p)}</div>
 <a class="moto-slide-visual" href="#producto/${encodeURIComponent(p.id)}" draggable="false" aria-label="Ver ficha de ${e(p.name)}"><span class="moto-model-watermark" aria-hidden="true">${e(name(p))}</span><img src="${e(photo(p))}" alt="${e(p.name)}" class="${photos[p.id]?'moto-photo-hd':'moto-photo-original'}" draggable="false" ${i?'loading="lazy"':'fetchpriority="high"'}><span class="moto-photo-note">Imagen del modelo publicado · confirmá versión y disponibilidad</span></a></div></article>`;
}
export function showroomView(s){
 const models=showroomModels(s);
 const carousel=models.length?`<section class="moto-carousel" role="region" aria-roledescription="carrusel" aria-label="Modelos Honda de Fussetti">
 <div class="container moto-carousel-branding"><a href="../" aria-label="Volver a Fussetti"><img src="${FUSSETTI}" alt="Fussetti"></a><span class="moto-carousel-honda"><img src="${HONDA}" alt="Honda"></span></div>
 <div class="moto-carousel-window" tabindex="0" aria-label="Modelos. Usá las flechas izquierda y derecha para cambiar; Escape detiene el avance automático."><div class="moto-carousel-slides">${models.map((p,i)=>modelSlide(s,p,i,models.length)).join('')}</div></div>
 <div class="container moto-carousel-controls"><span class="moto-carousel-count" aria-live="polite" aria-atomic="true"><b data-moto-counter>01</b><span>/ ${String(models.length).padStart(2,'0')}</span><span data-moto-name>${e(name(models[0]))}</span></span>
 <span class="moto-carousel-track" aria-hidden="true"><i data-moto-position style="width:${100/models.length}%"></i></span>
 <div><button type="button" class="moto-rotation" data-moto-rotation>Pausar</button><button type="button" data-moto-prev aria-label="Modelo anterior">${icon('arrow',21)}</button><button type="button" data-moto-next aria-label="Modelo siguiente">${icon('arrow',21)}</button></div></div>
 <div class="moto-model-selector container" aria-label="Seleccionar modelo">${models.map((p,i)=>`<button type="button" data-moto-index="${i}" ${i===0?'aria-current="true"':''} aria-label="Ver ${e(p.name)}"><small aria-hidden="true">${String(i+1).padStart(2,'0')}</small><img src="${e(photo(p))}" alt="" loading="lazy"><span>${e(name(p))}</span></button>`).join('')}</div></section>`:
 '<section class="container page empty"><h2>El próximo camino está por llegar.</h2><p>En este escenario todavía no hay modelos de moto cargados.</p><a class="button" href="#consulta?motos=1">Preparar consulta demo</a></section>';
 return `<div class="moto-showroom"><h1 class="moto-sr">Modelos Honda en Fussetti</h1>${carousel}${motoJourneyView(s)}</div>`;
}
export function motoFooter(s){
 return `<footer class="moto-footer"><div class="container moto-footer-inner"><div class="moto-footer-brand"><img src="${FUSSETTI}" alt="Fussetti"><span>Motos y repuestos. Estamos para lo que sigue.</span></div><nav aria-label="Atención de Motos">${link('Sucursales','#sucursales?motos=1')}${link('Taller oficial','#taller?motos=1')}${link('Services Oficiales','#services?motos=1')}${link('Volver a Fussetti','../')}</nav><img class="moto-footer-honda" src="${HONDA}" alt="Honda"></div><div class="container moto-footer-note">Fussetti Lab · Prototipo privado. Precios, disponibilidad, reservas, financiación y atención simulados. Sin cobros ni mensajes externos. <a href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/nueva/">Comparar con /nueva/ ↗</a></div></footer><nav class="mobile-nav moto-mobile-nav" aria-label="Navegación móvil de Motos">${[['home','Tienda','#inicio'],['bike','Motos','#motos'],['settings','Elegir','#guia?tipo=motorcycle'],['cart','Carrito','#carrito?motos=1'],['user','Cuenta','#cuenta?motos=1']].map(([i,t,u])=>link(icon(i,21)+'<span>'+t+'</span>',u)).join('')}</nav>`;
}
