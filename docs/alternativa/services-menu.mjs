import {pageZoom} from './interface-scale.mjs';
import {e,icon} from '../nueva/ui.mjs';

export const serviceEntries=Object.freeze([
 {id:'sucursales',title:'Sucursales',icon:'pin',copy:'Conocé nuestros locales y elegí dónde seguir tu consulta.',action:'Encontrar una sucursal',pages:['sucursales','sucursal']},
 {id:'taller',title:'Taller oficial',icon:'settings',copy:'Mantenimiento y atención para tu moto, con el respaldo de Fussetti.',action:'Conocer el taller',pages:['taller']},
 {id:'services',title:'Services Oficiales',icon:'shield',copy:'Revisá los intervalos de referencia y qué confirmar para tu modelo.',action:'Ver los services',pages:['services']},
 {id:'mis-productos',title:'Posventa',icon:'heart',copy:'Tus productos, documentación y agenda de cuidado, en un solo lugar.',action:'Entrar a Mis productos',pages:['mis-productos','mi-producto','agregar-producto','mis-comprobantes','comprobante']}
]);
export function servicesTrigger(page,cls=''){
 const current=serviceEntries.some(a=>a.pages.includes(page));
 return `<button type="button" class="services-trigger ${cls}" data-services-open aria-haspopup="dialog" aria-controls="services-menu" aria-expanded="false" ${current?'data-current="true"':''}>${icon('pin',17)}<span>Sucursales y servicios</span></button>`;
}
export function servicesMenu(s,page){
 const branch=s.branches.find(b=>b.id===s.shopping.branch);
 return `<dialog id="services-menu" class="navigation-dialog services-dialog" aria-labelledby="services-title"><div class="navigation-dialog-head"><div><p class="eyebrow">FUSSETTI · CERCA ANTES Y DESPUÉS DE COMPRAR</p><h2 id="services-title" tabindex="-1">Sucursales y servicios</h2></div><button type="button" class="navigation-close" data-services-close aria-label="Cerrar sucursales y servicios">${icon('close',23)}</button></div><div class="services-content"><div class="services-intro"><p class="eyebrow">EL RESPALDO QUE SIGUE</p><h3>Estamos para lo que sigue.</h3><p>Un lugar cerca, atención para tu moto y todo lo que necesitás para cuidar tus productos.</p></div><nav class="services-grid" aria-label="Elegí cómo seguir con Fussetti">${serviceEntries.map(a=>`<a class="service-card ${a.pages.includes(page)?'is-current':''}" href="#${a.id}" ${page===a.id?'aria-current="page"':''}><span class="service-icon">${icon(a.icon,24)}</span><h3>${a.title}</h3><p>${a.copy}</p><span class="service-action">${a.action}${icon('arrow',18)}</span></a>`).join('')}</nav></div><div class="services-bottom">${branch?`<a class="services-branch" href="#sucursal/${encodeURIComponent(branch.id)}">${icon('pin',20)}<span><small>Tu sucursal seleccionada en la demo</small><b>${e(branch.title)}</b></span>${icon('arrow',18)}</a>`:'<p>Elegí una sucursal para explorar la atención de Fussetti.</p>'}<p class="services-demo">Atención, mantenimiento y consultas de esta experiencia son de demostración.</p></div></dialog>`;
}

// Reuses the native dialog and HorizonX Curtain Menu reveal from Categories.
export function bindServices(root){
 const dialog=root.querySelector('#services-menu');if(!dialog)return ()=>{};
 const abort=new AbortController(),triggers=[...root.querySelectorAll('[data-services-open]')],mobile=matchMedia('(max-width:800px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');let opener=null,opening=false,cancelScroll=null;
 const listen=(node,type,fn)=>node.addEventListener(type,fn,{signal:abort.signal});
 const expanded=value=>triggers.forEach(t=>t.setAttribute('aria-expanded',String(value)));
 function position(scroll=true){
  if(mobile.matches)return scrollY;
  const header=root.querySelector('.discovery-header');dialog.setAttribute('data-measuring','');const height=dialog.getBoundingClientRect().height;dialog.removeAttribute('data-measuring');let rect=header.getBoundingClientRect(),target=scrollY;
  if(rect.bottom+height+12>innerHeight){const top=Math.min(rect.height,Math.max(8,innerHeight-height-12));target=Math.max(0,scrollY+rect.bottom-top);if(scroll){window.scrollTo({top:target,behavior:'instant'});rect=header.getBoundingClientRect()}}
  dialog.style.setProperty('--navigation-top',Math.max(8,rect.bottom)/pageZoom()+'px');return target;
 }
 function scrollForMenu(target){
  const start=scrollY,distance=target-start;
  if(reduce.matches||Math.abs(distance)<1){window.scrollTo({top:target,behavior:'instant'});return Promise.resolve(true)}
  return new Promise(resolve=>{const began=performance.now();let frame;cancelScroll=()=>{cancelAnimationFrame(frame);cancelScroll=null;resolve(false)};const tick=now=>{const t=Math.min(1,(now-began)/420);window.scrollTo({top:start+distance*(1-Math.pow(1-t,3)),behavior:'instant'});if(t<1)frame=requestAnimationFrame(tick);else{cancelScroll=null;resolve(true)}};frame=requestAnimationFrame(tick)});
 }
 triggers.forEach(t=>listen(t,'click',async()=>{
  if(dialog.open||opening)return;opening=true;t.setAttribute('aria-busy','true');opener=t.closest('dialog')?root.querySelector('.main-nav [data-services-open]'):t;
  const categories=root.querySelector('#discovery-menu');if(categories?.open)categories.close();
  const ready=mobile.matches||await scrollForMenu(position(false));opening=false;t.removeAttribute('aria-busy');
  if(!ready||abort.signal.aborted)return;position();dialog.scrollTop=0;dialog.showModal();expanded(true);dialog.querySelector('#services-title').focus({preventScroll:true});
 }));
 listen(dialog.querySelector('[data-services-close]'),'click',()=>dialog.close());
 listen(dialog,'close',()=>{expanded(false);opener?.focus({preventScroll:true})});
 listen(dialog,'click',ev=>{if(ev.target.closest('a[href]'))dialog.close();else if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close()}});
 listen(window,'resize',()=>{if(dialog.open)position()});
 return ()=>{cancelScroll?.();opening=false;triggers.forEach(t=>t.removeAttribute('aria-busy'));abort.abort();if(dialog.open)dialog.close()};
}
