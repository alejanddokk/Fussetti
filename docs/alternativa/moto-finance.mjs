import {LENDERS} from './moto-lenders.mjs?v=credit-options1';
/* HorizonX Motion Focus: authored [.33,0,0,1] easing and centre role scaling.
   See references/horizonx/motion-focus.html. Native, readable, manual carousels. */
import {e,icon} from '../nueva/ui.mjs';
import {money,unitPrice} from './domain.mjs';
import {showroomModels,motoName,motoPhoto} from './moto-showroom.mjs?v=vitrina1';
import {focusFrames} from './moto-focus.mjs?v=fotos2';

export function financeRoute(r){
 const page=r.path[0],q=r.q;
 if(['motos','motos-focus'].includes(page))return page;
 return page==='catalogo'&&(q.get('cat')==='Motos'||q.get('tipo')==='motorcycle')&&!q.get('q')&&!q.has('ofertas')&&!q.get('orden')?'catalogo-motos':'';
}
// Public sales contact from motos.fussetti.com, checked 2026-11-04.
export const MOTO_SALES_PHONE='5493412763577';
export const CONTACT_INTENTS=[
 {id:'finance',label:'Financiación',copy:'Quisiera conocer el precio vigente, la disponibilidad y las opciones de financiación. ¿Me asesoran?'},
 {id:'buy',label:'Precio y stock',copy:'Quisiera conocer el precio vigente y la disponibilidad para comprarla. ¿Cómo puedo avanzar?'},
 {id:'advice',label:'Asesoramiento',copy:'Quisiera saber si es el modelo indicado para mí y conocer las alternativas. ¿Me ayudan a elegir?'}
];
export function salesMessage(p,intent='finance',lenderId=''){
 const option=CONTACT_INTENTS.find(x=>x.id===intent)||CONTACT_INTENTS[0];
 const lender=option.id==='finance'&&LENDERS.find(l=>l.id===lenderId);
 const copy=lender?`Quisiera consultar por financiación con ${lender.name}, el precio vigente y los requisitos. ¿Está disponible para este modelo?`:option.copy;
 return `Hola Fussetti, ${p?'me interesa la '+p.name+'.':'estoy buscando una moto Honda.'} ${copy}`;
}
export const salesHref=(p,intent='finance',lenderId='')=>'https://wa.me/'+MOTO_SALES_PHONE+'?text='+encodeURIComponent(salesMessage(p,intent,lenderId));
const whatsappIcon='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-4Z"/><path d="M8.1 7.6c-.6.2-.8 1-.6 1.8.7 2.8 3.4 5.4 6 6 .9.2 1.8-.3 2-1l-2.1-1.3-.9.9c-1.5-.7-2.5-1.7-3.2-3.2l.8-.9-1.3-2.3Z"/></svg>';
function creditPhoto(p){return `<img src="${e(focusFrames[p.id]||motoPhoto(p))}" alt="${e(p.name)}">`}
export function financeView(s,selectedId='',intent='finance',lenderId=''){
 const models=showroomModels(s),p=models.find(p=>p.id===selectedId)||models[0];
 const selectedIntent=CONTACT_INTENTS.some(x=>x.id===intent)?intent:'finance';
 return `<div class="mf-credit-shell mf-credit-sales">
 <header class="mf-credit-header"><div><img src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/1e1516fa4fa9500a.png" alt="Fussetti"><span>MOTOS · HABLEMOS</span></div><button type="button" data-credit-close aria-label="Cerrar consulta de motos">${icon('close',20)}</button></header>
 <div class="mf-credit-layout"><aside class="mf-credit-visual" aria-label="Elegí la moto que te interesa"><img class="mf-credit-honda" src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/motos/honda-logo.svg" alt="Honda"><div class="mf-credit-photo">${p?creditPhoto(p):''}</div><div class="mf-credit-model"><span data-credit-model>${p?e(motoName(p)):'Tu próxima Honda'}</span><strong data-credit-price>${p?money(unitPrice(s,p)):''}</strong><small>Referencia demo · consultá el precio vigente</small></div>
 <section class="mf-credit-models" aria-label="Carrusel de modelos Honda" aria-roledescription="carrusel"><div><span>Elegí tu modelo</span><button type="button" data-credit-model-prev aria-label="Moto anterior para consultar" ${models.length<2?'disabled':''}>${icon('arrow',15)}</button><button type="button" data-credit-model-next aria-label="Moto siguiente para consultar" ${models.length<2?'disabled':''}>${icon('arrow',15)}</button></div><div class="mf-credit-model-track" tabindex="0" aria-label="Modelos. Deslizá o usá las flechas del teclado">${models.map(m=>`<button type="button" data-credit-model-id="${e(m.id)}" ${m.id===p?.id?'aria-current="true"':''}>${e(motoName(m))}</button>`).join('')}</div><span class="moto-sr" data-credit-model-announcement aria-live="polite"></span></section></aside>
 <div class="mf-credit-copy"><span class="mf-credit-kicker">UN ASESOR, TU PRÓXIMO PASO</span><h2 id="moto-credit-title">¿Te interesa <br>esta Honda?</h2><p class="mf-credit-intro">Elegí qué querés consultar. Te llevamos a WhatsApp con el mensaje listo.</p>
 <fieldset class="mf-credit-intents"><legend>¿En qué te ayudamos?</legend><div class="mf-credit-options">${CONTACT_INTENTS.map(option=>`<label><input type="radio" name="moto-credit-intent" value="${option.id}" ${selectedIntent===option.id?'checked':''}><span>${option.label}</span></label>`).join('')}<span class="mf-credit-glider" aria-hidden="true"></span></div></fieldset>
 <div class="mf-credit-message"><span>TU MENSAJE</span><blockquote data-credit-message>${e(salesMessage(p,selectedIntent,lenderId))}</blockquote><small>Podés editarlo al abrir WhatsApp.</small></div>
 <a class="mf-credit-whatsapp" data-credit-cta href="${e(salesHref(p,selectedIntent,lenderId))}" target="_blank" rel="noopener noreferrer">${whatsappIcon}<span>Hablar por WhatsApp</span>${icon('arrow',17)}</a>
 <p class="mf-credit-destination">Ventas de motos · +54 9 341 276-3577</p><p class="mf-credit-handoff">Abrís el WhatsApp real de Fussetti. Revisá el mensaje antes de enviarlo.</p>
 <button class="mf-credit-keep" type="button" data-credit-close>Seguir viendo motos</button><p class="mf-credit-terms">Precio, disponibilidad y condiciones de financiación a confirmar con el asesor.</p></div></div></div>`;
}
export function createMotoFinance(s,doc=document){
 const dialog=doc.querySelector('#moto-credit-dialog'),media=matchMedia('(prefers-reduced-motion: reduce)');
 let root=null,routeKey='',returnFocus=null,bindings=null,animations=[],model=0,models=[],intent='finance',lenderChoice='';
 const listen=(node,type,fn)=>node?.addEventListener(type,fn,{signal:bindings.signal});
 const cancelAnimations=()=>{animations.forEach(a=>a?.cancel());animations=[]};
 function animate(node,frames){if(!media.matches&&node?.animate)animations.push(node.animate(frames,{duration:500,easing:'cubic-bezier(.33,0,0,1)'}))}
 function close(){if(dialog.open)dialog.close()}
 function show(lenderId='',modelId=''){
  if(!routeKey||doc.hidden||doc.querySelector('dialog[open]'))return;
  lenderChoice=typeof lenderId==='string'&&LENDERS.some(l=>l.id===lenderId)?lenderId:'';if(lenderChoice)intent='finance';
  returnFocus=doc.activeElement;models=showroomModels(s);const active=root.querySelector('[data-focus-summary]:not([hidden]),[data-moto-slide][data-active="true"]');
  const id=models.some(p=>p.id===modelId)?modelId:active?.dataset.model||active?.dataset.motoSlide;model=Math.max(0,models.findIndex(p=>p.id===id));
  bindings?.abort();bindings=new AbortController();dialog.innerHTML=financeView(s,models[model]?.id,intent,lenderChoice);dialog.showModal();
  listen(dialog,'close',()=>{cancelAnimations();bindings.abort();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})});
  dialog.querySelectorAll('[data-credit-close]').forEach(b=>listen(b,'click',close));
  listen(dialog,'click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)close()}});
  function syncMessage(){const p=models[model];dialog.querySelector('[data-credit-message]').textContent=salesMessage(p,intent,lenderChoice);dialog.querySelector('[data-credit-cta]').href=salesHref(p,intent,lenderChoice)}
  function choose(next){if(!models.length)return;model=(next+models.length)%models.length;const p=models[model],photo=dialog.querySelector('.mf-credit-photo');cancelAnimations();photo.innerHTML=creditPhoto(p);dialog.querySelector('[data-credit-model]').textContent=motoName(p);dialog.querySelector('[data-credit-price]').textContent=money(unitPrice(s,p));dialog.querySelector('[data-credit-model-announcement]').textContent='Modelo para consultar: '+p.name;syncMessage();dialog.querySelectorAll('[data-credit-model-id]').forEach(b=>{if(b.dataset.creditModelId===p.id){b.setAttribute('aria-current','true');b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})}else b.removeAttribute('aria-current')});animate(photo.firstElementChild,[{opacity:.25,transform:'translateX(20px) scale(.92)'},{opacity:1,transform:'translateX(0) scale(1)'}])}
  listen(dialog.querySelector('.mf-credit-model-track'),'keydown',ev=>{if(['ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();choose(model+(ev.key==='ArrowRight'?1:-1))}});
  dialog.querySelectorAll('[name="moto-credit-intent"]').forEach(input=>listen(input,'change',()=>{intent=input.value;syncMessage()}));
  dialog.querySelectorAll('[data-credit-model-id]').forEach(b=>listen(b,'click',()=>choose(models.findIndex(p=>p.id===b.dataset.creditModelId))));listen(dialog.querySelector('[data-credit-model-prev]'),'click',()=>choose(model-1));listen(dialog.querySelector('[data-credit-model-next]'),'click',()=>choose(model+1));
  dialog.querySelector('[data-credit-close]').focus();animate(dialog.querySelector('.mf-credit-shell'),[{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}]);
 }
 return {update(nextRoot,r){const next=financeRoute(r);if(next!==routeKey)close();routeKey=next;root=nextRoot;const brand=root.querySelector('.moto-carousel-branding,.mf-moto-branding');if(next&&brand){let button=brand.querySelector('[data-open-credit]');if(!button){button=doc.createElement('button');button.type='button';button.dataset.openCredit='';button.className='moto-credit-trigger';button.textContent='Financiación';brand.append(button)}}root.querySelectorAll('[data-open-credit]').forEach(b=>{b.onclick=()=>show(b.dataset.creditLender||'',b.dataset.creditModel||'')})},destroy(){routeKey='';close();bindings?.abort();cancelAnimations()}};
}
