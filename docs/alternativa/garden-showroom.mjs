import {collectionProducts,collectionHref} from './hogar-model.mjs';
import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {homePurchaseSupport} from './hogar-purchase-support.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs?v=deslizamiento1';
import {focusPose} from './moto-focus.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Unmodified individual gallery photographs; framing is an SVG viewport only.
export const gardenFrames={
 '3632':{name:'Kushiro 1600W',category:'CORTADORA DE CÉSPED',box:[90,35,620,725],size:[800,800]},
 '3533':{name:'Petri New 800W',category:'BORDEADORA',box:[230,0,365,800],size:[800,800]},
 '3624':{name:'B&D BEHTS401',category:'CORTACERCO',box:[135,330,535,130],size:[800,800]},
 '3166':{name:'Petri CG520H',category:'DESMALEZADORA · 52 CC',box:[60,240,625,375],size:[800,800]},
 '3529':{name:'Petri Americano',category:'CORTADORA DE CÉSPED · 4,5 HP',box:[15,40,775,720],size:[800,800]},
 '3352':{name:'Petri Max 1HP',category:'CORTADORA DE CÉSPED',box:[5,60,790,680],size:[800,800]},
 '3177':{name:'Petri Max 1HP',category:'CORTADORA DE CÉSPED',box:[10,90,735,580],size:[800,800]},
 '2766':{name:'Wimer W901',category:'BORDEADORA · 900W',box:[100,0,590,790],size:[800,800]}
};
export const gardenShowroomUi={id:''};
const gardenOrder=['3632','3533','3624','3166','3529','3352','3177','2766'];
export function gardenRecords(s,rows){
 const garden=collectionProducts(rows,'jardin');
 return gardenOrder.flatMap(id=>{
  const row=garden.find(r=>r.id_oficial===id);if(!row)return [];
  const stored=product(s,'official-'+id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id}};
  return [{...gardenFrames[id],id,row,p,price:unitPrice(s,p),photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/jardin/'+id+'.jpg'}];
 });
}
const image=r=>`<svg class="gf-product-image" viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false"><image href="${r.photo}" width="${r.size[0]}" height="${r.size[1]}"/></svg>`;
export function gardenShowroom(s,rows){
 const records=gardenRecords(s,rows),index=Math.max(0,records.findIndex(r=>r.id===gardenShowroomUi.id)),total=collectionProducts(rows,'jardin').length;
 const heading=`<div class="container gf-heading"><div><p class="eyebrow">HOGAR FUSSETTI · JARDÍN</p><h2 id="garden-title">Tu jardín, en primer plano.</h2></div><a href="${collectionHref('jardin')}">Ver los ${total} productos de jardín ${icon('arrow',16)}</a></div>`;
 if(!records.length)return `<section class="garden-showroom gf-empty" id="hogar-jardin" aria-labelledby="garden-title">${heading}<p class="container">Los productos de jardín no tienen stock en este escenario. Podés consultar sus fichas en el catálogo.</p></section>`;
 return `<section class="garden-showroom" id="hogar-jardin" data-garden-showroom aria-labelledby="garden-title">${heading}<div class="gf-stage" data-garden-stage role="group" aria-roledescription="carrusel" aria-label="Productos de jardín. Usá las flechas, Inicio o Fin para elegir." tabindex="0">${records.map((r,i)=>`<button type="button" class="gf-product" data-garden-item="${i}" data-garden-id="${r.id}" aria-label="Ver ${e(r.name)}, referencia ${e(r.row.referencia||r.id)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}><span class="gf-shadow" aria-hidden="true"></span>${image(r)}<span class="gf-caption" aria-hidden="true">${e(r.name)} ${icon('arrow',12)}</span></button>`).join('')}<div class="gf-arrows"><button type="button" data-garden-prev aria-label="Producto de jardín anterior">${icon('arrow',20)}</button><button type="button" data-garden-next aria-label="Producto de jardín siguiente">${icon('arrow',20)}</button></div></div><div class="container gf-details">${records.map((r,i)=>`<article class="gf-summary" data-garden-panel="${i}" ${i===index?'':'hidden inert'}><div class="gf-identity"><p class="gf-kicker">${e(r.row.marca)} / ${e(r.category)}</p><h3>${e(r.name)}</h3><p class="gf-full-name">${e(r.row.nombre)}<span>Ref. ${e(r.row.referencia||r.id)}</span></p></div><div class="gf-price"><small>PRECIO PUBLICADO</small><strong>${e(r.p.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price))}</strong><p>${e(r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.')}</p><span><i aria-hidden="true"></i>Disponible en demo · entrega simulada</span></div><div class="gf-actions"><div><a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a>${buyButton(s,r.p,true)}</div><button type="button" class="gf-quick" data-quick="${r.p.id}" aria-label="Vista rápida de ${e(r.row.nombre)}">Vista rápida ${icon('arrow',14)}</button>${homePurchaseSupport(s,r.p,{compact:true})}</div></article>`).join('')}</div><div class="container gf-selector" aria-label="Elegir producto de jardín">${records.map((r,i)=>`<button type="button" data-garden-select="${i}" aria-label="Seleccionar ${e(r.name)}, referencia ${e(r.row.referencia||r.id)}" aria-pressed="${i===index}"><small>${String(i+1).padStart(2,'0')}</small><span class="gf-thumb">${image(r)}</span><span>${e(r.name)}<em>Ref. ${e(r.row.referencia||r.id)}</em></span></button>`).join('')}</div><p class="container gf-source">Fotos, precios y cuotas del catálogo oficial relevado al 4/11/2026 · Stock, entrega y compra demo</p><p class="sr-only" data-garden-status role="status"></p></section>`;
}
export const gardenPose=(offset,width)=>focusPose(offset,width);
export const bindGardenShowroom=host=>bindHomeShowroom(host,{prefix:'garden',ui:gardenShowroomUi,pose:gardenPose,heading:'h3',scrollSelector:true,pauseSummaryHover:true});
