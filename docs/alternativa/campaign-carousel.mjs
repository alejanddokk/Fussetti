import {productPhoto} from './product-media.mjs';
import {e,icon} from '../nueva/ui.mjs';
import {money,unitPrice} from './domain.mjs';
import {splitPayments} from './knowledge.mjs';
import {discoveryOffers} from './discovery-model.mjs';
import {productLabel} from './horizonx-ui.mjs';

export const CAMPAIGN_INTERVAL=6000;
export const campaignIndex=(index,count)=>count?((index%count)+count)%count:0;
const hooks={coffee:'Tu próximo café, mejor elegido.',tv:'Tus planes, en otra pantalla.',air:'Dale aire a tus próximos planes.',washer:'Tus proyectos, en marcha.'};
export function campaignSlides(s){
 return [
  {id:'financiacion',kind:'photo',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/1a5beecf84582b35.png',title:'Financiación Fussetti',heading:'Elegí y simulá tu financiación.',copy:'Conocé el recorrido de financiación de demostración.',href:'#financiacion',cta:'Ver financiación demo',alt:'Banner original Fussetti: financiación con DNI. Publicidad de referencia.'},
  {id:'cuotas',kind:'photo',image:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/assets/011c0c65c8c9cf11.png',title:'Comprá con Fussetti',heading:'Oportunidades para tus próximos planes.',copy:'Explorá productos y probá la compra con cuotas demo.',href:'#catalogo?ofertas=1',cta:'Explorar oportunidades',alt:'Banner original Fussetti: compras web y cuotas. Publicidad de referencia.'},
  ...discoveryOffers(s).items.slice(0,2).map((p,i)=>({id:'oferta-'+p.id,kind:'offer',p,title:productLabel(p).name,heading:hooks[p.type]||'Una buena oportunidad para vos.',href:'#producto/'+encodeURIComponent(p.id),cta:'Ver producto',tone:i%2?'charcoal':'red'}))
 ];
}
function slideBody(s,slide,index){
 if(slide.kind==='photo')return `<a class="campaign-photo campaign-photo-${index}" href="${slide.href}"><img src="${slide.image}" width="1600" height="340" alt="${e(slide.alt)}" ${index===0?'fetchpriority="high"':'loading="lazy"'}><div class="campaign-mobile-copy"><span>FUSSETTI · EXPERIENCIA DEMO</span><strong>${slide.heading}</strong><p>${slide.copy}</p></div></a>`;
 const p=slide.p,price=unitPrice(s,p),payments=splitPayments(price);
 return `<div class="campaign-offer" data-tone="${slide.tone}"><div class="container campaign-offer-inner"><div class="campaign-offer-copy"><p class="campaign-kicker">OPORTUNIDAD FUSSETTI <span>${p.cyber?'CYBER':'−'+p.discount+'%'} DEMO</span></p><h2>${slide.heading}</h2><p class="campaign-product-name">${e(p.name)}</p><div class="campaign-price"><del>${money(p.price)}</del><strong>${money(price)}</strong><span>Ahorrás ${money(p.price-price)}</span></div><small>3 cuotas demo desde ${money(payments[0])}.</small></div><a class="campaign-offer-image" href="${slide.href}"><img src="${e(productPhoto(p))}" alt="${e(p.name)}" loading="lazy"><span>Ver producto ${icon('arrow',17)}</span></a></div></div>`;
}
export function campaignView(s,state={}){
 const slides=campaignSlides(s),index=campaignIndex(state.index||0,slides.length);
 return `<section class="campaign-carousel" aria-label="Campañas y oportunidades Fussetti" aria-roledescription="carrusel" data-active-index="${index}"><div class="campaign-stage" tabindex="0" aria-label="Usá las flechas izquierda y derecha para cambiar de campaña">${slides.map((slide,i)=>`<article class="campaign-slide" data-campaign-slide data-id="${e(slide.id)}" data-title="${e(slide.title)}" role="group" aria-roledescription="diapositiva" aria-label="${i+1} de ${slides.length}: ${e(slide.title)}" ${i===index?'':'hidden inert'}>${slideBody(s,slide,i)}</article>`).join('')}<button type="button" class="campaign-arrow campaign-prev" data-campaign-prev aria-label="Campaña anterior">${icon('arrow',19)}</button><button type="button" class="campaign-arrow campaign-next" data-campaign-next aria-label="Campaña siguiente">${icon('arrow',19)}</button></div><span class="campaign-announcement" aria-live="polite" aria-atomic="true"></span></section>`;
}

// Fold Carousel / HorizonX: autoplay scheduling, direct manipulation and folded
// perspective entry, adapted to full-width banners and native links/buttons.
export function campaignHeader(s,page,header,state={}){return page==='inicio'?header.replace('<header ',campaignView(s,state)+'<header '):header}
export function bindCampaign(root,state){
 if(!root)return {destroy(){}};
 const slides=[...root.querySelectorAll('[data-campaign-slide]')];
 const stage=root.querySelector('.campaign-stage'),media=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 let timer=0,hovered=false,visible=true,arrowPlayback=false,focused=false,entry=null,down=null,suppressUntil=0;
 state.index=campaignIndex(state.index||0,slides.length);
 const listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
 const stop=()=>{clearTimeout(timer);timer=0};
 const sync=()=>{
  stop();const running=!focused&&!media.matches&&(!hovered||arrowPlayback)&&visible&&!document.hidden;
  root.dataset.autoplay=String(running);
  if(running)timer=setTimeout(()=>show(state.index+1,false),CAMPAIGN_INTERVAL)
 };
 function show(next,manual=true){
  entry?.cancel();state.index=campaignIndex(next,slides.length);root.dataset.activeIndex=String(state.index);
  slides.forEach((slide,i)=>{slide.hidden=i!==state.index;slide.inert=i!==state.index});
  const slide=slides[state.index];
  if(!media.matches)entry=slide.animate([{opacity:.15,transform:'perspective(1400px) translateX(34px) rotateY(-3deg)'},{opacity:1,transform:'perspective(1400px) translateX(0) rotateY(0deg)'}],{duration:650,easing:'cubic-bezier(.2,.85,.25,1)',fill:'none'});
  if(manual)root.querySelector('.campaign-announcement').textContent=`${state.index+1} de ${slides.length}: ${slide.dataset.title}`;
  sync();
 }
 const advanceFromArrow=direction=>{focused=false;arrowPlayback=true;show(state.index+direction)};
 listen(root.querySelector('[data-campaign-prev]'),'click',()=>advanceFromArrow(-1));
 listen(root.querySelector('[data-campaign-next]'),'click',()=>advanceFromArrow(1));
 listen(root,'pointerenter',ev=>{if(ev.pointerType==='mouse'){hovered=true;sync()}});listen(root,'pointerleave',()=>{hovered=false;arrowPlayback=false;sync()});
 // Pause while reading a focused campaign link; arrows keep automatic playback.
 listen(root,'focusin',ev=>{focused=!ev.target.closest('.campaign-arrow');sync()});
 listen(root,'focusout',ev=>{if(!root.contains(ev.relatedTarget)){focused=false;sync()}});
 listen(stage,'keydown',ev=>{if(['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();advanceFromArrow(ev.key==='ArrowRight'?1:-1)}});
 listen(stage,'pointerdown',ev=>{if(ev.pointerType==='touch')down={x:ev.clientX,y:ev.clientY}});
 listen(stage,'pointerup',ev=>{if(!down)return;const dx=ev.clientX-down.x,dy=ev.clientY-down.y;down=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){focused=false;arrowPlayback=true;suppressUntil=performance.now()+400;show(state.index+(dx<0?1:-1))}});
 listen(stage,'pointercancel',()=>{down=null});listen(stage,'click',ev=>{if(performance.now()<suppressUntil)ev.preventDefault()});
 listen(document,'visibilitychange',sync);listen(media,'change',sync);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.15});observer.observe(root);sync();
 return {destroy(){stop();entry?.cancel();observer.disconnect();abort.abort()}};
}
