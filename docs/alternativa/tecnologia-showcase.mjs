import {sectorHref,sectorProducts,sectorSelection,curatedSector,sectors} from './sector-model.mjs';
import {product,unitPrice} from './domain.mjs';
import {initialOfficialStock} from './official-commerce.mjs';
import {classifyOfficial} from './official-taxonomy.mjs';
import {buyButton} from './product-views.mjs';
import {combinationMoney} from './hogar-combo-views.mjs';
import {bindHomeShowroom} from './hogar-showroom-motion.mjs?v=vitrina1';
import {bestPose} from './hogar-mas-vendidos.mjs';
import {e,icon} from '../nueva/ui.mjs';

// Adapts the existing HorizonX Motion Focus interaction to a technology showroom.
// Editorial selections, without an unverifiable claim about sales rank.
export const techIds=['3634','3123','3590','3305','2644','3535'];
export const techUi={id:''};
const shortNames={'3634':'Samsung Galaxy A37 5G','3123':'Samsung Galaxy A16','3590':'Notebook Gfast Ryzen 5','3305':'PlayStation 5 · 1 TB','2644':'Smartwatch Grow Home GR27','3535':'Cámara Tapo C500'};
const local=new Set(['3634','3590','3305']);
export const techPhoto=row=>local.has(row.id_oficial)?'https://fussetti-replica-20261102.germanvives15.chatgpt.site/alternativa/assets/sectores/'+row.id_oficial+'.jpg':(row.imagenes[1]||row.imagenes.find(x=>x.portada)||row.imagenes[0])?.url||'';
export function techRecords(s,rows){
 return curatedSector(s,rows,'tecnologia',techIds,6).map(row=>{
  const id=row.id_oficial,stored=product(s,'official-'+id),stock=stored?.stock??initialOfficialStock(row);
  const p=stored||{id:'official-'+id,name:row.nombre,source:'fussetti-official',kind:'product',type:classifyOfficial(row),price:row.precio_centavos,stock,branchIds:s.branches.map(b=>b.id),official:{id}};
  return {id,row,p,price:unitPrice(s,p),name:shortNames[id]||row.nombre,photo:techPhoto(row)};
 });
}
const picture=r=>`<img src="${e(r.photo)}" alt="" loading="lazy" draggable="false">`;
export function techShowcase(s,rows){
 const records=techRecords(s,rows),index=Math.max(0,records.findIndex(r=>r.id===techUi.id));
 const main=`<div class="container tf-intro"><div><p class="eyebrow">TECNOLOGÍA FUSSETTI</p><h1>Conectá con lo que<br><em>te mueve.</em></h1><p>Tu próximo celular. Tu espacio de trabajo. Tus ganas de jugar.</p></div><div class="tf-start"><a class="button" href="${e(sectorHref('tecnologia'))}">Explorar los ${sectorProducts(rows,'tecnologia').length} productos ${icon('arrow',17)}</a><a class="text-link" href="#guia?cat=Tecnolog%C3%ADa">Ayudame a elegir ${icon('arrow',16)}</a></div></div>`;
 if(!records.length)return `${main}<p class="container tf-empty">No hay destacados disponibles en este escenario demo. Explorá el catálogo completo.</p>`;
 return `${main}<section class="tf-focus" data-tech-showroom aria-label="Selección de Tecnología"><div class="container tf-layout"><div class="gf-details tf-details">${records.map((r,i)=>`<article data-tech-panel="${i}" class="tf-panel" ${i===index?'':'hidden inert'}><p class="tf-kicker">SELECCIÓN FUSSETTI / ${e(r.row.marca||'TECNOLOGÍA')}</p><h2>${e(r.name)}</h2><p class="tf-full-name">${e(r.row.nombre)}</p><div class="tf-facts">${r.row.especificaciones.filter(a=>['Memoria RAM','Memoria interna','Wifi','Bluetooth','Sistema operativo'].includes(a.nombre.trim())).slice(0,2).map(a=>`<span><b>${e(a.valor)}</b>${e(a.nombre)}</span>`).join('')}</div><div class="gf-price tf-price"><small>PRECIO PUBLICADO</small><strong>${e(r.p.price===r.row.precio_centavos?r.row.precio_texto:combinationMoney(r.price))}</strong><p>${e(r.p.price===r.row.precio_centavos?r.row.cuotas_texto||'Consultá las condiciones en la ficha.':'Revisá las cuotas en la ficha.')}</p></div><div class="tf-actions">${buyButton(s,r.p,true)}<a class="button outline" href="#producto-oficial/${r.id}">Conocer producto ${icon('arrow',15)}</a></div><button class="tf-quick" data-quick="${r.p.id}" aria-label="Vista rápida de ${e(r.row.nombre)}">Vista rápida ${icon('arrow',15)}</button><p class="tf-availability">Disponible en demo · entrega simulada</p></article>`).join('')}</div><div class="tf-gallery"><div class="gf-stage tf-stage" data-tech-stage tabindex="0" role="group" aria-roledescription="carrusel" aria-label="Productos de Tecnología. Usá las flechas, Inicio o Fin para elegir.">${records.map((r,i)=>`<button type="button" class="gf-product tf-product" data-tech-item="${i}" data-tech-id="${r.id}" aria-label="Ver ${e(r.name)} en primer plano" aria-pressed="${i===index}" ${i===index?'':'tabindex="-1"'}>${picture(r)}</button>`).join('')}${records.length>1?`<div class="gf-arrows"><button type="button" data-tech-prev aria-label="Producto de tecnología anterior">${icon('arrow',20)}</button><button type="button" data-tech-next aria-label="Producto de tecnología siguiente">${icon('arrow',20)}</button></div>`:''}</div>${records.length>1?`<div class="gf-selector tf-selector" aria-label="Elegir producto de Tecnología">${records.map((r,i)=>`<button type="button" data-tech-select="${i}" aria-label="Seleccionar ${e(r.name)}" aria-pressed="${i===index}"><span class="tf-thumb">${picture(r)}</span><span>${e(r.name)}</span></button>`).join('')}</div>`:''}</div></div><p class="container tf-source">Selección editorial · Fotos, precios y cuotas del catálogo oficial relevado al 4/11/2026 · Compra y stock demo.</p><p class="sr-only" data-tech-status role="status"></p></section>`;
}
export function techCategories(rows){
 const copy={celulares:['Siempre con vos.','Celulares para comparar memoria y precio.'],computacion:['Dale lugar a tus ideas.','Notebooks y tablets para tu próximo equipo.'],gaming:['Entrá en juego.','Consolas y accesorios para explorar.'],trabajo:['Armá tu espacio.','Monitores, impresoras y sillas para elegir.'],conectados:['Más formas de conectar.','Relojes y cámaras del catálogo.'],accesorios:['El detalle que faltaba.','Teclados, mouse y accesorios.']};
 return `<section class="container tf-categories" aria-labelledby="tech-categories-title"><div class="tf-section-heading"><div><p class="eyebrow">EMPEZÁ POR TUS GANAS</p><h2 id="tech-categories-title">¿Qué querés hacer hoy?</h2></div><a class="text-link" href="${e(sectorHref('tecnologia'))}">Ver toda Tecnología ${icon('arrow',16)}</a></div><div class="tf-category-grid">${sectors.tecnologia.collections.map((c,i)=>{const group=sectorSelection(rows,'tecnologia',c.id);if(!group.length)return '';const row=group.find(r=>r.id_oficial===c.image)||group[0];return `<a class="tf-category tf-category-${i}" href="${e(sectorHref('tecnologia',c.id))}"><div class="tf-category-copy"><small>${e(c.title)} · ${group.length} productos</small><h3>${e(copy[c.id][0])}</h3><p>${e(copy[c.id][1])}</p><b>Explorar ${icon('arrow',17)}</b></div><img src="${e(techPhoto(row))}" alt="" loading="lazy"></a>`}).join('')}</div></section>`;
}
export const bindTechShowcase=host=>bindHomeShowroom(host,{prefix:'tech',ui:techUi,pose:bestPose,heading:'h2',scrollSelector:true});
