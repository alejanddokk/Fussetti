import {e} from '../nueva/ui.mjs';
export const LENDERS=Object.freeze([
 {id:'argentino',name:'Crédito Argentino',logo:'541a28f1c65456ef.png',box:[24,53,103,45]},
 {id:'ceibo',name:'Ceibo Créditos',logo:'d615f6c55678bd9e.png',box:[21,58,109,30]},
 {id:'credicuotas',name:'Credicuotas',logo:'49d1761b22c5644c.png',box:[21,64,108,24]},
 {id:'cuota-ya',name:'Cuota Ya',logo:'2561b0d8006f58c1.png',box:[21,40,109,72]},
 {id:'directo',name:'Crédito Directo',logo:'1cae60671b6ea5db.png',box:[21,62,108,28]},
 {id:'creditech',name:'Creditech',logo:'2d8158414f76d468.png',box:[22,60,106,34]},
 {id:'naranja',name:'Tarjeta Naranja',logo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/naranja-x-official.png'}
].map(Object.freeze));
function logo(l){return l.box?`<svg viewBox="${l.box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/${l.logo}" width="150" height="150"/></svg>`:`<img src="${e(l.logo)}" alt="" draggable="false">`}
export function lendersView(){
 const group=clone=>`<div class="lender-logo-group" ${clone?'aria-hidden="true"':''}>${LENDERS.map(l=>clone?`<span class="lender-logo" data-open-credit data-credit-lender="${l.id}">${logo(l)}</span>`:`<button class="lender-logo" type="button" data-open-credit data-credit-lender="${l.id}" aria-label="Ver financiación con ${e(l.name)}">${logo(l)}</button>`).join('')}</div>`;
 return `<section class="moto-lenders" aria-labelledby="moto-lenders-title"><div class="container moto-lenders-heading"><h2 id="moto-lenders-title">Opciones para solicitar tu crédito</h2><p>Financiá tu moto con estas entidades. Tocá un logo para consultar requisitos y condiciones.</p><small>Otorgamiento sujeto a evaluación y aprobación de cada entidad.</small></div><div id="moto-lenders-track" class="moto-lenders-track"><div class="lender-logo-loop">${group(false)}${group(true)}</div></div></section>`;
}
export function bindLenders(root){
 const section=root.querySelector('.moto-lenders');if(!section)return ()=>{};
 const track=section.querySelector('.moto-lenders-track'),group=section.querySelector('.lender-logo-group'),media=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController();
 let visible=true,frame=0,lastWidth=0;
 const listen=(node,event,fn)=>node.addEventListener(event,fn,{signal:abort.signal});
 const pause=()=>{section.dataset.paused=String(document.hidden||!visible)};
 const size=()=>{const width=group.getBoundingClientRect().width;if(width!==lastWidth){lastWidth=width;section.style.setProperty('--lenders-duration',`${Math.max(1,width/32)}s`)}};
 listen(document,'visibilitychange',pause);
 listen(section,'focusin',ev=>{if(ev.target.matches(':focus-visible')){section.dataset.keyboard='true';cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;ev.target.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'})})}});
 listen(section,'focusout',ev=>{if(!section.contains(ev.relatedTarget)){delete section.dataset.keyboard;track.scrollLeft=0}});
 listen(media,'change',()=>{track.scrollLeft=0;size()});
 const resize=new ResizeObserver(size);resize.observe(group);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;pause()});intersection.observe(section);size();pause();
 return ()=>{cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();abort.abort()};
}
