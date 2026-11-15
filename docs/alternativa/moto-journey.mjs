import {e,icon} from '../nueva/ui.mjs';
import {money,unitPrice} from './domain.mjs';
import {branchInfo} from './branch-model.mjs';
import {lendersView} from './moto-lenders.mjs?v=credit-options1';
import {partsCarouselView,bindPartsCarousel} from './moto-parts.mjs?v=deslizamiento1';
import {motoModels,partsModelOptions,journeySelection,journeyLinks} from './moto-journey-model.mjs';

const STORAGE='fussetti-alternativa-moto-journey-v1';
let memory={};
function selection(s){try{memory=JSON.parse(sessionStorage.getItem(STORAGE)||'{}')}catch{}return journeySelection(s,memory&&typeof memory==='object'?memory:{})}
function remember(value){memory=value;try{sessionStorage.setItem(STORAGE,JSON.stringify(value))}catch{}}
const arrow=()=>icon('arrow',17);
const link=(label,href,cls='')=>`<a class="button hx-action ${cls}" href="${e(href)}"><span class="ihb-fill" aria-hidden="true"></span><span class="ihb-rest">${label} ${arrow()}</span><span class="ihb-swap" aria-hidden="true">${label} ${arrow()}</span></a>`;
const modelOptions=(s,id)=>motoModels(s).map(p=>`<option value="${e(p.id)}" ${id===p.id?'selected':''}>${e(p.name)}</option>`).join('');
function partsView(s,selected){
 const options=partsModelOptions(s),chosen=options.find(p=>p.id===selected.partsModelId);
 const filters=`<div class="mj-parts-filter"><label for="mj-parts-model">¿Para qué moto buscás?<select id="mj-parts-model" data-journey-parts-model><option value="">Ver todos los repuestos</option>${options.map(p=>`<option value="${e(p.id)}" ${chosen?.id===p.id?'selected':''}>${e(p.name)}${p.reference?' · referencia de repuestos':''}</option>`).join('')}</select></label><p>${chosen?'Mostramos referencias por nombre o datos cargados. Una coincidencia no confirma compatibilidad.':'Elegí tu modelo para acotar la búsqueda. Los lubricantes y otras piezas siguen disponibles en el catálogo completo.'}</p></div>`;
 return partsCarouselView(s,{modelId:chosen?.id||'',filters,title:'Repuestos para tu moto.',intro:'02 / REPUESTOS Y MANTENIMIENTO'});
}
function financeSummary(s,selected){
 const c=journeyLinks(s,selected.modelId),p=c.bike;
 return `<div class="mj-finance-product">${p?`<img src="${e(p.image)}" alt="" loading="lazy"><div><b>${e(p.name)}</b><small>Precio de referencia demo</small><strong>${money(unitPrice(s,p))}</strong><span>${p.stock?'Reserva simulada, sin cobro':'Sin stock en el escenario demo'}</span></div>`:'<p>Consultá los modelos disponibles en una sucursal.</p>'}</div><p class="mj-local">${icon('pin',17)} ${e(c.selectedBranch?.title||'Elegí una sucursal más abajo')}</p><div class="mj-actions"><button type="button" class="button" data-open-credit data-credit-model="${e(p?.id||'')}">Consultar financiación ${arrow()}</button><a data-journey-href="consult" href="${e(c.consult)}">Preparar consulta demo ${arrow()}</a></div><p class="mj-note">La demo no evalúa crédito. Cuotas, tasa, costo total, requisitos y aprobación se confirman con la sucursal antes de decidir.</p>`;
}
function branchCard(s,selected){
 const c=journeyLinks(s,selected.modelId),b=c.selectedBranch;
 if(!b)return '<p>Las sucursales todavía no están cargadas en este escenario.</p>';
 const info=branchInfo(b);
 return `<figure><img src="${e(b.image||'https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/c56cc8b4ea0496e6.png')}" alt="${e(b.title)}" loading="lazy"></figure><div class="mj-branch-info"><span class="mj-tag">SUCURSAL ELEGIDA EN LA DEMO</span><h3>${e(b.title)}</h3><p>${icon('pin',18)} ${e(info.address||'Dirección pendiente de confirmar')}</p><p>${icon('clock',18)} ${e(info.hours||'Consultá los horarios con la sucursal.')}</p><p class="mj-context">Tu consulta conserva ${c.bike?`<b>${e(c.bike.name)}</b>`:'el modelo que elijas'} y este local.</p><div class="mj-actions">${link('Preparar consulta demo',c.consult)}<a href="${e(c.branch)}">Ver datos del local ${arrow()}</a></div><small>Consulta simulada. No envía mensajes ni confirma una visita.</small></div>`;
}
export function motoJourneyView(s){
 const selected=selection(s),c=journeyLinks(s,selected.modelId);
 return `<div class="moto-journey" data-moto-journey>
 <section class="container mj-finance" id="motos-financiacion" aria-labelledby="mj-finance-title"><div class="mj-finance-copy"><p class="eyebrow">01 / FINANCIACIÓN</p><h2 id="mj-finance-title">Tu próxima moto.<br><em>Una decisión clara.</em></h2><p>Encontrá el modelo que te gusta y entendé cómo seguir para comprarlo.</p><ol class="mj-steps"><li><b>1</b><div><h3>Elegí tu moto</h3><p>Dejá seleccionado el modelo para tu consulta.</p></div></li><li><b>2</b><div><h3>Revisá las alternativas</h3><p>Conocé las opciones publicadas y qué falta confirmar.</p></div></li><li><b>3</b><div><h3>Confirmá con tu sucursal</h3><p>Pedí condiciones completas antes de tomar una decisión.</p></div></li></ol></div><div class="mj-finance-panel"><label for="mj-finance-model">Modelo para tu consulta<select id="mj-finance-model" data-journey-model ${motoModels(s).length?'':'disabled'}>${modelOptions(s,selected.modelId)}</select></label><div data-journey-finance>${financeSummary(s,selected)}</div></div></section>
 ${lendersView()}
 <div data-journey-parts>${partsView(s,selected)}</div>
 <section class="container mj-care" id="motos-cuidados" aria-labelledby="mj-care-title"><div class="mj-heading"><div><p class="eyebrow">03 / TALLER Y SERVICES OFICIALES</p><h2 id="mj-care-title">El respaldo sigue<br>después de elegir.</h2></div><p>Un lugar para consultar, mantener tu moto y entender qué cuidado necesita.</p></div><div class="mj-care-grid"><article class="mj-workshop"><img src="https://fussetti-replica-20261102.germanvives15.chatgpt.site/motos/assets/c56cc8b4ea0496e6.png" alt="Técnico trabajando en el taller Fussetti" loading="lazy"><div><span class="mj-tag">ATENCIÓN PARA TU MOTO</span><h3>Taller oficial</h3><p>Mantenimiento, diagnóstico y repuestos. Conocé el taller y prepará una consulta con tu modelo.</p><a data-journey-href="workshop" href="${e(c.workshop)}">Conocer el taller ${arrow()}</a></div></article><article class="mj-services"><span class="mj-care-icon">${icon('settings',32)}</span><span class="mj-tag">CADA MOTO TIENE SU CUIDADO</span><h3>Services Oficiales</h3><p>Revisá el cronograma de referencia y confirmá el mantenimiento indicado para tu modelo, año y versión.</p><a data-journey-href="services" href="${e(c.services)}">Ver Services Oficiales ${arrow()}</a><div class="mj-care-next"><p>¿Ya sabés qué necesitás?</p><a data-journey-href="maintenance" href="${e(c.maintenance)}">Preparar consulta de mantenimiento ${arrow()}</a><small>La demo no agenda turnos reales.</small></div></article></div></section>
 <section class="container mj-branches" id="motos-sucursales" aria-labelledby="mj-branches-title"><div class="mj-heading"><div><p class="eyebrow">04 / SUCURSALES Y ASESORAMIENTO</p><h2 id="mj-branches-title">Una moto en pantalla.<br>Un local para seguir.</h2></div><a data-journey-href="branches" href="${e(c.branches)}">Ver todas las sucursales ${arrow()}</a></div><div class="mj-branch-select"><label for="mj-branch">Sucursal para tu consulta<select id="mj-branch" data-journey-branch ${s.branches.length?'':'disabled'}>${s.branches.map(b=>`<option value="${e(b.id)}" ${b.id===s.shopping.branch?'selected':''}>${e(b.title)}</option>`).join('')}</select></label><p>Elegí el local con el que querés continuar. Esta selección también se usa en el recorrido de compra demo.</p></div><div class="mj-branch-card" data-journey-branch-card>${branchCard(s,selected)}</div></section></div>`;
}
export function bindMotoJourney(root,s,{enhanceParts=()=>{},onBranch=()=>{},onFinance=()=>{}}={}){
 const journey=root.querySelector('[data-moto-journey]');if(!journey)return ()=>{};
 let selected=selection(s),disposeParts=bindPartsCarousel(journey.querySelector('[data-journey-parts]'));
 function updateContext(){
  const c=journeyLinks(s,selected.modelId);
  journey.querySelector('[data-journey-finance]').innerHTML=financeSummary(s,selected);
  journey.querySelector('[data-journey-branch-card]').innerHTML=branchCard(s,selected);
  journey.querySelectorAll('[data-journey-href]').forEach(a=>a.href=c[a.dataset.journeyHref]);
  onFinance();
 }
 function change(ev){
  const target=ev.target;
  if(target.matches('[data-journey-model]')){selected.modelId=target.value;remember(selected);updateContext()}
  if(target.matches('[data-journey-branch]')){onBranch(target.value);updateContext()}
  if(target.matches('[data-journey-parts-model]')){
   selected.partsModelId=target.value;remember(selected);disposeParts();
   const mount=journey.querySelector('[data-journey-parts]');mount.innerHTML=partsView(s,selected);
   disposeParts=bindPartsCarousel(mount);mount.querySelector('#moto-parts-track')?.scrollTo({left:0,behavior:'instant'});enhanceParts(mount);
   mount.querySelector('[data-journey-parts-model]')?.focus({preventScroll:true});
  }
 }
 journey.addEventListener('change',change);
 return ()=>{journey.removeEventListener('change',change);disposeParts()};
}
