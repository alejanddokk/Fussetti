import {collectionProducts,collectionHref} from './hogar-model.mjs';
import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {homePurchaseSupport} from './hogar-purchase-support.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs?v=vitrina1';
import {focusPose} from './moto-focus.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Unmodified individual gallery photographs; framing is an SVG viewport only.
export const furnitureFrames={
 '3627':{name:'Sillón Piero',category:'SILLÓN',box:[35,205,690,420],size:[800,800]},
 '3444':{name:'Rack Domus',category:'RACK',box:[0,0,800,800],size:[800,800]},
 '3393':{name:'Mesa Carl',category:'MESA',box:[0,0,800,800],size:[800,800]},
 '3146':{name:'Silla Jackson',category:'SILLA',box:[0,0,800,800],size:[800,800]}
};
export const furnitureShowroomUi={id:''};
const furnitureOrder=['3627','3444','3393','3146'];
export function furnitureRecords(s,rows){
 const furniture=collectionProducts(rows,'muebles');
 return furnitureOrder.flatMap(id=>{
  const row=furniture.find(r=>r.id_oficial===id);if(!row)return [];
  const stored=product(s,'official-'+id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id}};
  return [{...furnitureFrames[id],id,row,p,price:unitPrice(s,p),photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/'+id+'.jpg'}];
 });
}
const image=r=>`<svg class="gf-product-image" viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false"><image href="${r.photo}" width="${r.size[0]}" height="${r.size[1]}"/></svg>`;
export function furnitureShowroom(s,rows){
 const records=furnitureRecords(s,rows),index=Math.max(0,records.findIndex(r=>r.id===furnitureShowroomUi.id)),total=collectionProducts(rows,'muebles').length;
 const heading=`<div class="container gf-heading"><div><p class="eyebrow">HOGAR FUSSETTI · MUEBLES</p><h2 id="furniture-title">Muebles para vivir tu espacio.</h2></div><a href="${collectionHref('muebles')}">Ver los ${total} muebles ${icon('arrow',16)}</a></div>`;
 if(!records.length)return `<section class="garden-showroom furniture-showroom gf-empty" id="hogar-muebles" aria-labelledby="furniture-title">${heading}<p class="container">Los muebles destacados no tienen stock en este escenario. Podés consultar sus fichas en el catálogo.</p></section>`;
 return `<section class="garden-showroom furniture-showroom" id="hogar-muebles" data-furniture-showroom aria-labelledby="furniture-title">${heading}<div class="gf-stage" data-furniture-stage role="group" aria-roledescription="carrusel" aria-label="Muebles. Usá las flechas, Inicio o Fin para elegir." tabindex="0">${records.map((r,i)=>`<button type="button" class="gf-product" data-furniture-item="${i}" data-furniture-id="${r.id}" aria-label="Ver ${e(r.name)}, referencia ${e(r.row.referencia||r.id)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}><span class="gf-shadow" aria-hidden="true"></span>${image(r)}<span class="gf-caption" aria-hidden="true">${e(r.name)} ${icon('arrow',12)}</span></button>`).join('')}<div class="gf-arrows"><button type="button" data-furniture-prev aria-label="Mueble anterior">${icon('arrow',20)}</button><button type="button" data-furniture-next aria-label="Mueble siguiente">${icon('arrow',20)}</button></div></div><div class="container gf-details">${records.map((r,i)=>`<article class="gf-summary" data-furniture-panel="${i}" ${i===index?'':'hidden inert'}><div class="gf-identity"><p class="gf-kicker">${e(r.row.marca)} / ${e(r.category)}</p><h3>${e(r.name)}</h3><p class="gf-full-name">${e(r.row.nombre)}<span>Ref. ${e(r.row.referencia||r.id)}</span></p></div><div class="gf-price"><small>PRECIO PUBLICADO</small><strong>${e(r.p.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price))}</strong><p>${e(r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.')}</p><span><i aria-hidden="true"></i>Disponible en demo · entrega simulada</span></div><div class="gf-actions"><div><a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a>${buyButton(s,r.p,true)}</div><button type="button" class="gf-quick" data-quick="${r.p.id}" aria-label="Vista rápida de ${e(r.row.nombre)}">Vista rápida ${icon('arrow',14)}</button>${homePurchaseSupport(s,r.p,{compact:true})}</div></article>`).join('')}</div><div class="container gf-selector" aria-label="Elegir mueble">${records.map((r,i)=>`<button type="button" data-furniture-select="${i}" aria-label="Seleccionar ${e(r.name)}, referencia ${e(r.row.referencia||r.id)}" aria-pressed="${i===index}"><small>${String(i+1).padStart(2,'0')}</small><span class="gf-thumb">${image(r)}</span><span>${e(r.name)}<em>Ref. ${e(r.row.referencia||r.id)}</em></span></button>`).join('')}</div><p class="container gf-source">Fotos, precios y cuotas del catálogo oficial relevado al 4/11/2026 · Stock, entrega y compra demo</p><p class="sr-only" data-furniture-status role="status"></p></section>`;
}
export const furniturePose=(offset,width)=>focusPose(offset,width);
export const bindFurnitureShowroom=host=>bindHomeShowroom(host,{prefix:'furniture',ui:furnitureShowroomUi,pose:furniturePose,heading:'h3',scrollSelector:true});
