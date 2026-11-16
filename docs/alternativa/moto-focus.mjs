import {bindRailPlayback} from "../rail-motion.mjs?v=vitrina1";
import {selectedMotoModel,rememberMotoModel} from './moto-presentation.mjs';
import {followMotoThumbnail} from './moto-thumbnails.mjs';
import {motoJourneyView} from './moto-journey.mjs?v=credit-options1';
/* Motion Focus adapted from HorizonX. Original complete export retained in
   references/horizonx/motion-focus.html. Translation, role scaling and its
   Newton-refined bezier are adapted to native DOM rather than a GSAP loop. */
import {showroomModels,motoPhoto,motoName,motoDetails} from './moto-showroom.mjs?v=deslizamiento1';
import {e,icon} from '../nueva/ui.mjs';

export const FOCUS_SIDE_SCALE=1/1.44001;
const wrap=(n,m)=>m?((n%m)+m)%m:0;
// Local crops of the original Fussetti dealer photos.
export const focusFrames=Object.fromEntries([
 ['honda-xr-300','honda-xr300.webp'],
 ['honda-wave-110-s','honda-wave.webp'],
 ['honda-navi','honda-navi.webp'],
 ['honda-cb-125f','honda-cb125f.webp'],
 ['honda-cb300','honda-cb300.webp'],
 ['honda-xr190','honda-xr190.webp'],
 ['honda-xr150l','honda-xr150l.webp']
].map(([id,file])=>[id,new URL('../assets/'+file,import.meta.url).href]));
const fussettiLogo=new URL('../assets/wordmark.png',import.meta.url).href;
const hondaLogo=new URL('../assets/honda-brand.svg',import.meta.url).href;
function bikeImage(p){
 return `<img class="mf-bike-image" src="${e(focusFrames[p.id]||motoPhoto(p))}" alt="" decoding="async" draggable="false">`;
}
export function focusView(s){
 const models=showroomModels(s);
 if(!models.length)return '<section class="container page empty"><h1>Todavía no hay motos en este escenario.</h1><a class="button" href="#consulta?motos=1">Preparar consulta demo</a></section>';
 return `<div class="moto-showroom moto-focus-showroom"><section class="mf-motos" data-moto-focus aria-roledescription="carrusel" aria-label="Modelos Honda en fila">
 <div class="container mf-moto-branding"><a href="../" aria-label="Volver a Fussetti"><img src="${fussettiLogo}" alt="Fussetti"></a><span class="mf-honda"><img src="${hondaLogo}" alt="Honda"></span></div>
 <div class="container mf-moto-intro"><h1>Elegí tu próxima Honda.</h1><button type="button" class="moto-rotation" data-moto-rotation>Pausar</button></div>
 <div class="mf-moto-stage" tabindex="0" aria-label="Arrastrá o usá las flechas para recorrer las motos. Cada foto abre su ficha.">
 ${models.map((p,i)=>`<a class="mf-moto-bike" href="#producto/${encodeURIComponent(p.id)}" draggable="false" data-focus-bike="${i}" data-model="${e(p.id)}" aria-label="Ver ficha de ${e(p.name)}" ${i>1&&i!==models.length-1?'tabindex="-1"':''} style="${i===0?'':'visibility:hidden;'}"><span class="mf-bike-shadow" aria-hidden="true"></span>${bikeImage(p)}<span class="mf-bike-caption" aria-hidden="true">${e(motoName(p))} ${icon('arrow',12)}</span></a>`).join('')}
 <span class="mf-moto-count" aria-live="polite" aria-atomic="true"><b data-focus-count>01</b><span>/ ${String(models.length).padStart(2,'0')}</span><span data-focus-label>${e(motoName(models[0]))}</span></span><div class="mf-moto-arrows"><button type="button" data-focus-prev aria-label="Moto anterior">${icon('arrow',20)}</button><button type="button" data-focus-next aria-label="Moto siguiente">${icon('arrow',20)}</button></div></div>
 <div class="container mf-moto-details">${models.map((p,i)=>`<article class="mf-moto-summary" data-focus-summary="${i}" data-model="${e(p.id)}" ${i?'hidden inert aria-hidden="true"':''}>${motoDetails(s,p)}</article>`).join('')}</div>
 <div class="container mf-moto-selector" aria-label="Elegir modelo de moto">${models.map((p,i)=>`<button type="button" data-focus-select="${i}" aria-label="Seleccionar ${e(p.name)}" ${i===0?'aria-current="true"':''}><small aria-hidden="true">${String(i+1).padStart(2,'0')}</small><img src="${e(focusFrames[p.id]||motoPhoto(p))}" alt="" loading="lazy"><span>${e(motoName(p))}</span></button>`).join('')}</div>
 </section>${motoJourneyView(s)}</div>`;
}

// Original Newton-refined cubic-bezier from Motion Focus, with its authored
// [.33, 0, 0, 1] easing. No external runtime or animation plugin is loaded.
export function focusEase(x){
 if(x<=0)return 0;if(x>=1)return 1;
 const cx=.99,bx=-1.98,ax=1.99;let t=x;
 for(let i=0;i<6;i++){
  const dx=((ax*t+bx)*t+cx)*t-x;if(Math.abs(dx)<1e-6)break;
  const d=(3*ax*t+2*bx)*t+cx;if(Math.abs(d)<1e-6)break;t-=dx/d;
 }
 return (-2*t+3)*t*t;
}
export function focusOffset(index,position,count){
 let d=wrap(index-position,count);if(d>count/2)d-=count;return count<2?0:d;
}
export function focusPose(offset,width){
 const d=Math.abs(offset),progress=Math.min(1,d),pitch=Math.min(480,Math.max(120,width*.31));
 return {x:offset*pitch,y:-8*progress,scale:1-(1-FOCUS_SIDE_SCALE)*progress,opacity:Math.max(0,1-.44*progress)*Math.max(0,Math.min(1,(1.85-d)/.65)),visible:d<1.85,z:Math.round((4-Math.min(3,d))*100)};
}
export function bindMotoFocus(root) {
 const gallery=root.querySelector('[data-moto-focus]');
 if(!gallery)return ()=>{};
 const stage=gallery.querySelector('.mf-moto-stage');
 const rotation=gallery.querySelector('[data-moto-rotation]');
 const announcement=gallery.querySelector('.mf-moto-count');
 const bikes=[...gallery.querySelectorAll('[data-focus-bike]')];
 const panels=[...gallery.querySelectorAll('[data-focus-summary]')];
 const selectors=[...gallery.querySelectorAll('[data-focus-select]')];
 const count=bikes.length;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const bindings=new AbortController();
 const listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:bindings.signal});
 let index=-1;
 let position=Math.max(0,bikes.findIndex(node=>node.dataset.model===selectedMotoModel()));
 let width=stage.clientWidth;
 let bikeWidth=bikes[0].offsetWidth;
 let drag=null;
 let settle=0;
 let ignoredClickUntil=0;
 let detailsAnimation;

 function sync(next, animate) {
  if(next===index)return;
  index=next;
  rememberMotoModel(bikes[index].dataset.model);
  gallery.dataset.activeIndex=String(index);
  panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index))});
  selectors.forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')});
  followMotoThumbnail(selectors[index],reduced.matches);
  gallery.querySelector('[data-focus-count]').textContent=String(index+1).padStart(2,'0');
  gallery.querySelector('[data-focus-label]').textContent=panels[index].querySelector('h2').textContent;
  detailsAnimation?.cancel();
  if(animate&&!reduced.matches){
   detailsAnimation=panels[index].animate(
    [{opacity:.56,translate:'0 8px'},{opacity:1,translate:'0 0'}],
    {duration:390,easing:'ease-out'}
   );
  }
 }

 function pitch(){return Math.max(width*(width<650?.62:.48),bikeWidth*.84)}

 function paint(next, animate=true) {
  position=next;
  const active=wrap(Math.round(position),count);
  sync(active,animate);
  bikes.forEach((bike,i)=>{
   const offset=focusOffset(i,position,count);
   const pose=focusPose(offset,width);
   const visible=String(pose.visible);
   if(bike.dataset.visible!==visible){
    bike.dataset.visible=visible;
    bike.style.visibility=pose.visible?'visible':'hidden';
    bike.tabIndex=pose.visible?0:-1;
    bike.setAttribute('aria-hidden',String(!pose.visible));
   }
   bike.dataset.center=String(i===active);
   if(!pose.visible)return;
   bike.style.transform=`translate3d(calc(-50% + ${offset*pitch()}px),${pose.y}px,0) scale(${pose.scale})`;
   bike.style.opacity=String(pose.opacity);
   bike.style.zIndex=String(pose.z);
  });
 }

 const playback=bindRailPlayback({
  viewport:stage,scope:gallery,toggle:rotation,
  blocked:()=>Boolean(drag||settle||count<2),
  advance:delta=>paint(position+delta/7600),
  onReduced:()=>{cancelAnimationFrame(settle);settle=0;detailsAnimation?.cancel();paint(Math.round(position),false)},
  onMode:playing=>announcement.setAttribute('aria-live',playing?'off':'polite')
 });

 function goTo(next, keyboard=false){
  cancelAnimationFrame(settle);settle=0;
  const from=position,to=Math.round(from+focusOffset(wrap(next,count),from,count));
  playback.hold();
  if(reduced.matches||Math.abs(to-from)<.001){
   paint(to,false);if(keyboard)stage.focus({preventScroll:true});return;
  }
  if(keyboard)stage.focus({preventScroll:true});
  const started=performance.now();
  function tick(now){
   const t=Math.min(1,(now-started)/560);
   paint(from+(to-from)*focusEase(t));
   settle=t<1?requestAnimationFrame(tick):0;
   if(!settle)playback.refresh();
  }
  settle=requestAnimationFrame(tick);
 }

 const prev=gallery.querySelector('[data-focus-prev]'),next=gallery.querySelector('[data-focus-next]');
 prev.disabled=next.disabled=count<2;
 listen(prev,'click',()=>goTo(index-1));
 listen(next,'click',()=>goTo(index+1));
 selectors.forEach((button,i)=>listen(button,'click',()=>goTo(i)));
 listen(stage,'keydown',event=>{
  if(event.ctrlKey||event.altKey||event.metaKey||!['Home','End','ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();
  goTo(event.key==='Home'?0:event.key==='End'?count-1:index+(event.key==='ArrowRight'?1:-1),true);
 });
 listen(stage,'pointerdown',event=>{
  if(drag||event.button!==0||event.isPrimary===false||count<2||event.target.closest('.mf-moto-arrows'))return;
  cancelAnimationFrame(settle);settle=0;ignoredClickUntil=0;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,base:position,moved:false};
  playback.refresh();
 });
 listen(stage,'pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
  if(!drag.moved){
   if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;playback.hold();return}
   if(Math.abs(dx)<10)return;
   drag.moved=true;gallery.dataset.dragging='true';
   stage.setPointerCapture(event.pointerId);
  }
  if(!reduced.matches)paint(drag.base-dx/pitch(),false);
 });
 function finish(event,cancelled=false){
  if(!drag||event.pointerId!==drag.id)return;
  const movement=drag;drag=null;delete gallery.dataset.dragging;
  if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
  if(!movement.moved){playback.hold();return}
  ignoredClickUntil=performance.now()+400;
  const dx=movement.x-event.clientX;
  const choice=cancelled||Math.abs(dx)<26?Math.round(movement.base):Math.round(movement.base+Math.sign(dx)*.6+(reduced.matches?0:dx/pitch()));
  goTo(choice);
 }
 listen(document,'pointerup',event=>finish(event));
 listen(document,'pointercancel',event=>finish(event,true));
 listen(stage,'lostpointercapture',event=>{if(event.target===stage)finish(event,true)});
 bikes.forEach(bike=>listen(bike,'click',event=>{if(event.detail&&performance.now()<ignoredClickUntil)event.preventDefault()}));
 const resize=new ResizeObserver(()=>{width=stage.clientWidth;bikeWidth=bikes[0].offsetWidth;paint(position,false)});
 resize.observe(stage);
 paint(position,false);
 return ()=>{
  bindings.abort();playback.destroy();resize.disconnect();
  cancelAnimationFrame(settle);detailsAnimation?.cancel();
 };
}
