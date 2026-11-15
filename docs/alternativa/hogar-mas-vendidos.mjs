import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs?v=deslizamiento1';
import {gardenPose} from './garden-showroom.mjs';
import {collectionHref} from './hogar-model.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Snapshot of the first nine products in the official category's sales order,
// observed on 4 November 2026. The ordering within each group is editorial.
export const bestGroups=[
 {key:'pools',title:'Piletas y aire libre.',label:'PILETAS',href:collectionHref('patio'),hrefText:'Ver patio y aire libre',note:'Productos vendidos por separado. Confirmá medidas y compatibilidad antes de elegir accesorios.',items:[
  {id:'3',name:'Pelopincho 1020',kind:'PILETA · 1.000 L',box:[25,230,750,390]},
  {id:'114',name:'Cubre pileta 1043',kind:'CUBIERTA Y BASE',box:[65,50,660,700]},
  {id:'763',name:'Bomba filtrante',kind:'ACCESORIOS PARA PILETA',box:[175,0,450,800]}]},
 {key:'spaces',title:'Muebles y organización.',label:'ESPACIOS',href:collectionHref('muebles'),hrefText:'Ver muebles y espacios',note:'Elegí el tamaño, color y las medidas que van con tu espacio.',items:[
  {id:'3672',name:'Silla Voss Fiesta',kind:'SILLA',box:[130,5,550,775]},
  {id:'2591',name:'Despensero Arco',kind:'MUEBLE MULTIUSO',box:[280,0,250,800]},
  {id:'2868',name:'Canasto con tapa',kind:'ORGANIZACIÓN · 3,5 L',box:[15,75,770,650]}]},
 {key:'daily',title:'Cocina y momentos.',label:'BAZAR',href:'#catalogo?cat=Hogar&lista=1',hrefText:'Ver todo Hogar',note:'Revisá las variantes y características publicadas en cada ficha.',items:[
  {id:'2587',name:'Pava Multiflon',kind:'COCINA · 18 CM',box:[130,130,540,550]},
  {id:'2235',name:'Termo Esbit',kind:'TERMO · 1 L',box:[255,80,270,640]}]},
 {key:'tools',title:'Herramientas para tus proyectos.',label:'HERRAMIENTAS',href:collectionHref('herramientas'),hrefText:'Ver herramientas y jardín',note:'Consultá las especificaciones y disponibilidad en la ficha.',items:[
  {id:'3476',name:'Generador Miyawa',kind:'GENERADOR · 2.800 W',box:[35,75,730,635]}]}
];
export const bestUi=Object.fromEntries(bestGroups.map(g=>[g.key,{id:''}]));
export function bestRecords(s,rows,group){
 return group.items.flatMap(item=>{
  const row=rows.find(r=>r.id_oficial===item.id);if(!row)return [];
  const stored=product(s,'official-'+item.id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+item.id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id:item.id}};
  return [{...item,row,p,price:unitPrice(s,p),photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-mas-vendidos/'+item.id+'.jpg'}];
 });
}
const picture=r=>`<svg class="gf-product-image" viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false"><image href="${r.photo}" width="800" height="800"/></svg>`;
export function bestGroupView(s,rows,group){
 const records=bestRecords(s,rows,group),index=Math.max(0,records.findIndex(r=>r.id===bestUi[group.key].id)),k=group.key;
 const heading=`<div class="container gf-heading"><div><p class="eyebrow">MÁS VENDIDOS · ${e(group.label)}</p><h2 id="${k}-title">${e(group.title)}</h2></div><a href="${e(group.href)}">${e(group.hrefText)} ${icon('arrow',16)}</a></div>`;
 if(!records.length)return `<section class="garden-showroom gf-empty best-showroom" aria-labelledby="${k}-title">${heading}<p class="container">Estos productos no tienen stock en este escenario. Podés consultar el catálogo completo.</p></section>`;
 return `<section class="garden-showroom best-showroom" data-${k}-showroom aria-labelledby="${k}-title">${heading}<div class="gf-stage" data-${k}-stage role="group" aria-roledescription="${records.length>1?'carrusel':'producto destacado'}" aria-label="${e(group.title)} ${records.length>1?'Usá las flechas, Inicio o Fin para elegir.':'Producto destacado.'}" tabindex="0">${records.map((r,i)=>`<button type="button" class="gf-product" data-${k}-item="${i}" data-${k}-id="${r.id}" aria-label="Ver ${e(r.name)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}><span class="gf-shadow" aria-hidden="true"></span>${picture(r)}<span class="gf-caption" aria-hidden="true">${e(r.name)} ${icon('arrow',12)}</span></button>`).join('')}${records.length>1?`<div class="gf-arrows"><button type="button" data-${k}-prev aria-label="Anterior: ${e(group.label.toLowerCase())}">${icon('arrow',20)}</button><button type="button" data-${k}-next aria-label="Siguiente: ${e(group.label.toLowerCase())}">${icon('arrow',20)}</button></div>`:''}</div><div class="container gf-details">${records.map((r,i)=>`<article class="gf-summary" data-${k}-panel="${i}" ${i===index?'':'hidden inert'}><div class="gf-identity"><p class="gf-kicker">${e(r.row.marca||'FUSSETTI')} / ${e(r.kind)}</p><h3>${e(r.name)}</h3><p class="gf-full-name">${e(r.row.nombre)}<span>Ref. ${e(r.row.referencia||r.id)}</span></p>${k==='pools'?'<small class="best-pool-reminder">Productos por separado · verificá modelo y medidas.</small>':''}</div><div class="gf-price"><small>PRECIO PUBLICADO</small><strong>${e(r.p.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price))}</strong><p>${e(r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.')}</p><span><i aria-hidden="true"></i>Disponible en demo · entrega simulada</span></div><div class="gf-actions"><div><a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a>${buyButton(s,r.p,true)}</div><button type="button" class="gf-quick" data-quick="${r.p.id}" aria-label="Vista rápida de ${e(r.row.nombre)}">Vista rápida ${icon('arrow',14)}</button></div></article>`).join('')}</div>${records.length>1?`<div class="container gf-selector" aria-label="Elegir ${e(group.label.toLowerCase())}">${records.map((r,i)=>`<button type="button" data-${k}-select="${i}" aria-label="Seleccionar ${e(r.name)}" aria-pressed="${i===index}"><small>${String(i+1).padStart(2,'0')}</small><span class="gf-thumb">${picture(r)}</span><span>${e(r.name)}<em>Ref. ${e(r.row.referencia||r.id)}</em></span></button>`).join('')}</div>`:''}<p class="container gf-source">${e(group.note)} · Stock, entrega y compra demo.</p><p class="sr-only" data-${k}-status role="status"></p></section>`;
}
export function bestShowrooms(s,rows){return `<div class="container best-intro"><p class="eyebrow">UNA SELECCIÓN DE FUSSETTI</p><h2>Los más elegidos para tu hogar.</h2><p>Selección basada en el orden de ventas publicado por Fussetti al 4/11/2026. El listado puede cambiar y no informa período ni unidades.</p></div>${bestGroups.map(g=>bestGroupView(s,rows,g)).join('')}`}
export function bestPose(offset,width){const p=gardenPose(offset,width);if(width<700){p.x=offset*Math.max(155,width*.46);if(Math.abs(offset)>.25)p.opacity*=.72}return p}
export function bindBestShowrooms(host){const disposers=bestGroups.map(g=>bindHomeShowroom(host,{prefix:g.key,ui:bestUi[g.key],pose:bestPose,heading:'h3',scrollSelector:true,pauseSummaryHover:true}));return ()=>disposers.forEach(fn=>fn())}
