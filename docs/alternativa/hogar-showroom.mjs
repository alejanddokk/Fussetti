import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Source facts and unmodified gallery photos were retained for the combinations.
export const homeFeatured=[
 {id:'3627',name:'Sillón Piero',family:'LIVING',copy:'Tu lugar para bajar un cambio.',facts:['2 cuerpos','Retráctil'],combo:'living',extra:'Sumá el rack Domus y completá tu living.',box:[35,205,690,420]},
 {id:'3393',name:'Mesa Carl',family:'COMEDOR',copy:'Hacé lugar para los próximos encuentros.',facts:['Color blanco','Para comedor'],combo:'comedor',extra:'Combinála con las sillas Jackson.',box:[12,160,776,500]},
 {id:'3430',name:'Acolchado Queen',family:'DESCANSO',copy:'Dale otro aire a tu momento de descansar.',facts:['Tamaño Queen','Modelo Acuarela'],combo:'descanso',extra:'Elegí también las sábanas Queen Fieldcrest.',box:[130,65,540,610]},
 {id:'3607',name:'Termo Outdoors',family:'MOMENTOS',copy:'Una pausa que va con vos.',facts:['Capacidad de 1 L','Mate System'],combo:'mate',extra:'Sumá un mate Mug para acompañar tu pausa.',box:[130,0,500,780]}
];
export const homeShowroomUi={id:''};
export function homeShowroomRecords(s,rows){
 return homeFeatured.flatMap(item=>{
  const row=rows.find(r=>r.id_oficial===item.id);if(!row)return [];
  const stored=product(s,'official-'+item.id),stock=stored?.stock??initialOfficialStock(row);if(stock<1)return [];
  const p=stored||{id:'official-'+item.id,name:row.nombre,source:'fussetti-official',type:classifyOfficial(row),kind:'product',price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id:item.id}};
  return [{...item,p,row,price:unitPrice(s,p),photo:'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/hogar-combos/'+item.id+'.jpg'}];
 });
}
export const homeRecordIndex=(records,id=homeShowroomUi.id)=>Math.max(0,records.findIndex(x=>x.id===id));
const detail=r=>'#producto-oficial/'+r.id;
const guide=r=>'#guia?tipo='+encodeURIComponent(r.p.type);
function homeImage(r){return `<svg class="hs-product-image" viewBox="${r.box.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href="${r.photo}" x="0" y="0" width="800" height="800"/></svg>`}
export function homeShowroom(s,rows,secondary=false){
 const records=homeShowroomRecords(s,rows),index=homeRecordIndex(records);
 if(!records.length)return `<section class="container hs-empty"><${secondary?'h2':'h1'}>Tu próxima elección para el hogar.</${secondary?'h2':'h1'}><p>Encontrá más productos e ideas para tu casa.</p><a class="button" href="#catalogo?cat=Hogar&lista=1">Explorar Hogar ${icon('arrow',17)}</a></section>`;
 return `<section class="home-showroom" data-home-showroom aria-labelledby="home-showroom-title"><${secondary?'h2':'h1'} class="sr-only" id="home-showroom-title">Hogar, productos en primer plano</${secondary?'h2':'h1'}><div class="container hs-layout"><div class="hs-copy">${records.map((r,i)=>`<article data-home-panel="${i}" data-home-id="${r.id}" ${i===index?'':'hidden inert'}><p class="hs-kicker">HOGAR FUSSETTI <span>/ ${r.family}</span></p><h2>${r.name}</h2><p class="hs-story">${r.copy}</p><div class="hs-facts">${r.facts.map(f=>`<span>${e(f)}</span>`).join('')}</div><div class="hs-price"><small>PRECIO PUBLICADO</small><strong>${combinationMoney(r.price)}</strong><span>${e(r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.')}</span></div><div class="hs-actions"><a href="${detail(r)}" class="button outline">Conocer producto ${icon('arrow',16)}</a>${buyButton(s,r.p,true)}</div><div class="hs-context-links"><a href="${guide(r)}">${icon('settings',14)} Ayudame a elegir</a><a href="#consulta?producto=${r.p.id}&branch=${e(s.shopping.branch)}">Consultar este producto ${icon('arrow',13)}</a></div><div class="hs-complete"><span>COMPLETÁ TU AMBIENTE</span><p>${r.extra}</p><button type="button" class="text-button" data-home-combo="${r.combo}">Ver combinación ${icon('arrow',15)}</button></div><small class="hs-demo">Precio relevado al 4/11/2026 · Compra y entrega demo</small></article>`).join('')}</div><div class="hs-gallery"><div class="hs-stage" data-home-stage role="group" aria-label="Elegí un producto con las flechas o las miniaturas" tabindex="0">${records.map((r,i)=>`<button type="button" class="hs-item" data-home-item="${i}" data-home-id="${r.id}" aria-label="Ver ${e(r.name)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}><span class="hs-shadow" aria-hidden="true"></span>${homeImage(r)}<span class="hs-item-label" aria-hidden="true">${r.name}</span></button>`).join('')}<div class="hs-arrows"><button type="button" data-home-prev aria-label="Producto anterior">${icon('arrow',20)}</button><button type="button" data-home-next aria-label="Producto siguiente">${icon('arrow',20)}</button></div></div><div class="hs-selection" aria-label="Elegir producto de Hogar">${records.map((r,i)=>`<button type="button" data-home-select="${i}" data-home-id="${r.id}" aria-label="Seleccionar ${e(r.name)}" aria-pressed="${i===index}"><span class="hs-thumbnail">${homeImage(r)}</span><span>${r.name}</span></button>`).join('')}</div><p class="hs-image-note">Fotos del catálogo oficial · Revisá medidas, colores y variantes en la ficha</p></div></div><p class="sr-only" data-home-status role="status"></p></section>`;
}
export function homeAdvantages(s,rows,general=false){
 const records=homeShowroomRecords(s,rows),r=records[homeRecordIndex(records)];
 return `<section class="container hs-advantages" aria-labelledby="home-support-title"><div class="hs-support-intro"><p class="eyebrow">ELEGIR BIEN. SENTIRTE CERCA.</p><h2 id="home-support-title">Elegís un producto.<br>Contás con Fussetti.</h2></div><div class="hs-support-grid"><a href="${r&&!general?guide(r):'#guia?cat=Hogar'}" data-home-benefit="guide">${icon('settings',23)}<h3>Te ayudamos a elegir.</h3><p>Guía y comparación para entender qué cambia entre tus opciones.</p><span>Encontrá lo que va con vos ${icon('arrow',15)}</span></a><a href="#sucursales">${icon('pin',23)}<h3>Estamos cerca.</h3><p>Elegí una sucursal y prepará tu consulta con el producto que te interesa.</p><span>Encontrar una sucursal ${icon('arrow',15)}</span></a><a href="${r&&!general?detail(r):'#catalogo?cat=Hogar&lista=1'}" data-home-benefit="details">${icon('cart',23)}<h3>Comprás con claridad.</h3><p>Precio y cuotas publicados. Revisá el total y la entrega antes de confirmar.</p><span>Conocé todos los detalles ${icon('arrow',15)}</span></a><a href="#mis-productos">${icon('shield',23)}<h3>Seguimos después.</h3><p>Tu pedido, comprobantes y productos reunidos en tu cuenta demo.</p><span>Ver mis productos ${icon('arrow',15)}</span></a></div></section>`;
}
