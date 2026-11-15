import {selectedMotoModel,rememberMotoModel} from './moto-presentation.mjs';
import {followMotoThumbnail} from './moto-thumbnails.mjs';
import {motoJourneyView} from './moto-journey.mjs?v=credit-options1';
/* Motion Focus adapted from HorizonX. Original complete export retained in
   references/horizonx/motion-focus.html. Translation, role scaling and its
   Newton-refined bezier are adapted to native DOM rather than a GSAP loop. */
import {showroomModels,motoPhoto,motoName,motoDetails} from './moto-showroom.mjs?v=deslizamiento1';
import {e,icon} from '../nueva/ui.mjs';

export const FOCUS_DURATION=800,FOCUS_INTERVAL=7800,FOCUS_SIDE_SCALE=1/1.44001;
const wrap=(n,m)=>m?((n%m)+m)%m:0;
// Separate alpha cutouts keep the source photos intact for the individual view.
// Viewports normalize visible height and the wheel baseline, not raster opacity.
export const focusFrames={
 'honda-xr-300':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/xr-300-transparent.png',size:[1994,789],box:[382,0,1182,784]},
 'honda-wave-110-s':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/wave-110-transparent.png',size:[1991,789],box:[384,4,1161,782]},
 'honda-navi':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/navi-transparent.png',size:[1991,789],box:[414,-4,1163,789]},
 'honda-cb-125f':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/cb-125f-transparent.png',size:[1991,790],box:[380,17,1224,768]},
 'honda-cb300':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/cb300-transparent.png',size:[1673,940],box:[44,6,1547,956]},
 'honda-xr190':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/xr-190-transparent.png',size:[1536,1024],box:[15,12,1515,1000]},
 'honda-xr150l':{src:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/xr-150l-transparent.png',size:[1586,992],box:[56,17,1464,953]}
};
function bikeImage(p){
 const f=focusFrames[p.id],src=e(f?.src||motoPhoto(p));
 if(!f)return `<img class="mf-bike-image" src="${src}" alt="" draggable="false">`;
 return `<svg class="mf-bike-image" viewBox="${f.box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false"><image href="${src}" x="0" y="0" width="${f.size[0]}" height="${f.size[1]}"/></svg>`;
}
export function focusView(s){
 const models=showroomModels(s);
 if(!models.length)return '<section class="container page empty"><h1>Todavía no hay motos en este escenario.</h1><a class="button" href="#consulta?motos=1">Preparar consulta demo</a></section>';
 return `<div class="moto-showroom moto-focus-showroom"><section class="mf-motos" data-moto-focus aria-roledescription="carrusel" aria-label="Modelos Honda en fila">
 <div class="container mf-moto-branding"><a href="../" aria-label="Volver a Fussetti"><img src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/1e1516fa4fa9500a.png" alt="Fussetti"></a><span class="mf-honda"><img src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/honda-logo.svg" alt="Honda"></span></div>
 <div class="container mf-moto-intro"><h1>Tu próxima moto, en primer plano.</h1><button type="button" class="moto-rotation" data-moto-rotation>Pausar</button></div>
 <div class="mf-moto-stage" tabindex="0" aria-label="Motos en fila. Usá las flechas para elegir, Inicio o Fin para ir a los extremos y Escape para detener el avance automático.">
 ${models.map((p,i)=>`<a class="mf-moto-bike" href="#producto/${encodeURIComponent(p.id)}" draggable="false" data-focus-bike="${i}" data-model="${e(p.id)}" aria-label="Ver ficha de ${e(p.name)}" ${i>1&&i!==models.length-1?'tabindex="-1"':''} style="${i===0?'':'visibility:hidden;'}"><span class="mf-bike-shadow" aria-hidden="true"></span>${bikeImage(p)}<span class="mf-bike-caption" aria-hidden="true">${e(motoName(p))} ${icon('arrow',12)}</span></a>`).join('')}
 <span class="mf-moto-count moto-sr" aria-live="polite" aria-atomic="true"><b data-focus-count>01</b><span>/ ${String(models.length).padStart(2,'0')}</span><span data-focus-label>${e(motoName(models[0]))}</span></span><div class="mf-moto-arrows"><button type="button" data-focus-prev aria-label="Moto anterior">${icon('arrow',20)}</button><button type="button" data-focus-next aria-label="Moto siguiente">${icon('arrow',20)}</button></div></div>
 <div class="container mf-moto-details">${models.map((p,i)=>`<article class="mf-moto-summary" data-focus-summary="${i}" data-model="${e(p.id)}" ${i?'hidden inert aria-hidden="true"':''}>${motoDetails(s,p)}</article>`).join('')}</div>
 <div class="container mf-moto-selector" aria-label="Elegir modelo de moto">${models.map((p,i)=>`<button type="button" data-focus-select="${i}" aria-label="Seleccionar ${e(p.name)}" ${i===0?'aria-current="true"':''}><small aria-hidden="true">${String(i+1).padStart(2,'0')}</small><img src="${e(focusFrames[p.id]?.src||motoPhoto(p))}" alt="" loading="lazy"><span>${e(motoName(p))}</span></button>`).join('')}</div>
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
export function bindMotoFocus(root){
 const gallery=root.querySelector('[data-moto-focus]');if(!gallery)return ()=>{};
 const stage=gallery.querySelector('.mf-moto-stage'),bikes=[...gallery.querySelectorAll('[data-focus-bike]')],panels=[...gallery.querySelectorAll('[data-focus-summary]')],selectors=[...gallery.querySelectorAll('[data-focus-select]')];
 const rotation=gallery.querySelector('[data-moto-rotation]');
 const count=bikes.length;if(!count)return ()=>{};
 const media=matchMedia('(prefers-reduced-motion: reduce)'),cleanups=[];
 let index=Math.max(0,bikes.findIndex(n=>n.dataset.model===selectedMotoModel())),pos=index,target=index,frame=0,timer=0,start=0,from=pos,drag=null,paused=false,hover=false,focused=false,visible=true,disposed=false,suppressUntil=0,infoAnimation=null,duration=FOCUS_DURATION;
 const listen=(node,type,fn,opts)=>{node.addEventListener(type,fn,opts);cleanups.push(()=>node.removeEventListener(type,fn,opts))};
 const stop=()=>{clearTimeout(timer);timer=0};
 function paint(){
  bikes.forEach((bike,i)=>{
   const p=focusPose(focusOffset(i,pos,count),stage.clientWidth);
   if(!p.visible&&bike.contains(document.activeElement))stage.focus({preventScroll:true});
   bike.style.transform=`translate3d(calc(-50% + ${p.x}px),${p.y}px,0) scale(${p.scale})`;
   bike.style.opacity=String(p.opacity);bike.style.zIndex=String(p.z);bike.style.visibility=p.visible?'visible':'hidden';
   bike.tabIndex=p.visible?0:-1;bike.setAttribute('aria-hidden',String(!p.visible));bike.dataset.center=String(i===index);
  });
 }
 function sync(){
  rememberMotoModel(bikes[index].dataset.model);gallery.dataset.activeIndex=String(index);
  bikes.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  panels.forEach((p,i)=>{p.hidden=i!==index;p.inert=i!==index;p.setAttribute('aria-hidden',String(i!==index))});
  selectors.forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
  followMotoThumbnail(selectors[index],media.matches);
  const label=panels[index].querySelector('h2').textContent;
  gallery.querySelector('[data-focus-count]').textContent=String(index+1).padStart(2,'0');
  gallery.querySelector('[data-focus-label]').textContent=label;
 }
 function schedule(){
  stop();const running=!disposed&&!paused&&!media.matches&&!hover&&!focused&&visible&&!document.hidden&&!document.querySelector('dialog[open]')&&!drag&&count>1;
  rotation.hidden=media.matches||count<2;rotation.textContent=paused?'Reanudar':'Pausar';
  gallery.dataset.autoplay=String(running);gallery.querySelector('.mf-moto-count').setAttribute('aria-live',running?'off':'polite');
  if(running)timer=setTimeout(()=>go(Math.round(target)+1,false),FOCUS_INTERVAL);
 }
 function tick(now){
  frame=0;if(disposed)return;if(!start)start=now;
  const t=Math.min(1,(now-start)/duration);pos=from+(target-from)*(duration===FOCUS_DURATION?focusEase(t):t*t*(3-2*t));paint();
  if(t<1)frame=requestAnimationFrame(tick);else{pos=target;paint();start=0;schedule()}
 }
 function go(next,user=true){
  if(disposed)return;duration=user?FOCUS_DURATION:2400;stop();cancelAnimationFrame(frame);frame=0;start=0;from=pos;index=wrap(Math.round(next),count);target=Math.round(pos+focusOffset(index,pos,count));
  infoAnimation?.cancel();sync();
  if(media.matches||Math.abs(target-pos)<.001){pos=target;paint();schedule()}
  else{frame=requestAnimationFrame(tick);infoAnimation=panels[index].animate?.([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'cubic-bezier(.33,0,0,1)'})}
 }
 function choose(n){
  const current=wrap(Math.round(target),count);let delta=wrap(n-current,count);if(delta>count/2)delta-=count;go(Math.round(target)+delta);
 }
 listen(gallery.querySelector('[data-focus-prev]'),'click',()=>go(Math.round(target)-1));
 listen(gallery.querySelector('[data-focus-next]'),'click',()=>go(Math.round(target)+1));
 bikes.forEach(b=>listen(b,'click',ev=>{if(ev.detail&&performance.now()<suppressUntil)ev.preventDefault()}));
 listen(rotation,'click',()=>{paused=!paused;schedule()});
 selectors.forEach((b,i)=>listen(b,'click',()=>choose(i)));
 listen(stage,'keydown',ev=>{
  if(['ArrowLeft','ArrowRight','Home','End','Escape'].includes(ev.key)){
   ev.preventDefault();if(ev.key==='Escape'){paused=true;schedule();return}
   if(ev.key==='Home')choose(0);else if(ev.key==='End')choose(count-1);else go(Math.round(target)+(ev.key==='ArrowRight'?1:-1));
  }
 });
 listen(stage,'pointerenter',ev=>{if(ev.pointerType==='mouse'){hover=true;schedule()}});listen(stage,'pointerleave',()=>{hover=false;schedule()});
 listen(gallery,'focusin',()=>{focused=document.activeElement!==rotation;schedule()});listen(gallery,'focusout',ev=>{focused=gallery.contains(ev.relatedTarget)&&ev.relatedTarget!==rotation;schedule()});
 listen(stage,'pointerdown',ev=>{
  if(drag||ev.button!==0||ev.isPrimary===false||count<2)return;
  drag={id:ev.pointerId,x:ev.clientX,y:ev.clientY,lastX:ev.clientX,lastT:performance.now(),base:pos,velocity:0,moved:false};stop();
 });
 listen(stage,'pointermove',ev=>{
  if(!drag||drag.id!==ev.pointerId)return;
  const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(!drag.moved){
   if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){drag=null;schedule();return}
   if(Math.abs(dx)<12)return;
   cancelAnimationFrame(frame);frame=0;drag.base=pos;drag.moved=true;gallery.dataset.dragging='true';
   try{stage.setPointerCapture(ev.pointerId)}catch{}
  }
  const now=performance.now(),pitch=Math.min(480,Math.max(120,stage.clientWidth*.31));
  drag.velocity=-(ev.clientX-drag.lastX)/Math.max(1,now-drag.lastT)*1000/pitch;drag.lastX=ev.clientX;drag.lastT=now;
  if(!media.matches){pos=drag.base-dx/pitch;paint()}
  ev.preventDefault();
 });
 const finish=(ev,cancelled=false)=>{
  if(!drag||drag.id!==ev.pointerId)return;
  const d=drag;drag=null;delete gallery.dataset.dragging;
  if(d.moved){suppressUntil=performance.now()+450;const drift=Math.max(-.6,Math.min(.6,d.velocity*.12));const wanted=cancelled?Math.round(target):media.matches?Math.round(target)+(ev.clientX<d.x?1:-1):Math.round(pos+drift);go(wanted)}
  else schedule();
  try{if(stage.hasPointerCapture(ev.pointerId))stage.releasePointerCapture(ev.pointerId)}catch{}
 };
 // Document listeners also release a short press that leaves the stage before
 // pointer capture starts, without swallowing normal clicks on a side model.
 listen(document,'pointerup',ev=>finish(ev));listen(document,'pointercancel',ev=>finish(ev,true));listen(stage,'lostpointercapture',ev=>{if(ev.target===stage)finish(ev,true)});
 listen(document,'visibilitychange',schedule);listen(document,'close',schedule,true);
 listen(media,'change',()=>{const id=drag?.id;drag=null;delete gallery.dataset.dragging;cancelAnimationFrame(frame);frame=0;infoAnimation?.cancel();pos=target;paint();try{if(id!==undefined&&stage.hasPointerCapture(id))stage.releasePointerCapture(id)}catch{}schedule()});
 const resize=new ResizeObserver(()=>paint());resize.observe(stage);cleanups.push(()=>resize.disconnect());
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.2});intersection.observe(gallery);cleanups.push(()=>intersection.disconnect());
 gallery.querySelectorAll('[data-focus-prev],[data-focus-next]').forEach(b=>b.disabled=count<2);sync();paint();schedule();
 return ()=>{disposed=true;stop();cancelAnimationFrame(frame);infoAnimation?.cancel();const id=drag?.id;drag=null;try{if(id!==undefined&&stage.hasPointerCapture(id))stage.releasePointerCapture(id)}catch{}cleanups.forEach(fn=>fn())};
}
