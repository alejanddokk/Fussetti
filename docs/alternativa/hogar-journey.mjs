import {bestGroups,bestRecords} from './hogar-mas-vendidos.mjs';
import {homeChoiceGroups,homeChoiceFacts} from './hogar-choice-data.mjs';
import {product,unitPrice,profile} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {collectionProducts,collectionHref} from './hogar-model.mjs';
export {homeChoiceGroups,homeChoiceFacts} from './hogar-choice-data.mjs';
import {buyButton} from './product-views.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {homePurchaseSupport} from './hogar-purchase-support.mjs';
import {e,icon} from '../nueva/ui.mjs';

export const homeJourneyUi={group:'spaces'};
const researchedIds=new Set(['114','3672','3476','2868','2591','2587','2235','763']);
const recordsFor=(s,rows,key)=>bestRecords(s,rows,bestGroups.find(g=>g.key===key));
export function homeChoiceRecords(s,rows,key){
 const group=homeChoiceGroups.find(g=>g.key===key);if(!group)return [];
 return group.items.flatMap(item=>{
  const row=rows.find(r=>r.id_oficial===item.id);if(!row)return [];
  const stored=product(s,'official-'+item.id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+item.id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id:item.id}};
  return [{...item,row,p,price:unitPrice(s,p),photo:item.photo||'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-seleccion/'+item.id+'.jpg',box:item.box||[0,0,800,800],researched:researchedIds.has(item.id)}];
 });
}
export const homeOpportunityRecord=(s,rows)=>recordsFor(s,rows,'pools').find(r=>r.id==='3');
const price=r=>r.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price);
const installments=r=>r.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.';
const picture=r=>`<svg viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="${r.photo}" width="800" height="800"/></svg>`;
const quick=r=>`<button type="button" class="hj-quick" data-quick="${r.p.id}" aria-label="Vista rápida de ${e(r.row.nombre)}">Vista rápida ${icon('arrow',15)}</button>`;

export function homeOpportunity(s,rows){
 const r=homeOpportunityRecord(s,rows);
 if(!r)return `<section class="container hj-opportunity hj-empty" data-home-opportunity><p class="eyebrow">UN PLAN PARA EL AIRE LIBRE</p><h2>Encontrá tu próximo plan para el patio.</h2><p>La pileta destacada no tiene stock en este escenario. Explorá el catálogo para ver otras opciones.</p><a class="button" href="#catalogo?cat=Hogar&amp;lista=1&amp;coleccion=patio">Explorar aire libre ${icon('arrow',16)}</a></section>`;
 return `<section class="container hj-opportunity" data-home-opportunity aria-labelledby="home-opportunity-title"><div class="hj-opportunity-layout"><div class="hj-opportunity-copy"><p class="eyebrow">UN PLAN PARA EL AIRE LIBRE</p><h2 id="home-opportunity-title">Tu próximo plan<br>empieza en el patio.</h2><p class="hj-story">Hacé lugar para disfrutar el verano en casa.</p><a class="hj-name" href="#producto-oficial/${r.id}">${e(r.row.nombre)}</a><div class="hj-facts"><span>1.000 litros</span><span>1,85 × 1,45 × 0,40 m</span></div><div class="hj-price"><small>PRECIO PUBLICADO</small><strong>${e(price(r))}</strong><span>${e(installments(r))}</span></div><div class="hj-opportunity-actions">${buyButton(s,r.p,true)}<a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a>${quick(r)}</div><p class="hj-check">${icon('settings',15)}Revisá las medidas del lugar antes de elegir. Accesorios vendidos por separado.</p></div><a class="hj-opportunity-image" href="#producto-oficial/${r.id}" aria-label="Conocer ${e(r.row.nombre)}"><span class="hj-image-caption">PELOPINCHO 1020 · 1.000 L</span>${picture(r)}<span class="hj-photo-note">Foto del catálogo oficial</span></a></div>${homePurchaseSupport(s,r.p)}</section>`;
}

export function homeChoiceCard(s,r){
 const facts=homeChoiceFacts[r.id],saved=profile(s).favorites.includes(r.p.id),brand=r.id==='3607'?'Marca a confirmar':r.row.marca||'HOGAR FUSSETTI';
 return `<article class="hj-choice-card" data-home-choice="${r.id}"><div class="hj-choice-media"><a class="hj-choice-photo" href="#producto-oficial/${r.id}" aria-label="Conocer ${e(r.row.nombre)}">${picture(r)}</a><span class="hj-editorial-label">${r.researched?'Del listado de más vendidos':'Selección para tu hogar'}</span><button type="button" class="hj-save ${saved?'is-saved':''}" data-favorite="${r.p.id}" aria-pressed="${saved}" aria-label="${saved?'Quitar de favoritos':'Guardar'} ${e(r.row.nombre)}">${icon('heart',18)}</button></div><div class="hj-choice-body"><small>${e(brand)}</small><a href="#producto-oficial/${r.id}"><h4>${e(r.name)}</h4></a><p class="hj-choice-name">${e(r.row.nombre)}</p><p class="hj-reason">${e(facts.reason)}</p><ul class="hj-facts">${facts.facts.map(f=>`<li>${e(f)}</li>`).join('')}</ul><p class="hj-confirm"><b>Antes de elegir</b>${e(facts.check)}</p><div class="hj-price"><small>PRECIO PUBLICADO</small><strong>${e(price(r))}</strong><span>${e(installments(r))}</span></div><div class="hj-card-actions">${buyButton(s,r.p,true)}${quick(r)}</div><a class="hj-full-detail" href="#producto-oficial/${r.id}">Ver ficha completa ${icon('arrow',14)}</a>${homePurchaseSupport(s,r.p,{compact:true})}</div></article>`;
}

export function homeChoices(s,rows){
 const groups=homeChoiceGroups.map(g=>({...g,records:homeChoiceRecords(s,rows,g.key),total:collectionProducts(rows,g.href).length})),available=groups.filter(g=>g.records.length),active=available.some(g=>g.key===homeJourneyUi.group)?homeJourneyUi.group:available[0]?.key||groups[0].key,total=groups.reduce((n,g)=>n+g.records.length,0);
 return `<section class="container hj-choices" data-home-choices aria-labelledby="home-choices-title"><div class="hj-choice-heading"><div><p class="eyebrow">UNA SELECCIÓN PARA ELEGIR CON CLARIDAD</p><h2 id="home-choices-title">Encontrá lo que te resuelve.</h2><p class="hj-choices-description">Elegí una categoría. Descubrí qué resuelve cada opción, qué cambia entre ellas y qué conviene revisar antes de comprar.</p></div><a href="#guia?cat=Hogar">Ayudame a elegir ${icon('arrow',16)}</a></div><div class="hj-selection-overview"><span>${groups.length} categorías para descubrir</span><span>${total} productos seleccionados</span><span>Precios y detalles oficiales</span></div><div class="hj-tabs" role="tablist" aria-label="Selección por categoría">${groups.map(g=>`<button type="button" role="tab" id="home-tab-${g.key}" aria-controls="home-picks-${g.key}" aria-selected="${g.key===active}" tabindex="${g.key===active?'0':'-1'}" data-home-choice-tab="${g.key}"><span>${g.label}</span><small aria-hidden="true">${g.records.length} ${g.records.length===1?'opción':'opciones'}</small></button>`).join('')}</div>${groups.map(g=>`<div role="tabpanel" id="home-picks-${g.key}" aria-labelledby="home-tab-${g.key}" tabindex="0" data-home-choice-panel="${g.key}" ${g.key===active?'':'hidden inert'}><div class="hj-group-intro"><div><h3>${g.title}</h3><p>${g.copy}</p></div><a href="${e(collectionHref(g.href))}">Ver los ${g.total} productos ${icon('arrow',15)}</a></div><div class="hj-category-guide"><p>${icon('settings',18)}Para elegir en esta categoría</p><ol>${g.tips.map((tip,i)=>`<li><span aria-hidden="true">0${i+1}</span>${e(tip)}</li>`).join('')}</ol></div>${g.records.length?`<div class="hj-choice-grid">${g.records.map(r=>homeChoiceCard(s,r)).join('')}</div>`:'<p class="hj-empty" role="status">Estos productos no tienen stock en este escenario. Podés explorar el catálogo completo de la categoría.</p>'}<div class="hj-category-footer"><div><strong>Tu elección puede empezar por acá.</strong><p>Explorá todas las opciones o usá la guía para ordenar lo que necesitás.</p></div><a class="button outline" href="${e(collectionHref(g.href))}">Explorar ${e(g.label.toLowerCase())} ${icon('arrow',15)}</a></div></div>`).join('')}<p class="hj-selection-note">Selección editorial con productos del catálogo oficial relevado al 4/11/2026. La etiqueta “Del listado de más vendidos” identifica únicamente los productos del orden de ventas investigado; el sitio no informa período ni unidades. Variantes, disponibilidad y condiciones a confirmar en cada ficha. Stock, pago y entrega demo.</p></section>`;
}

export function bindHomeChoices(host){
 const root=host.querySelector('[data-home-choices]');if(!root)return ()=>{};
 const tabs=[...root.querySelectorAll('[data-home-choice-tab]')],panels=[...root.querySelectorAll('[data-home-choice-panel]')],abort=new AbortController();
 function select(tab,focus=false){homeJourneyUi.group=tab.dataset.homeChoiceTab;tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1});panels.forEach(p=>{const hidden=p.dataset.homeChoicePanel!==homeJourneyUi.group;p.hidden=hidden;p.inert=hidden});if(focus)tab.focus({preventScroll:true})}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab),{signal:abort.signal});tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||event.altKey||event.metaKey||event.ctrlKey)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[next],true)},{signal:abort.signal})});
 return ()=>abort.abort();
}
