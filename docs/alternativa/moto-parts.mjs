import {e,icon} from '../nueva/ui.mjs';
import {money,unitPrice,types} from './domain.mjs';
import {availableHere,hasOffer} from './product-views.mjs';
import {action,productLabel} from './horizonx-ui.mjs';
import {partsForModel,partsModelOptions} from './moto-journey-model.mjs';

export const showroomParts=s=>s.products.filter(p=>p.kind==='repuesto'||p.category==='Repuestos');
function partCard(s,p){
 const label=productLabel(p),href='#producto/'+encodeURIComponent(p.id),offer=hasOffer(s,p);
 return `<article class="moto-part-card" data-part-id="${e(p.id)}"><a class="moto-part-image" href="${href}"><img src="${e(p.image)}" alt="${e(p.name)}" loading="lazy">${offer?`<span>−${p.discount}% DEMO</span>`:''}</a><div class="moto-part-body"><small>${e(types[p.type]?.name||'Repuestos')}</small><h3><a href="${href}">${e(label.name)}</a></h3><span class="moto-part-model">${e(label.model)}</span><div class="moto-part-price"><span>${p.source==='fussetti-mercadolibre'?'Precio Mercado Libre · 5/11/2026':offer?`<del>${money(p.price)}</del>`:'Precio de referencia demo'}</span><strong>${money(unitPrice(s,p))}</strong><small>${p.source==='fussetti-mercadolibre'?'Precio publicado · compra demo':offer?'Ahorrás '+money(p.price-unitPrice(s,p))+' en demo':'Precio demo'}</small></div><span class="moto-part-stock ${!p.stock?'out':''}">${icon(!p.stock?'clock':availableHere(s,p)?'check':'pin',14)} ${!p.stock?'Sin stock demo':availableHere(s,p)?'Disponible en demo':'Consultá otra sucursal demo'}</span><p class="moto-part-compatibility">${p.compatibilityStatus==='demo-confirmada'?'Compatibilidad confirmada solo en demo':'Compatibilidad por confirmar'}</p>${action('Vista rápida',`type="button" data-quick="${e(p.id)}" aria-label="Vista rápida de ${e(p.name)}"`,'moto-part-quick')}<a class="moto-part-detail" href="${href}">Ver ficha ${icon('arrow',16)}</a></div></article>`;
}
export function partsCarouselView(s,options={}){
 const allParts=partsForModel(s,options.modelId).sort((a,b)=>Number(b.source==='fussetti-mercadolibre')-Number(a.source==='fussetti-mercadolibre')),parts=allParts.slice(0,24),model=partsModelOptions(s).find(m=>m.id===options.modelId);
 const consult=new URLSearchParams({motos:'1'});if(model)consult.set(model.reference?'modelo':'producto',model.reference?model.name:model.id);
 return `<section id="motos-repuestos" class="container moto-parts" role="region" aria-roledescription="carrusel" aria-labelledby="moto-parts-title"><div class="moto-parts-heading"><div><p class="eyebrow">${e(options.intro||'REPUESTOS Y MANTENIMIENTO')}</p><h2 id="moto-parts-title">${e(options.title||'Todo para seguir andando.')}</h2><p>${allParts.length} ${allParts.length===1?'repuesto':'repuestos'} ${model?'con referencias para '+e(model.name):'del catálogo'} · confirmá modelo, año y versión antes de elegir.</p></div>${parts.length?`<div class="moto-parts-arrows"><button type="button" class="moto-rotation" data-parts-rotation>Pausar</button><button type="button" data-parts-prev aria-controls="moto-parts-track" aria-label="Repuestos anteriores">${icon('arrow',21)}</button><button type="button" data-parts-next aria-controls="moto-parts-track" aria-label="Repuestos siguientes">${icon('arrow',21)}</button></div>`:''}</div>${options.filters||''}${parts.length?`<div id="moto-parts-track" class="moto-parts-track" tabindex="0" aria-label="Repuestos. Deslizá o usá las flechas izquierda y derecha.">${parts.map((p,i)=>`<div class="moto-part-slide" role="group" aria-roledescription="diapositiva" aria-label="${i+1} de ${parts.length}">${partCard(s,p)}</div>`).join('')}</div><div class="moto-parts-bottom"><span data-parts-range role="status" aria-live="polite"></span><a href="#catalogo?cat=Repuestos&motos=1">Ver todos en el catálogo ${icon('arrow',16)}</a></div>`:`<div class="moto-parts-empty"><h3>${model?'Compatibilidad pendiente de registrar.':'Todavía no hay repuestos cargados en este escenario.'}</h3><p>${model?'No encontramos referencias cargadas para '+e(model.name)+'. Podés ver todos los repuestos o preparar una consulta para confirmar la pieza correcta.':'Prepará una consulta para continuar.'}</p><a href="#consulta?${consult}">Consultar por este modelo →</a>${model?'<a href="#catalogo?cat=Repuestos&motos=1">Ver todos los repuestos →</a>':''}</div>`}</section>`;
}

let savedScroll=0;
export function bindPartsCarousel(root){
 const track=root.querySelector('#moto-parts-track');if(!track)return ()=>{};
 const section=track.closest('.moto-parts'),prev=section.querySelector('[data-parts-prev]'),next=section.querySelector('[data-parts-next]'),status=section.querySelector('[data-parts-range]'),cards=[...track.children],reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const rotation=section.querySelector('[data-parts-rotation]');
 let frame=0, timer=0, glide=0, visible=false, hovered=false, paused=false, disposed=false, direction=1;
 const cleanups=[],listen=(node,event,fn,options)=>{node.addEventListener(event,fn,options);cleanups.push(()=>node.removeEventListener(event,fn,options))};
 const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap||0);
 function update(){frame=0;const end=Math.max(0,track.scrollWidth-track.clientWidth),left=track.scrollLeft,delta=step(),first=Math.min(cards.length,Math.floor((left+1)/delta)+1),last=Math.min(cards.length,Math.ceil((left+track.clientWidth-1)/delta));prev.disabled=left<=1;next.disabled=left>=end-1;const visible=track.scrollWidth?track.clientWidth/track.scrollWidth:1;section.style.setProperty('--parts-thumb',(visible*100)+'%');section.style.setProperty('--parts-offset',((track.scrollWidth?left/track.scrollWidth:0)*100)+'%');const text=`Mostrando ${first}–${last} de ${cards.length}`;if(status.textContent!==text)status.textContent=text;savedScroll=left}
 function move(direction,one=false){const delta=step(),visible=one?1:Math.max(1,Math.floor((track.clientWidth+parseFloat(getComputedStyle(track).columnGap||0))/delta)),index=Math.floor((track.scrollLeft+1)/delta);track.scrollTo({left:(index+direction*visible)*delta,behavior:reduced.matches?'instant':'smooth'})}
 function stopGlide(){
  cancelAnimationFrame(glide);glide=0;track.style.scrollSnapType='';status.setAttribute('aria-live','polite');
 }
 function schedule(){
  clearTimeout(timer);
  if(disposed)return;
  const room=track.scrollWidth-track.clientWidth>1;
  rotation.hidden=reduced.matches||!room;
  rotation.textContent=paused?'Reanudar':'Pausar';
  const focused=section.contains(document.activeElement)&&document.activeElement!==rotation;
  if(!room||paused||reduced.matches||!visible||hovered||focused||document.hidden||document.querySelector('dialog[open]'))return;
  timer=setTimeout(advance,7800);
 }
 function advance(){
  const from=track.scrollLeft, end=track.scrollWidth-track.clientWidth;
  if(from<1)direction=1;
  if(from>=end-1)direction=-1;
  const to=Math.max(0,Math.min(end,from+direction*step()));
  const started=performance.now();
  track.style.scrollSnapType='none';status.setAttribute('aria-live','off');
  function slide(now){
   const t=Math.min(1,(now-started)/2400);
   track.scrollLeft=from+(to-from)*t*t*(3-2*t);
   if(t<1)glide=requestAnimationFrame(slide);
   else{stopGlide();schedule()}
  }
  glide=requestAnimationFrame(slide);
 }
 listen(rotation,'click',()=>{paused=!paused;if(paused)stopGlide();schedule()});
 listen(track,'pointerenter',ev=>{if(ev.pointerType==='mouse'){hovered=true;stopGlide();schedule()}});
 listen(track,'pointerleave',()=>{hovered=false;schedule()});
 listen(track,'pointerdown',()=>{stopGlide();schedule()});
 listen(track,'wheel',()=>{stopGlide();schedule()});
 listen(section,'focusin',()=>{stopGlide();schedule()});
 listen(section,'focusout',()=>queueMicrotask(schedule));
 listen(document,'close',schedule,true);
 listen(reduced,'change',()=>{stopGlide();schedule()});
 listen(document,'visibilitychange',()=>{if(document.hidden)stopGlide();schedule()});
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)stopGlide();schedule()},{threshold:.25});
 intersection.observe(track);
 listen(prev,'click',()=>{stopGlide();move(-1);schedule()});listen(next,'click',()=>{stopGlide();move(1);schedule()});
 listen(track,'keydown',ev=>{if(ev.target!==track)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)){ev.preventDefault();if(ev.key==='Home'||ev.key==='End')track.scrollTo({left:ev.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'});else move(ev.key==='ArrowRight'?1:-1,true)}});
 listen(track,'scroll',()=>{if(!frame)frame=requestAnimationFrame(update)});const observer=new ResizeObserver(()=>{update();schedule()});observer.observe(track);track.scrollLeft=savedScroll;update();schedule();
 return ()=>{disposed=true;savedScroll=track.scrollLeft;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();clearTimeout(timer);stopGlide();cleanups.forEach(f=>f())};
}
